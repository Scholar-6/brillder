import React, { Component } from "react";
import { History } from "history";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import { Tooltip } from "@material-ui/core";
import queryString from 'query-string';

import { ReduxCombinedState } from "redux/reducers";
import actions from 'redux/actions/requestFailed';
import { getRealLibraries, RealLibrary } from "services/axios/realLibrary";

import './UsersEvents.scss';
import { User, UserPreferenceType, UserType } from "model/user";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import UsersSidebar from "./UsersEventsSidebar";
import BricksTab, { BricksActiveTab } from "../bricksPlayed/BricksTab";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { deleteUser, getUserDomains, getUsersV2 } from "services/axios/user";
import { getDateString, getFormattedDateSlash } from "components/services/brickService";
import UsersPagination from "components/teach/manageClassrooms/components/UsersPagination";
import ExportBtn from "../components/ExportBtn";
import { exportToCSV } from "services/excel";
import { exportToPDF } from "services/pdf";
import AddUserBtn from "../components/AddUserBtn";
import map from "components/map";
import { getSubjects } from "services/axios/subject";
import { Subject } from "model/brick";
import { CDomain, PDateFilter } from "../classesEvents/ClassesSidebar";
import AddingCreditsDialog from "./AddingCreditsDialog";


interface UsersProps {
  history: History;
  searchString: string;

  // redux
  user: User;
  requestFailed(e: string): void;
}

interface CreditDetails {
  isOpen: boolean;
  userId: number;
}

interface UsersState {
  users: User[];
  page: number,
  pageSize: number;
  totalUsersCount: number;
  userPreference: UserPreferenceType | null;

  selectedSubjects: Subject[];
  subjects: Subject[];

  creditDetails: CreditDetails;

  deleteUserId: number;
  isDeleteDialogOpen: boolean;

  isStudentClassroomOpen: boolean;
  userClassrooms: any[];

  allDomains: boolean;
  domains: CDomain[];

  isSearching: boolean;
  searchString: string;

  orderBy: string;
  isAscending: boolean;

  libraries: RealLibrary[];
  dateFilter: PDateFilter;

  downloadClicked: boolean;
}

class UsersPage extends Component<UsersProps, UsersState> {
  constructor(props: UsersProps) {
    super(props);

    let dateFilter = PDateFilter.Past24Hours;

    const values = queryString.parse(props.history.location.search);
    if (values.dateFilter) {
      dateFilter = parseInt(values.dateFilter as string);
    }

    this.state = {
      users: [],
      page: 0,
      pageSize: 14,
      totalUsersCount: 0,
      userPreference: null,
      subjects: [],
      selectedSubjects: [],

      orderBy: "user.created",
      isAscending: true,

      dateFilter,

      creditDetails: {
        isOpen: false,
        userId: -1
      },

      allDomains: true,
      domains: [],

      isStudentClassroomOpen: false,
      userClassrooms: [],

      deleteUserId: -1,
      isDeleteDialogOpen: false,

      isSearching: false,
      searchString: '',

      libraries: [],

      downloadClicked: false
    };

    this.loadInitData();
  }

  async getLibraries() {
    const libraries = await getRealLibraries();
    if (libraries) {
      this.setState({ libraries });
    }
  }

  async loadInitData() {
    const subjects = await getSubjects();
    if (subjects) {
      this.setState({ subjects });
    }
    const domains = await getUserDomains();
    if (domains) {
      let cdomains = domains.map(name => {
        return { name, checked: false }
      });
      this.setState({ domains: cdomains });
    }

    this.getUsers(null, 0, [], '', 'user.created', true, this.state.dateFilter);

    this.getLibraries();
  }

  async getUsers(
    userPreference: UserPreferenceType | null,
    page: number,
    selectedSubjects: Subject[],
    searchString: string,
    orderBy: string,
    isAscending: boolean,
    dateFilter: PDateFilter,
  ) {
    let roleFilters = [];
    if (userPreference !== null) {
      roleFilters.push(userPreference);
    }

    const domains = this.state.domains.filter(d => d.checked === true).map(d => d.name);

    const res = await getUsersV2({
      pageSize: this.state.pageSize,
      page: page.toString(),
      searchString,
      subjectFilters: selectedSubjects.map(s => s.id),
      roleFilters,
      orderBy,
      dateFilter,
      isAscending,
      domains
    });
    if (res) {
      this.setState({
        userPreference,
        page,
        users: res.pageData,
        selectedSubjects,
        orderBy,
        isAscending,
        dateFilter,
        totalUsersCount: res.totalCount
      });
    }
  }

