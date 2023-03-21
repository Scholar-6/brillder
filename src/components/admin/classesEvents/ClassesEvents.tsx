import React, { Component } from "react";
import { History } from "history";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import queryString from 'query-string';

import './ClassesEvents.scss';
import { ReduxCombinedState } from "redux/reducers";
import actions from 'redux/actions/requestFailed';

import { User } from "model/user";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import ClassesSidebar, { CDomain, PDateFilter } from "./ClassesSidebar";
import BricksTab, { BricksActiveTab } from "../bricksPlayed/BricksTab";
import { Subject } from "model/brick";
import { getSubjects } from "services/axios/subject";
import { ClassroomApi } from "components/teach/service";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { exportToCSV } from "services/excel";
import { exportToPDF } from "services/pdf";
import map from "components/map";
import { fileFormattedDate, getDateString, getDateStringV2, getFormattedDate } from "components/services/brickService";
import { stripHtml } from "components/build/questionService/ConvertService";
import { getAllAdminClassrooms, getAllAdminClassroomsStudents, getAllUniqueEmails } from "services/axios/admin";
import BackPagePagination from "components/backToWorkPage/components/BackPagePagination";
import { playCover } from "components/play/routes";
import FileSaver from "file-saver";


export enum ACSortBy {
  Name,
  CreatedOn,
  Teacher,
  Students,
  Bricks,
  Domain,
  RecentBrick,
  Creator,
}

interface TeachProps {
  history: History;
  searchString: string;

  // redux
  user: User;
  requestFailed(e: string): void;
}

interface TeachState {
  page: number;
  pageSize: number;
  count: number;

  sortBy: ACSortBy;
  isAscending: boolean;

  downloadClicked: boolean;
  allDomains: boolean;
  domains: CDomain[];
  subjects: Subject[];
  selectedSubjects: Subject[];
  classrooms: ClassroomApi[];
  finalClassrooms: ClassroomApi[];
  dateFilter: PDateFilter;

  isSearching: boolean;
  searchString: string;
}

class ClassesEvents extends Component<TeachProps, TeachState> {
  constructor(props: TeachProps) {
    super(props);

    let sortBy = ACSortBy.CreatedOn;
    let dateFilter = PDateFilter.PastWeek;

    const values = queryString.parse(props.history.location.search);
    if (values.dateFilter) {
      dateFilter = parseInt(values.dateFilter as string);
    }

    this.state = {
      sortBy,
      isAscending: false,

      downloadClicked: false,
      dateFilter,
      subjects: [],
      selectedSubjects: [],
      allDomains: true,
      domains: [],
      classrooms: [],
      finalClassrooms: [],

      page: 0,
      pageSize: 20,
      count: 0,

      isSearching: false,
      searchString: '',
    }
    this.loadInitPlayedData(dateFilter, sortBy);
  }

  async loadInitPlayedData(dateFilter: PDateFilter, sortBy: ACSortBy) {
    const classroomPage = await getAllAdminClassrooms(dateFilter, {
      page: this.state.page,
      pageSize: this.state.pageSize,
      subjectIds: [],
      sortBy,
      isAscending: this.state.isAscending,
      domains: [],
      searchString: ''
    });

    const domains = await getAllUniqueEmails(dateFilter, []);

    if (classroomPage) {
      const { classrooms } = classroomPage;
      this.setState({ classrooms, finalClassrooms: classrooms, domains, count: classroomPage.count });
    }
    const subjects = await getSubjects();
    if (subjects) {
      this.setState({ subjects });
    }
  }

  moveNext() {
    this.loadData(
      this.state.dateFilter, this.state.page + 1, this.state.selectedSubjects,
      this.state.sortBy, this.state.isAscending,
      this.state.isSearching ? this.state.searchString : '',
      true
    );
  }

  moveBack() {
    this.loadData(
      this.state.dateFilter, this.state.page - 1, this.state.selectedSubjects,
      this.state.sortBy, this.state.isAscending,
      this.state.isSearching ? this.state.searchString : '',
      true
    );
  }

  async loadData(
    dateFilter: PDateFilter, page: number, selectedSubjects: Subject[],
    sortBy: ACSortBy, isAscending: boolean, searchString: string, notLoadDomains?: boolean
  ) {
    const classroomPage = await getAllAdminClassrooms(dateFilter, {
      page,
      pageSize: this.state.pageSize,
      subjectIds: selectedSubjects.map(s => s.id),
      sortBy,
      isAscending,
      domains: this.state.domains.filter(d => d.checked).map(d => d.name),
      searchString
    });

    let domains: CDomain[] = [];

    if (notLoadDomains === true) {
      domains = this.state.domains;
    } else {
      domains = await getAllUniqueEmails(dateFilter, []);
      this.state.domains.map(d => {
        if (d.checked) {
          const domain = domains.find(d2 => d2.name === d.name);
          if (domain) {
            domain.checked = true;
          }
        }
      })
    }

    if (classroomPage) {
      const { classrooms } = classroomPage;
      this.setState({
        classrooms, finalClassrooms: classrooms,
        dateFilter, domains, page, selectedSubjects, count: classroomPage.count,
        sortBy, isAscending
      });
    }
  }

