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
import SubTab, { ClassesActiveSubTab } from "../components/SubTab";
import { exportToCSV } from "services/excel";
import { exportToPDF } from "services/pdf";
import ExportBtn from "../components/ExportBtn";
import map from "components/map";
import { fileFormattedDate, getDateString, getFormattedDate } from "components/services/brickService";
import { stripHtml } from "components/build/questionService/ConvertService";
import { getAllAdminClassrooms } from "services/axios/admin";
import BackPagePagination from "components/backToWorkPage/components/BackPagePagination";


enum SortBy {
  Name,
  CreatedOn,
  Creator,
  Domain,
  Students,
  Assigned
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

  sortBy: SortBy;
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

    let sortBy = SortBy.CreatedOn;
    let dateFilter = PDateFilter.PastWeek;

    const values = queryString.parse(props.history.location.search);
    if (values.dateFilter) {
      dateFilter = parseInt(values.dateFilter as string);
    }

    this.state = {
      sortBy,
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

  async loadInitPlayedData(dateFilter: PDateFilter, sortBy: SortBy) {
    let classroomPage = await getAllAdminClassrooms(dateFilter, this.state.page, this.state.pageSize);
    if (classroomPage) {
      const { classrooms } = classroomPage;
      const domains: CDomain[] = [];
      for (let c of classroomPage.classrooms) {
        const userEmailDomain = c.creator.email.split("@")[1];
        const found = domains.find(d => d.name == userEmailDomain);
        if (!found) {
          domains.push({ checked: false, name: userEmailDomain });
        }
      }
      classroomPage.classrooms.sort((a, b) => {
        if (a.created && b.created) {
          return new Date(a.created).getTime() > new Date(b.created).getTime() ? -1 : 1;
        }
        return -1;
      });

      domains.sort((a, b) => {
        if (a.name && b.name) {
          const aT = a.name.toLocaleLowerCase();
          const bT = b.name.toLocaleLowerCase();
          return aT < bT ? -1 : 1;
        }
        return 1;
      });

      this.setState({ classrooms, finalClassrooms: classrooms, domains, count: classroomPage.count });
    }
    const subjects = await getSubjects();
    if (subjects) {
      this.setState({ subjects });
    }
  }

  moveNext() {
    this.loadData(this.state.dateFilter, this.state.page + 1)
  }

  moveBack() {
    this.loadData(this.state.dateFilter, this.state.page - 1)
  }

  async loadData(dateFilter: PDateFilter, page: number) {
    const classroomPage = await getAllAdminClassrooms(dateFilter, page, this.state.pageSize);
    if (classroomPage) {
      const { classrooms } = classroomPage;
      const finalClassrooms = this.filterAndSort(classrooms, this.state.selectedSubjects, this.state.sortBy, this.state.allDomains, this.state.domains, this.state.searchString);
      const domains: CDomain[] = [];
      for (let c of classrooms) {
        if (c.creator) {
          const userEmailDomain = c.creator.email.split("@")[1];
          const found = domains.find(d => d.name == userEmailDomain);
          if (!found) {
            domains.push({ checked: false, name: userEmailDomain });
          }
        }
      }

      domains.sort((a, b) => {
        if (a.name && b.name) {
          const aT = a.name.toLocaleLowerCase();
          const bT = b.name.toLocaleLowerCase();
          return aT < bT ? -1 : 1;
        }
        return 1;
      });

      this.setState({ classrooms, finalClassrooms, dateFilter, domains, page, count: classroomPage.count });
    }
  }

  search() {
    const finalClassrooms = this.filterAndSort(this.state.classrooms, this.state.selectedSubjects, this.state.sortBy, this.state.allDomains, this.state.domains, this.state.searchString);
    this.setState({ sortBy: SortBy.Name, finalClassrooms });
  }

  async searching(searchString: string) {
    if (searchString.length === 0) {
      const finalClassrooms = this.filterAndSort(this.state.classrooms, this.state.selectedSubjects, this.state.sortBy, this.state.allDomains, this.state.domains, searchString);
      //await this.getUsers(this.state.userPreference, 0, this.state.selectedSubjects, searchString, this.state.orderBy, this.state.isAscending);
      this.setState({ ...this.state, finalClassrooms, searchString, isSearching: false });
    } else {
      this.setState({ ...this.state, searchString });
    }
  }

  sortClassrooms(sortBy: SortBy, classrooms: ClassroomApi[]) {
    if (sortBy === SortBy.Name) {
      return classrooms.sort((a, b) => {
        const aT = a.name.toLocaleLowerCase();
        const bT = b.name.toLocaleLowerCase();
        return aT < bT ? -1 : 1;
      });
    } else if (sortBy === SortBy.CreatedOn) {
      return classrooms.sort((a, b) => {
        if (a.created && b.created) {
          return new Date(a.created).getTime() > new Date(b.created).getTime() ? -1 : 1;
        }
        return -1;
      });
    } else if (sortBy === SortBy.Creator) {
      return classrooms.sort((a, b) => {
        if (a.teachers.length > 0 && b.teachers.length > 0 && a.teachers[0].firstName && b.teachers[0].firstName) {
          const aT = a.teachers[0].firstName.toLocaleLowerCase();
          const bT = b.teachers[0].firstName.toLocaleLowerCase();
          return aT < bT ? -1 : 1;
        }
        return 1;
      });
    } else if (sortBy === SortBy.Students) {
      return classrooms.sort((a, b) => {
        return a.students.length < b.students.length ? 1 : -1;
      });
    } else if (sortBy === SortBy.Assigned) {
      return classrooms.sort((a, b) => {
        if (a.assignmentsCount && b.assignmentsCount) {
          return a.assignmentsCount < b.assignmentsCount ? 1 : -1;
        }
        return -1;
      });
    } else {
      return classrooms;
    }
  }

  renderStudentsColumn(c: ClassroomApi) {
    let total = c.students.length;
    if (c.studentsInvitations) {
      total += c.studentsInvitations.length;
    }
    return <div className="students-column">
      <SpriteIcon name={`students-${total === 0 ? 3 : (total === c.students.length ? 1 : 2)}`} />
      {c.students.length}/<span className="bigger">{total}</span>
    </div>
  }

  renderBricksColumns(c: ClassroomApi) {
    let count = 0;
    if (c.assignments) {
      count = c.assignments.length;
    }
    return (
      <div className="bricks-column">
        <div className="bricks-book-icon">
          <SpriteIcon name={`circle-progress-admin-${count == 0 ? 3 : 1}`} />
        </div>
        {count}
      </div>
    );
  }

  renderRecentAssignmentColumn(c: ClassroomApi) {
    let data = '';
    if (c.assignments && c.assignments.length > 0) {
      const latest = c.assignments[0];
      data = getFormattedDate(latest.assignedDate) + ' ' + stripHtml(latest.brick.title);
    }
    return (
      <div className="assigned-column">
        {data}
      </div>
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
        {total}
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
      {finalClassrooms.map(c => {
        return (
          <div className="table-row clickable" onClick={() => { this.props.history.push(map.TeachAssignedClass(c.id)) }}>
            <div className="name-column">{c.name}</div>
            <div className="created-at-column">
              {getDateString(c.created)}
            </div>
            <div className="creator-column">
              {c.teachers.map((t, i) => <div key={i}>{t.firstName} {c.creator.lastName}</div>)}
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

  filterAndSort(classrooms: ClassroomApi[], selectedSubjects: Subject[], sortBy: SortBy, isAllDomains: boolean, domains: CDomain[], searchString: string) {
    let finalClassrooms = [];

    if (selectedSubjects.length > 0) {
      for (let c of classrooms) {
        const found = selectedSubjects.find(s => s.id === c.subjectId);
        if (found) {
          finalClassrooms.push(c);
        }
      }
    } else {
      finalClassrooms = [...classrooms];
    }

    let checkedDomains = domains.filter(d => d.checked === true);

    // filter by domain
    if (!isAllDomains && checkedDomains) {
      let classroomsTemp = [...finalClassrooms];
      finalClassrooms = [] as ClassroomApi[];
      for (let c of classroomsTemp) {
        if (c.creator && c.creator) {
          const userEmailDomain = c.creator.email.split("@")[1];
          const found = checkedDomains.find(d => d.name === userEmailDomain);
          if (found) {
            finalClassrooms.push(c);
          }
        }
      }
    }

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

    finalClassrooms = this.sortClassrooms(sortBy, finalClassrooms);
    return finalClassrooms;
  }

  renderTable() {
    return (
      <div className="table scroll">
        <div className="table-container">
          <div className="table-head bold">
            <div className="name-column header">
              <div>Name</div>
              <div>
                <SpriteIcon
                  name="sort-arrows"
                  onClick={() => {
                    const finalClassrooms = this.filterAndSort(this.state.classrooms, this.state.selectedSubjects, SortBy.Name, this.state.allDomains, this.state.domains, this.state.searchString);
                    this.setState({ sortBy: SortBy.Name, finalClassrooms });
                  }}
                />
              </div>
            </div>
            <div className="created-at-column header">
              <div>Created On</div>
              <div>
                <SpriteIcon
                  name="sort-arrows"
                  onClick={() => {
                    const finalClassrooms = this.filterAndSort(this.state.classrooms, this.state.selectedSubjects, SortBy.Creator, this.state.allDomains, this.state.domains, this.state.searchString);
                    this.setState({ sortBy: SortBy.Creator, finalClassrooms });
                  }}
                />
              </div>
            </div>
            <div className="creator-column header">
              <div>Teacher</div>
              <div>
                <SpriteIcon
                  name="sort-arrows"
                  onClick={() => {
                    const finalClassrooms = this.filterAndSort(this.state.classrooms, this.state.selectedSubjects, SortBy.Domain, this.state.allDomains, this.state.domains, this.state.searchString);
                    this.setState({ sortBy: SortBy.Name, finalClassrooms });
                  }}
                />
              </div>
            </div>
            <div className="students-column header">
              <div>Students</div>
              <div>
                <SpriteIcon
                  name="sort-arrows"
                  onClick={() => {
                    const finalClassrooms = this.filterAndSort(this.state.classrooms, this.state.selectedSubjects, SortBy.Domain, this.state.allDomains, this.state.domains, this.state.searchString);
                    this.setState({ sortBy: SortBy.Name, finalClassrooms });
                  }}
                />
              </div>
            </div>
            <div className="bricks-column header">
              <div>Bricks</div>
              <div>
                <SpriteIcon
                  name="sort-arrows"
                  onClick={() => {
                    const finalClassrooms = this.filterAndSort(this.state.classrooms, this.state.selectedSubjects, SortBy.Students, this.state.allDomains, this.state.domains, this.state.searchString);
                    this.setState({ sortBy: SortBy.Name, finalClassrooms });
                  }}
                />
              </div>
            </div>
            <div className="activity-column header">
              <div>Activity</div>
            </div>
            <div className="domain-column header">
              <div>Domain</div>
              <div>
                <SpriteIcon
                  name="sort-arrows"
                  onClick={() => {
                    const finalClassrooms = this.filterAndSort(this.state.classrooms, this.state.selectedSubjects, SortBy.Assigned, this.state.allDomains, this.state.domains, this.state.searchString);
                    this.setState({ sortBy: SortBy.Name, finalClassrooms });
                  }}
                />
              </div>
            </div>
            <div className="assigned-column header">
              <div>Recent Brick</div>
              <div>
                <SpriteIcon
                  name="sort-arrows"
                  onClick={() => {
                    const finalClassrooms = this.filterAndSort(this.state.classrooms, this.state.selectedSubjects, SortBy.Assigned, this.state.allDomains, this.state.domains, this.state.searchString);
                    this.setState({ sortBy: SortBy.Name, finalClassrooms });
                  }}
                />
              </div>
            </div>
            <div className="creator-column header">
              <div>Creator</div>
              <div>
                <SpriteIcon
                  name="sort-arrows"
                  onClick={() => {
                    const finalClassrooms = this.filterAndSort(this.state.classrooms, this.state.selectedSubjects, SortBy.Assigned, this.state.allDomains, this.state.domains, this.state.searchString);
                    this.setState({ sortBy: SortBy.Name, finalClassrooms });
                  }}
                />
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
          placeholder="Brick Title, Student Name, or Subject"
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
              const finalClassrooms = this.filterAndSort(this.state.classrooms, this.state.selectedSubjects, SortBy.Assigned, true, this.state.domains, this.state.searchString);
              this.setState({ allDomains: true, finalClassrooms });
            }}
            setDomain={d => {
              d.checked = !d.checked;
              const finalClassrooms = this.filterAndSort(this.state.classrooms, this.state.selectedSubjects, SortBy.Assigned, false, this.state.domains, this.state.searchString);
              this.setState({ allDomains: false, finalClassrooms });
            }}
            dateFilter={this.state.dateFilter} setDateFilter={dateFilter => this.loadData(dateFilter, 0)}
            subjects={this.state.subjects}
            selectedSubjects={this.state.selectedSubjects}
            selectSubjects={selectedSubjects => {
              const finalClassrooms = this.filterAndSort(this.state.classrooms, selectedSubjects, SortBy.Assigned, this.state.allDomains, this.state.domains, this.state.searchString);
              this.setState({ selectedSubjects, finalClassrooms });
            }}
          />
          <Grid item xs={9} className="brick-row-container">
            <BricksTab activeTab={BricksActiveTab.Classes} history={this.props.history} />
            <div className="tab-content">
              <div>
                <SubTab activeTab={ClassesActiveSubTab.Classes} dateFilter={this.state.dateFilter} history={this.props.history} />
                <ExportBtn onClick={() => this.setState({ downloadClicked: true })} />
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