  search() {
    const { searchString } = this.state;
    this.getUsers(
      this.state.userPreference,
      0,
      this.state.selectedSubjects,
      searchString,
      this.state.orderBy,
      this.state.isAscending,
      this.state.dateFilter,
    );

    setTimeout(() => {
      this.setState({ isSearching: true });
    })
  }

  async searching(searchString: string) {
    if (searchString.length === 0) {
      await this.getUsers(this.state.userPreference, 0, this.state.selectedSubjects, searchString, this.state.orderBy, this.state.isAscending, this.state.dateFilter);
      this.setState({ ...this.state, searchString, isSearching: false });
    } else {
      this.setState({ ...this.state, searchString });
    }
  }

  renderLibrary(user: User) {
    if (user.library) {
      const libraryId = user.library.id;
      const library = this.state.libraries.find(l => l.id === libraryId);

      return <div className="library-user-icon">
        <img alt="" src="/images/library.png" />
        {library && <div className="css-custom-tooltip bold">{library.name}</div>}
      </div>
    }

    return '';
  }

  renderUserType(u: User) {
    if (u.roles.find(r => r.roleId === UserType.Admin)) {
      return 'Admin';
    } else if (u.roles.find(r => r.roleId === UserType.Publisher)) {
      return 'Publisher';
    } else if (u.roles.find(r => r.roleId === UserType.Institution)) {
      return 'Institution';
    } else if (u.userPreference) {
      const { preferenceId } = u.userPreference;
      if (preferenceId === UserType.Student) {
        return 'Learner';
      } else if (preferenceId === UserType.Builder) {
        return 'Builder';
      } else if (preferenceId === UserType.Teacher) {
        return 'Educator';
      }
    }
    return '';
  }

  renderBrillCoinIcon() {
    return (
      <div className="brill-coin-img-v2">
        <img alt="brill" className="brills-icon" src="/images/Brill.svg" />
        <SpriteIcon name="logo" />
      </div>
    );
  }

  renderBody() {
    const { users } = this.state;
    if (users.length == 0) {
      return <div className="table-body">
        <div className="table-row">
          <div className="publish-column">No Users</div>
        </div>
      </div>;
    }

    const renderteachClassroom = (u: User) => {
      if (u.teachClassroomCount && u.teachClassroomCount > 0) {
        return (
          <div className="attempts-count-box margin-left" onClick={() => {
            //this.props.history.push({ pathname: map.MyLibrary + '/' + u.id })
          }}>
            <SpriteIcon name="circle-teacher" />
            <div className="count-d4421">
              {u.teachClassroomCount}
            </div>
          </div>
        );
      }
      return <div />;
    }

    const renderCreateBricksCount = (u: User) => {
      if (u.createBricksCount && u.createBricksCount > 0) {
        <div className="attempts-count-box margin-left" onClick={() => {
          //this.props.history.push({ pathname: map.MyLibrary + '/' + u.id })
        }}>
          <SpriteIcon name="circle-build" />
          <div className="count-d4421">
            {u.createBricksCount}
          </div>
        </div>
      }
      return <div />;
    }

    return <div className="table-body">
      {users.map(u => {
        return (<div className="table-row">
          <div className="publish-column">{u.created && getDateString(u.created)}</div>
          <div className="author-column">{u.firstName} {u.lastName}</div>
          <div className="second-column">{u.email}</div>
          <div className="third-column">{this.renderUserType(u)}{this.renderLibrary(u)}</div>
          <div className="activity-column">
            <div className={`attempts-count-box ${u.attempts.length > 0 ? '' : 'whiter'}`} onClick={() => {
              if (u.attempts.length > 0) {
                this.props.history.push({ pathname: map.MyLibrary + '/' + u.id })
              }
            }}>
              <SpriteIcon name={u.attempts.length > 0 ? "circle-progress-admin-1" : "circle-progress-admin-3"} />
              <div className="count-d4421">
                {u.attempts.length}
              </div>
            </div>
            {renderteachClassroom(u)}
            {renderCreateBricksCount(u)}
          </div>
          <div className="credits-column">
            <span className="brills-count">{u.brills}</span>
            {this.renderBrillCoinIcon()}
            <div className="desktop-credit-coins">
              <SpriteIcon name="circle-lines" />
              <span>{u.freeAttemptsLeft}</span>
            </div>
            <div className="add-credits-popup" onClick={() => {
              this.setState({
                creditDetails: {
                  isOpen: true,
                  userId: u.id
                }
              })
            }}>
              Add
            </div>
          </div>
          <div className="actions-column">
            <div className="round-btn blue flex-center" onClick={() => this.props.history.push(map.UserProfile + '/' + u.id)}>
              <SpriteIcon name="user-edit-g" className="text-white" />
            </div>
            <div className="round-btn orange flex-center" onClick={() => {
              this.setState({ isDeleteDialogOpen: true, deleteUserId: u.id });
            }}>
              <SpriteIcon name="user-trash-g" className="text-white" />
            </div>
          </div>
        </div>);
      })}
    </div>
  }