  search() {
    this.loadData(
      this.state.dateFilter, 0, this.state.selectedSubjects,
      this.state.sortBy, this.state.isAscending,
      this.state.searchString,
      true
    );

    this.setState({ isSearching: true });
  }

  async searching(searchString: string) {
    if (searchString.length <= 2) {
      this.loadData(
        this.state.dateFilter, 0, this.state.selectedSubjects,
        this.state.sortBy, this.state.isAscending,
        '',
        true
      );
      this.setState({ ...this.state, searchString, isSearching: false });
    } else {
      this.setState({ ...this.state, searchString });
    }
  }

  renderStudentsIcon(c: ClassroomApi, total: number) {
    if (total === 0) {
      return <SpriteIcon name="students-3" className="active" />
    }

    return (
      <SpriteIcon
        name={`students-${total === c.students.length ? 1 : 2}`}
        className="active"
        onClick={() => this.props.history.push(map.ManageClassroomsTab + '?classroomId=' + c.id)}
      />
    );
  }

  renderStudentsColumn(c: ClassroomApi) {
    let total = c.students.length;
    if (c.studentsInvitations) {
      total += c.studentsInvitations.length;
    }
    return <div className="students-column">
      {this.renderStudentsIcon(c, total)}
      {c.students.length}/<span className="bigger">{total}</span>
      {total > 0 &&
        <div className="absolute-students-hover">
          <span className="bold">{c.students.length}</span> Students Registered out of <span className="bold">{total}</span> Invited
        </div>}
    </div>
  }

  renderBricksColumns(c: ClassroomApi) {
    let count = 0;
    if (c.assignments) {
      count = c.assignments.length;
    }

    return (
      <div className="bricks-column">
        {count}
        {count > 0 && <div className="absolute-bricks-hover">
          <div className="bold">Assigned Bricks</div>
          <ul>
            {c.assignments?.map((a, key) =>
              <li key={key}>{stripHtml(a.brick.title)}</li>
            )}
          </ul>
        </div>}
      </div>
    );
  }

  renderRecentAssignmentColumn(c: ClassroomApi) {
    let latest: any = null;
    if (c.assignments && c.assignments.length > 0) {
      latest = c.assignments[0];
    }
    return (
      <div className="assigned-column">
        {latest ? <span>
          {getFormattedDate(latest.assignedDate)} <span className="underline" onClick={() => { this.props.history.push(playCover(latest.brick)) }}>
            {stripHtml(latest.brick.title)}
          </span>
        </span> : ''}
      </div>
    );
  }

  renderActivityIcon(c: ClassroomApi, total: number) {
    let goodActivity = false;
    if (c.assignments && c.assignments.length > 0 && c.students.length > 0) {
      for (let student of c.students) {
        let activity = 0;
        for (let a of c.assignments) {
          if (a.attempts) {
            let found = a.attempts.find((at: any) => at.studentId === student.id);
            if (found) {
              activity += 1;
            }
          }
        }
        let tasksCount = c.assignments.length;
        if (activity / tasksCount >= 0.75) {
          goodActivity = true;
          break;
        }
      }
    }

    if (total === 0) {
      return <SpriteIcon name="circle-progress-admin-3" />;
    }
    return (
      <SpriteIcon
        name={`circle-progress-admin-${goodActivity ? 1 : 2}`}
        className="active"
        onClick={() => { this.props.history.push(map.TeachAssignedClass(c.id)) }}
      />
    )
  }

  renderActivityColumn(c: ClassroomApi) {
    let total = 0;
    if (c.assignments && c.assignments.length > 0 && c.students.length > 0) {
      for (let a of c.assignments) {
        if (a.attempts && a.attempts.length > 0) {
          total = a.attempts.length;
        }
      }
    }

    return (
      <div className="activity-column">
        <div className="bricks-book-icon">
          {this.renderActivityIcon(c, total)}
        </div>
        {total}
        {total > 0 && <div className="absolute-activity-hover">
          <div className="bold">Activity</div>
          <ul>
            {c.assignments?.map((a, key) => <li><span><span className="title-de234">{stripHtml(a.brick.title)}</span> <span className="bold">{a.attempts?.length}</span></span></li>)}
          </ul>
        </div>}
      </div>
    );
  }

