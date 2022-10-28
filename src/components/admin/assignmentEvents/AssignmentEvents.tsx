import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";

import './AssignmentEvents.scss';
import { ReduxCombinedState } from "redux/reducers";
import actions from 'redux/actions/requestFailed';
import { getAllAssignmentsByAdmin } from 'components/teach/service';

import { User } from "model/user";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import AssignmentsSidebar, { PDateFilter } from "./AssignmentsSidebar";
import BricksTab, { BricksActiveTab } from "../bricksPlayed/BricksTab";
import { Subject } from "model/brick";
import { getSubjects } from "services/axios/subject";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import SubTab, { ClassesActiveSubTab } from "../components/SubTab";
import { Assignment } from "model/classroom";
import { stripHtml } from "components/build/questionService/ConvertService";
import { CDomain } from "../classesEvents/ClassesSidebar";
import { exportToCSV } from "services/excel";
import ExportBtn from "../components/ExportBtn";
import { exportToPDF } from "services/pdf";


enum SortBy {
  Teacher,
  Class,
  Domain,
  Brick
}

interface TeachProps {
  history: any;
  searchString: string;

  // redux
  user: User;
  requestFailed(e: string): void;
}

interface TeachState {
  sortBy: SortBy;
  downloadClicked: boolean;
  subjects: Subject[];
  selectedSubjects: Subject[];
  assignments: Assignment[];
  finalAssignments: Assignment[];
  dateFilter: PDateFilter;
  allDomains: boolean;
  domains: CDomain[];
}

class AssignmentEvents extends Component<TeachProps, TeachState> {
  constructor(props: TeachProps) {
    super(props);

    this.state = {
      sortBy: SortBy.Teacher,
      downloadClicked: false,
      dateFilter: PDateFilter.Past24Hours,
      subjects: [],
      selectedSubjects: [],
      assignments: [],
      finalAssignments: [],
      allDomains: true,
      domains: []
    }
    this.loadInitPlayedData();
  }

  getUserDomainFromAssignment(a: any) {
    return a.classroom?.creator?.email.split("@")[1];
  }

  async loadInitPlayedData() {
    const assignments = await getAllAssignmentsByAdmin(PDateFilter.Past24Hours);
    if (assignments) {
      const domains: CDomain[] = [];
      for (let a of assignments) {
        const userEmailDomain = this.getUserDomainFromAssignment(a);
        const found = domains.find(d => d.name == userEmailDomain);
        if (!found) {
          domains.push({ checked: false, name: userEmailDomain });
        }
      }
      this.setState({ assignments, finalAssignments: assignments, domains });
    }
    const subjects = await getSubjects();
    if (subjects) {
      this.setState({ subjects });
    }
  }

  async loadData(dateFilter: PDateFilter) {
    const assignments = await getAllAssignmentsByAdmin(dateFilter);
    if (assignments) {
      const finalAssignments = this.filterAndSort(assignments, this.state.selectedSubjects, this.state.sortBy, this.state.allDomains, this.state.domains);

      const domains: CDomain[] = [];
      for (let a of assignments) {
        const userEmailDomain = this.getUserDomainFromAssignment(a);
        const found = domains.find(d => d.name == userEmailDomain);
        if (!found) {
          domains.push({ checked: false, name: userEmailDomain });
        }
      }

      this.setState({ assignments, finalAssignments, dateFilter, domains });
    }
  }

  search() { }
  searching() { }

  sortAssignments(sortBy: SortBy, assignments: Assignment[]) {
    if (sortBy === SortBy.Teacher) {
      return assignments.sort((a, b) => {
        const aT = a.classroom?.teachers[0]?.firstName?.toLocaleLowerCase();
        const bT = b.classroom?.teachers[0]?.firstName?.toLocaleLowerCase();
        return aT < bT ? -1 : 1;
      });
    } else if (sortBy === SortBy.Class) {
      return assignments.sort((a, b) => {
        let aT = a.classroom.name.toLocaleLowerCase();
        let bT = b.classroom.name.toLocaleLowerCase();
        return aT < bT ? -1 : 1;
      });
    } else if (sortBy === SortBy.Domain) {

    } else if (sortBy === SortBy.Brick) {
      return assignments.sort((a, b) => {
        let aT = stripHtml(a.brick.title).toLocaleLowerCase();
        let bT = stripHtml(b.brick.title).toLocaleLowerCase();

        return aT < bT ? -1 : 1;
      });

    } else {
      return assignments;
    }
    return assignments;
  }