  moveToPage(page: number) {
    this.getUsers(this.state.userPreference, page, this.state.selectedSubjects, this.state.searchString, this.state.orderBy, this.state.isAscending, this.state.dateFilter);
  }

  renderPagination() {
    return (
      <UsersPagination
        users={this.state.users}
        page={this.state.page}
        totalCount={this.state.totalUsersCount}
        pageSize={this.state.pageSize}
        moveToPage={page => this.moveToPage(page)}
      />
    );
  }

  renderTable() {
    return (
      <div className="table users-table-d34">
        <div className="table-head bold">
          <div className="publish-column header">
            <div>Joined</div>
            <div><SpriteIcon name="sort-arrows" onClick={() => {
              let isAscending = this.state.isAscending;
              if (this.state.orderBy === "user.created") {
                isAscending = !isAscending;
              }
              this.getUsers(this.state.userPreference, 0, this.state.selectedSubjects, this.state.searchString, "user.created", isAscending, this.state.dateFilter);
            }} /></div>
          </div>
          <div className="author-column header">
            <div>Name</div>
            <div><SpriteIcon name="sort-arrows" onClick={() => {
              let isAscending = this.state.isAscending;
              if (this.state.orderBy === "user.lastName") {
                isAscending = !isAscending;
              }
              this.getUsers(this.state.userPreference, 0, this.state.selectedSubjects, this.state.searchString, "user.lastName", isAscending, this.state.dateFilter);
            }} /></div>
          </div>
          <div className="second-column header">
            <div>Email</div>
          </div>
          <div className="third-column header">
            <div>User Type</div>
          </div>
          <div className="activity-column header">
            <div>Activity</div>
          </div>
          <div className="credits-column header">
            <div>Brills & Credits</div>
          </div>
          <div className="actions-column header"></div>
        </div>
        {this.renderBody()}
      </div>
    );
  }

  async deleteUser() {
    const { deleteUserId } = this.state;
    if (deleteUserId === -1) { return }
    const res = await deleteUser(deleteUserId);
    if (res) {
      this.getUsers(this.state.userPreference, this.state.page, this.state.selectedSubjects, this.state.searchString, this.state.orderBy, this.state.isAscending, this.state.dateFilter);
    } else {
      this.props.requestFailed("Can`t delete user");
    }
    this.closeDeleteDialog();
  }

  closeDeleteDialog() {
    this.setState({ isDeleteDialogOpen: false });
  }

  renderClassroomPopup() {
    return (
      <Dialog
        open={this.state.isStudentClassroomOpen}
        onClose={() => this.setState({ isStudentClassroomOpen: false })}
        className="dialog-box">
        <div className="dialog-header">
          <div>Classrooms</div>
          <div>...Coming soon...</div>
        </div>
      </Dialog>
    );
  }