  renderBody() {
    const { finalClassrooms } = this.state;
    if (finalClassrooms.length == 0) {
      return <div>
        <div className="table-row">
          <div className="name-column">No Classes</div>
        </div>
      </div>;
    }

    const renderDomain = (creator: User) => {
      if (creator) {
        const userEmailDomain = creator.email.split("@")[1];
        return (<div className="domain-column">
          {userEmailDomain}
        </div>);
      }
      return <div />;
    }

    return <div className="table-body">
      {finalClassrooms.map((c, key) => {
        return (
          <div key={key} className="table-row">
            <div
              className="name-column underline"
              onClick={() => { this.props.history.push(map.TeachAssignedClass(c.id)) }}
            >{c.name}</div>
            <div className="created-at-column">
              {getDateString(c.created)}
            </div>
            <div className="teacher-column">
              <div>
                {c.teachers.map((t, i) =>
                  <div
                    className="teacher-row underline"
                    onClick={() => { this.props.history.push(map.TeachAssignedTab + '?teacherId=' + t.id) }}
                    key={i}
                  >
                    {t.firstName} {t.lastName}
                  </div>)
                }
              </div>
            </div>
            {this.renderStudentsColumn(c)}
            {this.renderBricksColumns(c)}
            {this.renderActivityColumn(c)}
            {renderDomain(c.creator)}
            {this.renderRecentAssignmentColumn(c)}
            <div className="creator-column">
              {c.creator ? `${c.creator.firstName} ${c.creator.lastName}` : ''}
            </div>
          </div>
        );
      })}
    </div>
  }

  filterAndSort(classrooms: ClassroomApi[], sortBy: ACSortBy, isAllDomains: boolean, domains: CDomain[], searchString: string) {
    let finalClassrooms: ClassroomApi[] = classrooms;

    // filter by search
    if (searchString) {
      const classroomsTemp = [...finalClassrooms];
      finalClassrooms = [] as ClassroomApi[];
      const searchStringLow = searchString.toLocaleLowerCase();
      for (let c of classroomsTemp) {
        const index = c.name.toLocaleLowerCase().search(searchStringLow);
        if (index >= 0) {
          finalClassrooms.push(c);
          continue;
        }
        if (c.creator) {
          if (c.creator.firstName) {
            const index = c.creator.firstName.toLocaleLowerCase().search(searchStringLow);
            if (index >= 0) {
              finalClassrooms.push(c);
              continue;
            }
          }

          if (c.creator.lastName) {
            const index = c.creator.lastName.toLocaleLowerCase().search(searchStringLow);
            if (index >= 0) {
              finalClassrooms.push(c);
            }
          }
        }
      }
    }

    return finalClassrooms;
  }

  renderSortArrow(sortBy: ACSortBy) {
    return (
      <SpriteIcon
        name="sort-arrows"
        onClick={() => {
          this.loadData(
            this.state.dateFilter, 0, this.state.selectedSubjects,
            sortBy, !this.state.isAscending,
            this.state.isSearching ? this.state.searchString : '',
            true
          );
        }}
      />
    )
  }