  renderBody() {
    const { finalAssignments } = this.state;
    if (finalAssignments.length == 0) {
      return <div className="table-body">
        <div className="table-row">
          <div className="name-column">No Assignments</div>
        </div>
      </div>;
    }

    const renderDomain = (a: any) => {
      const userEmailDomain = this.getUserDomainFromAssignment(a);

      if (userEmailDomain) {
        return (<div className="domain-column">
          {userEmailDomain}
        </div>);
      }
      return <div className="domain-column"></div>;
    }

    return <div className="table-body">
      {finalAssignments.map(a => {
        return (
          <div className="table-row">
            <div className="name-column">{a.classroom?.teachers[0].firstName} {a.classroom?.teachers[0].lastName}</div>
            <div className="creator-column">
              {a.classroom?.name}
            </div>
            {renderDomain(a)}
            <div className="assigned-column"><div>{stripHtml(a.brick.title)}</div></div>
          </div>
        );
      })}
    </div>
  }

  filterAndSort(assignments: Assignment[], selectedSubjects: Subject[], sortBy: SortBy, isAllDomains: boolean, domains: CDomain[]) {
    let finalAssignments = [];
    if (selectedSubjects.length > 0) {
      for (let a of assignments) {
        const found = selectedSubjects.find(s => s.id === a.classroom.subjectId);
        if (found) {
          finalAssignments.push(a);
        }
      }
    } else {
      finalAssignments = [...assignments];
    }

    let checkedDomains = domains.filter(d => d.checked === true);

    // filter by domain
    if (!isAllDomains && checkedDomains) {
      let assignmentsTemp = finalAssignments;
      finalAssignments = [] as any[];
      for (let a of assignmentsTemp) {
        if (a.classroom && a.classroom.creator) {
          const userEmailDomain = this.getUserDomainFromAssignment(a);
          const found = checkedDomains.find(d => d.name === userEmailDomain);
          if (found) {
            finalAssignments.push(a);
          }
        }
      }
    }

    finalAssignments = this.sortAssignments(sortBy, finalAssignments);
    return finalAssignments;
  }

  renderTable() {
    return (
      <div className="table">
        <div className="table-head bold">
          <div className="name-column header">
            <div>Teacher</div>
            <div>
              <SpriteIcon
                name="sort-arrows"
                onClick={() => {
                  const finalAssignments = this.filterAndSort(this.state.assignments, this.state.selectedSubjects, SortBy.Teacher, this.state.allDomains, this.state.domains)
                  this.setState({ sortBy: SortBy.Teacher, finalAssignments });
                }}
              />
            </div>
          </div>
          <div className="creator-column header">
            <div>Class</div>
            <div>
              <SpriteIcon
                name="sort-arrows"
                onClick={() => {
                  const finalAssignments = this.filterAndSort(this.state.assignments, this.state.selectedSubjects, SortBy.Class, this.state.allDomains, this.state.domains)
                  this.setState({ sortBy: SortBy.Class, finalAssignments });
                }}
              />
            </div>
          </div>
          <div className="domain-column header">
            <div>Domain</div>
            <div>
              <SpriteIcon
                name="sort-arrows"
                onClick={() => {
                  const finalAssignments = this.filterAndSort(this.state.assignments, this.state.selectedSubjects, SortBy.Domain, this.state.allDomains, this.state.domains)
                  this.setState({ sortBy: SortBy.Domain, finalAssignments });
                }}
              />
            </div>
          </div>
          <div className="assigned-column header">
            <div>Brick</div>
            <div>
              <SpriteIcon
                name="sort-arrows"
                onClick={() => {
                  const finalAssignments = this.filterAndSort(this.state.assignments, this.state.selectedSubjects, SortBy.Brick, this.state.allDomains, this.state.domains)
                  this.setState({ sortBy: SortBy.Brick, finalAssignments });
                }}
              />
            </div>
          </div>
        </div>
        {this.renderBody()}
      </div>
    );
  }