  render() {
    return (
      <div className="main-listing bricks-played-page user-list-page manage-classrooms-page only-user-events">
        <PageHeadWithMenu
          page={PageEnum.ManageClasses}
          placeholder="Brick Title, Student Name, or Subject"
          user={this.props.user}
          history={this.props.history}
          search={this.search.bind(this)}
          searching={this.searching.bind(this)}
        />
        <Grid container direction="row" className="sorted-row back-to-work-teach">
          <UsersSidebar
            isLoaded={true} userPreference={this.state.userPreference}
            subjects={this.state.subjects}
            selectedSubjects={this.state.selectedSubjects}
            dateFilter={this.state.dateFilter}
            setDateFilter={dateFilter => {
              this.getUsers(this.state.userPreference, 0, this.state.selectedSubjects, this.state.searchString, this.state.orderBy, this.state.isAscending, dateFilter);
            }}
            selectSubjects={selectedSubjects => {
              this.getUsers(this.state.userPreference, 0, selectedSubjects, this.state.searchString, this.state.orderBy, this.state.isAscending, this.state.dateFilter);
            }}
            setUserPreference={userPreference => {
              this.getUsers(userPreference, 0, this.state.selectedSubjects, this.state.searchString, this.state.orderBy, this.state.isAscending, this.state.dateFilter);
            }}

            allDomains={this.state.allDomains}
            domains={this.state.domains}
            setAllDomains={() => {
              this.state.domains.map(d => d.checked = false);
              this.getUsers(this.state.userPreference, 0, this.state.selectedSubjects, this.state.searchString, this.state.orderBy, this.state.isAscending, this.state.dateFilter);
              this.setState({ allDomains: true });
            }}
            setDomain={d => {
              d.checked = !d.checked;
              this.getUsers(this.state.userPreference, 0, this.state.selectedSubjects, this.state.searchString, this.state.orderBy, this.state.isAscending, this.state.dateFilter);
              this.setState({ allDomains: false });
            }}
          />
          <Grid item xs={9} className="brick-row-container">
            <BricksTab activeTab={BricksActiveTab.Users} history={this.props.history} />
            <div className="tab-content">
              <div className="flex f-justify-end">
                <AddUserBtn onClick={() => {
                  this.props.history.push(map.UserProfileNew);
                }} />
                <ExportBtn onClick={() => this.setState({ downloadClicked: true })} />
              </div>
              {this.state.downloadClicked && <Dialog
                className="sort-dialog-classes export-dialog-ew35"
                open={this.state.downloadClicked}
                onClose={() => this.setState({ downloadClicked: false })}
              >
                <div className="popup-3rfw bold">
                  <div className="btn-sort" onClick={() => {
                    let data: any[] = [];

                    for (const user of this.state.users) {
                      data.push({
                        Joined: user.created?.toString(),
                        Name: user.firstName + ' ' + user.lastName,
                        Email: user.email,
                        UserType: this.renderUserType(user)
                      });
                    }

                    exportToCSV(data, `Brillder data${getFormattedDateSlash(new Date().toString())}.pdf`);

                    this.setState({ downloadClicked: false });
                  }}>
                    <div>Export to Excel</div>
                    <SpriteIcon name="excel-icon" />
                  </div>
                  <div className="btn-sort" onClick={() => {
                    exportToPDF(
                      [['Joined', 'Name', 'Email', 'User Type']],
                      this.state.users.map(u => {
                        return [u.created?.toString(), u.firstName + ' ' + u.lastName, u.email, this.renderUserType(u)]
                      }),
                      `Brillder data${getFormattedDateSlash(new Date().toString())}.pdf`
                    );
                    this.setState({ downloadClicked: false });
                  }}>
                    <div>Export to PDF</div>
                    <img alt="brill" src="/images/PDF_icon.png" />
                  </div>
                </div>
              </Dialog>}
              {this.renderTable()}
              {this.renderPagination()}
            </div>
          </Grid>
        </Grid>
        <Dialog
          open={this.state.isDeleteDialogOpen}
          onClose={() => this.closeDeleteDialog()}
          className="dialog-box">
          <div className="dialog-header">
            <div>Permanently delete<br />this user?</div>
          </div>
          <div className="dialog-footer">
            <button className="btn btn-md bg-theme-orange yes-button"
              onClick={() => this.deleteUser()}>
              <span>Yes, delete</span>
            </button>
            <button className="btn btn-md bg-gray no-button"
              onClick={() => this.closeDeleteDialog()}>
              <span>No, keep</span>
            </button>
          </div>
        </Dialog>
        <AddingCreditsDialog isOpen={this.state.creditDetails.isOpen} userId={this.state.creditDetails.userId}
          onClose={credits => {
            if (credits) {
              let user = this.state.users.find(u => u.id === this.state.creditDetails.userId);
              if (user) {
                user.freeAttemptsLeft += credits;
              }
            }
            let creditDetails = {
              isOpen: false,
              userId: -1
            } as CreditDetails;
            this.setState({ creditDetails, users: this.state.users });
          }} />
        {this.renderClassroomPopup()}
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e)),
});

export default connect(mapState, mapDispatch)(UsersPage);