  renderTable() {
    return (
      <div className="table scroll">
        <div className="table-container">
          <div className="table-head bold">
            <div className="name-column header">
              <div>Name</div>
              <div>
                {this.renderSortArrow(ACSortBy.Name)}
              </div>
            </div>
            <div className="created-at-column header">
              <div>Created On</div>
              <div>
                {this.renderSortArrow(ACSortBy.CreatedOn)}
              </div>
            </div>
            <div className="teacher-column header">
              <div>Teacher</div>
            </div>
            <div className="students-column header">
              <div>Students</div>
              <div>
                {this.renderSortArrow(ACSortBy.Students)}
              </div>
            </div>
            <div className="bricks-column header">
              <div>Bricks</div>
              <div>
                {this.renderSortArrow(ACSortBy.Bricks)}
              </div>
            </div>
            <div className="activity-column header">
              <div>Activity</div>
            </div>
            <div className="domain-column header">
              <div>Domain</div>
            </div>
            <div className="assigned-column header">
              <div>Recent Brick</div>
            </div>
            <div className="creator-column header">
              <div>Creator</div>
              <div>
                {this.renderSortArrow(ACSortBy.Creator)}
              </div>
            </div>
          </div>
          {this.renderBody()}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="main-listing user-list-page manage-classrooms-page bricks-played-page classes-events-page">
        <PageHeadWithMenu
          page={PageEnum.ManageClasses}
          placeholder="Class Name, Teacher or Assigned Brick"
          user={this.props.user}
          history={this.props.history}
          search={this.search.bind(this)}
          searching={this.searching.bind(this)}
        />
        <Grid container direction="row" className="sorted-row back-to-work-teach">
          <ClassesSidebar
            isLoaded={true}
            allDomains={this.state.allDomains}
            domains={this.state.domains}
            setAllDomains={() => {
              this.state.domains.forEach(d => { d.checked = false });
              this.loadData(
                this.state.dateFilter, 0, this.state.selectedSubjects,
                this.state.sortBy, this.state.isAscending,
                this.state.isSearching ? this.state.searchString : '',
                true)
              this.setState({ allDomains: true });
            }}
            setDomain={d => {
              d.checked = !d.checked;
              this.loadData(
                this.state.dateFilter, 0, this.state.selectedSubjects, this.state.sortBy, this.state.isAscending,
                this.state.isSearching ? this.state.searchString : '',
                true);
              this.setState({ allDomains: false });
            }}

            dateFilter={this.state.dateFilter}
            setDateFilter={dateFilter => this.loadData(
              dateFilter, 0, this.state.selectedSubjects,
              this.state.sortBy, this.state.isAscending,
              this.state.isSearching ? this.state.searchString : '',
            )}

            subjects={this.state.subjects}
            selectedSubjects={this.state.selectedSubjects}
            selectSubjects={selectedSubjects => this.loadData(
              this.state.dateFilter, 0, selectedSubjects, this.state.sortBy, this.state.isAscending,
              this.state.isSearching ? this.state.searchString : '',
            )}
          />
          <Grid item xs={9} className="brick-row-container">
            <BricksTab activeTab={BricksActiveTab.Classes} history={this.props.history} />
            <div className="tab-content">
              <div>
                <div className="btn-container">
                  <div className="btn btn-green flex-center" onClick={async () =>  {
                    const res = await getAllAdminClassroomsStudents(this.state.dateFilter, {
                      subjectIds: [],
                      domains: [],
                      searchString: ''
                    });

                    if (res && res.emails && res.emails.length > 0) {
                      let data = 'EMAIL USERS BY CLASS\n';
                      let date = new Date();
                      data += date.getDate() + 'st ' + date.toLocaleString('default', { month: 'long' }) + ' ' + date.getFullYear() + ', ' + getDateStringV2(date.toString(), ':') + '\n\n';
                      data += 'FILTERS\n';
                      data += 'domain: ' + this.state.domains.filter(d => d.checked).map(d => d.name) + '\n\n';
                      data += 'EDUCATOR\n\nLEARNER\n';
                      data += res.emails.join('\n');
                      var blob = new Blob([data], {type: "text/plain"});
                      FileSaver.saveAs(blob, 'Emails_by_class.txt');
                    }
                  }}>
                    <div>Copy emails</div>
                  </div>
                  <div className="btn btn-green flex-center" onClick={() => this.setState({ downloadClicked: true })}>
                    <div>Export</div>
                    <SpriteIcon name="download" />
                  </div>
                </div>
                {this.state.downloadClicked && <Dialog className="sort-dialog-classes export-dialog-ew35" open={this.state.downloadClicked} onClose={() => this.setState({ downloadClicked: false })}>
                  <div className="popup-3rfw bold">
                    <div className="btn-sort" onClick={() => {

                      let data: any[] = [];

                      for (const c of this.state.finalClassrooms) {
                        let domain = '';
                        if (c.creator) {
                          domain = c.creator.email.split("@")[1];
                        }

                        data.push({
                          name: c.name,
                          Creator: c.teachers[0].firstName + ' ' + c.teachers[0].lastName,
                          Domain: domain,
                          Played: c.assignmentsCount,
                        });
                      }

                      exportToCSV(data, `Brillder data ${fileFormattedDate(new Date().toString())}.pdf`);

                      this.setState({ downloadClicked: false });
                    }}>
                      <div>Export to Excel</div>
                      <SpriteIcon name="excel-icon" />
                    </div>
                    <div className="btn-sort" onClick={() => {
                      exportToPDF(
                        [['Name', 'Creator', 'Domain', 'Creator', 'Students', 'Assignments']],
                        this.state.finalClassrooms.map(c => {
                          let domain = '';
                          if (c.creator) {
                            domain = c.creator.email.split("@")[1];
                          }

                          return [
                            c.name,
                            c.teachers[0].firstName + ' ' + c.teachers[0].lastName,
                            domain,
                            c.students.length,
                            c.assignmentsCount ? c.assignmentsCount : ''
                          ]
                        }),

                        `Brillder data ${fileFormattedDate(new Date().toString())}.pdf`
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
            </div>
            <BackPagePagination
              sortedIndex={this.state.page * this.state.pageSize}
              pageSize={this.state.pageSize}
              isRed={this.state.page === 0}
              bricksLength={this.state.count}
              moveNext={() => this.moveNext()}
              moveBack={() => this.moveBack()}
            />
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

export default connect(mapState, mapDispatch)(ClassesEvents);