  render() {
    return (
      <div className="main-listing user-list-page manage-classrooms-page bricks-played-page classes-events-page">
        <PageHeadWithMenu
          page={PageEnum.ManageClasses}
          placeholder="Brick Title, Student Name, or Subject"
          user={this.props.user}
          history={this.props.history}
          search={this.search.bind(this)}
          searching={this.searching.bind(this)}
        />
        <Grid container direction="row" className="sorted-row back-to-work-teach">
          <AssignmentsSidebar
            isLoaded={true}
            setAllDomains={() => {
              this.state.domains.forEach(d => { d.checked = false });
              const finalAssignments = this.filterAndSort(this.state.assignments, this.state.selectedSubjects, this.state.sortBy, true, this.state.domains);
              this.setState({ allDomains: true, finalAssignments });
            }}
            setDomain={d => {
              this.state.domains.forEach(d => { d.checked = false });
              d.checked = true;
              const finalAssignments = this.filterAndSort(this.state.assignments, this.state.selectedSubjects, this.state.sortBy, false, this.state.domains);
              this.setState({ allDomains: false, finalAssignments });
            }}
            allDomains={this.state.allDomains}
            domains={this.state.domains}
            dateFilter={this.state.dateFilter} setDateFilter={dateFilter => this.loadData(dateFilter)}
            subjects={this.state.subjects}
            selectedSubjects={this.state.selectedSubjects}
            selectSubjects={selectedSubjects => {
              const finalAssignments = this.filterAndSort(this.state.assignments, selectedSubjects, SortBy.Teacher, this.state.allDomains, this.state.domains)
              this.setState({ selectedSubjects, finalAssignments });
            }}
          />
          <Grid item xs={9} className="brick-row-container">
            <BricksTab activeTab={BricksActiveTab.Classes} history={this.props.history} />
            <div className="tab-content">
              <SubTab activeTab={ClassesActiveSubTab.Assignments} history={this.props.history} />
              <ExportBtn onClick={() => this.setState({ downloadClicked: true })} />
              {this.state.downloadClicked && <Dialog className="sort-dialog-classes export-dialog-ew35" open={this.state.downloadClicked} onClose={() => this.setState({ downloadClicked: false })}>
                <div className="popup-3rfw bold">
                  <div className="btn-sort" onClick={() => {

                    let data: any[] = [];

                    for (const a of this.state.finalAssignments) {
                      const userEmailDomain = this.getUserDomainFromAssignment(a);

                      data.push({
                        Teacher: `${a.classroom?.teachers[0].firstName} ${a.classroom?.teachers[0].lastName}`,
                        Class: a.classroom?.name,
                        Domain: userEmailDomain,
                        Brick: stripHtml(a.brick.title)
                      });
                    }

                    exportToCSV(data, "table");

                    this.setState({ downloadClicked: false });
                  }}>
                    <div>Export to Excel</div>
                    <SpriteIcon name="excel-icon" />
                  </div>
                  <div className="btn-sort" onClick={() => {
                    exportToPDF(
                      [['Teacher', 'Class', 'Domain', 'Brick']],
                      this.state.finalAssignments.map(a => {
                        const userEmailDomain = this.getUserDomainFromAssignment(a);

                        return [
                          `${a.classroom?.teachers[0].firstName} ${a.classroom?.teachers[0].lastName}`,
                          a.classroom?.name,
                          userEmailDomain,
                          stripHtml(a.brick.title)
                        ]
                      }),
                      'table.pdf'
                    );
                    this.setState({ downloadClicked: false });
                  }}>
                    <div>Export to PDF</div>
                    <img alt="brill" src="/images/PDF_icon.png" />
                  </div>
                </div>
              </Dialog>}
              {this.renderTable()}
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e)),
});

export default connect(mapState, mapDispatch)(AssignmentEvents);
