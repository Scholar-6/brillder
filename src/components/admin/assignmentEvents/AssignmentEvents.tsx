import React, { Component } from "react";
import { History } from "history";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

import './AssignmentEvents.scss';
import { ReduxCombinedState } from "redux/reducers";
import actions from 'redux/actions/requestFailed';
import { getAllAssignmentsByAdmin } from 'components/teach/service';

import { User } from "model/user";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import BricksPlayedSidebar, { PDateFilter } from "./BricksPlayedSidebar";
import BricksTab, { BricksActiveTab } from "../bricksPlayed/BricksTab";
import { Subject } from "model/brick";
import { getSubjects } from "services/axios/subject";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import SubTab, { ClassesActiveSubTab } from "../components/SubTab";
import { Assignment } from "model/classroom";
import { stripHtml } from "components/build/questionService/ConvertService";


enum SortBy {
  Teacher,
  Class,
  Domain,
  Brick
}

interface TeachProps {
  history: History;
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
      finalAssignments: []
    }
    this.loadInitPlayedData();
  }

  async loadInitPlayedData() {
    const assignments = await getAllAssignmentsByAdmin(PDateFilter.Past24Hours);
    console.log(assignments);
    if (assignments) {
      this.setState({ assignments, finalAssignments: assignments });
    }
    const subjects = await getSubjects();
    if (subjects) {
      this.setState({ subjects });
    }
  }

  async loadData(dateFilter: PDateFilter) {
    const assignments = await getAllAssignmentsByAdmin(dateFilter);
    if (assignments) {
      const finalAssignments = this.filterAndSort(assignments, this.state.selectedSubjects, this.state.sortBy);
      this.setState({ assignments, finalAssignments, dateFilter });
    }
  }

  search() { }
  searching() { }

  sortAssignments(sortBy: SortBy, assignments: Assignment[]) {
    if (sortBy === SortBy.Teacher) {
    } else if (sortBy === SortBy.Class) {
    } else if (sortBy === SortBy.Domain) {
    } else if (sortBy === SortBy.Brick) {
    } else {
      return assignments;
    }
    return assignments;
  }

  renderBody() {
    const { finalAssignments } = this.state;
    console.log(this.state);
    if (finalAssignments.length == 0) {
      return <div>No Bricks</div>;
    }

    const renderDomain = (creator: User) => {
      if (creator.institution) {
        return (
          <div className="domain-column">
            {creator.institution.domains.map(d => <div>{d}</div>)}
          </div>
        );
      }
      return '';
    }

    return <div className="table-body">
      {finalAssignments.map(a => {
        return (
          <div className="table-row">
            <div className="name-column">{a.classroom?.teachers[0].firstName} {a.classroom?.teachers[0].lastName}</div>
            <div className="creator-column">
              {a.classroom?.name}
            </div>
            <div className="domain-column"></div>
            <div className="assigned-column">{stripHtml(a.brick.title)}</div>
          </div>
        );
      })}
    </div>
  }

  filterAndSort(assignments: Assignment[], selectedSubjects: Subject[], sortBy: SortBy) {
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
                  const finalAssignments = this.filterAndSort(this.state.assignments, this.state.selectedSubjects, SortBy.Teacher)
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
                  const finalAssignments = this.filterAndSort(this.state.assignments, this.state.selectedSubjects, SortBy.Class)
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
                  const finalAssignments = this.filterAndSort(this.state.assignments, this.state.selectedSubjects, SortBy.Domain)
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
                  const finalAssignments = this.filterAndSort(this.state.assignments, this.state.selectedSubjects, SortBy.Brick)
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
          history={history}
          search={this.search.bind(this)}
          searching={this.searching.bind(this)}
        />
        <Grid container direction="row" className="sorted-row back-to-work-teach">
          <BricksPlayedSidebar
            isLoaded={true}
            dateFilter={this.state.dateFilter} setDateFilter={dateFilter => this.loadData(dateFilter)}
            subjects={this.state.subjects}
            selectedSubjects={this.state.selectedSubjects}
            selectSubjects={selectedSubjects => {
              const finalAssignments = this.filterAndSort(this.state.assignments, selectedSubjects, SortBy.Teacher)
              this.setState({ selectedSubjects, finalAssignments });
            }}
          />
          <Grid item xs={9} className="brick-row-container">
            <BricksTab activeTab={BricksActiveTab.Classes} history={this.props.history} />
            <div className="tab-content">
              <SubTab activeTab={ClassesActiveSubTab.Assignments} history={this.props.history} />
              <div className="btn-container">
                <div className="btn btn-green flex-center" onClick={() => this.setState({ downloadClicked: true })}>
                  <div>Export</div>
                  <SpriteIcon name="upload" />
                </div>
              </div>
              {this.state.downloadClicked && <Dialog className="sort-dialog-classes export-dialog-ew35" open={this.state.downloadClicked} onClose={() => this.setState({ downloadClicked: false })}>
                <div className="popup-3rfw bold">
                  <div className="btn-sort" onClick={() => {

                    const exportToCSV = (apiData: any, fileName: string) => {
                      const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
                      const fileExtension = ".xlsx";

                      const ws = XLSX.utils.json_to_sheet(apiData);
                      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
                      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
                      const data = new Blob([excelBuffer], { type: fileType });
                      FileSaver.saveAs(data, fileName + fileExtension);
                    }

                    let data: any[] = [];

                    for (const a of this.state.finalAssignments) {
                      data.push({
                        Domain: 'name',
                      });
                    }

                    exportToCSV(data, "table");

                    this.setState({ downloadClicked: false });
                  }}>
                    <div>Export to Excel</div>
                    <SpriteIcon name="excel-icon" />
                  </div>
                  <div className="btn-sort" onClick={() => {
                    const doc = new jsPDF();
                    autoTable(doc, {
                      head: [['Name', 'Creator', 'Domain', 'Creator', 'Students', 'Assignments']],
                      body: this.state.finalAssignments.map(c => [
                        'domain',
                      ]),
                    });
                    doc.save('table.pdf')
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
