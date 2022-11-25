import React, { Component } from "react";
import { History } from "history";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import { Tooltip } from "@material-ui/core";
 
import { ReduxCombinedState } from "redux/reducers";
import actions from 'redux/actions/requestFailed';
import { getRealLibraries, RealLibrary } from "services/axios/realLibrary";

import './UsersEvents.scss';
import { User, UserPreferenceType, UserType } from "model/user";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import UsersSidebar from "./UsersEventsSidebar";
import BricksTab, { BricksActiveTab } from "../bricksPlayed/BricksTab";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { deleteUser, getUsers } from "services/axios/user";
import { fileFormattedDate, getDateString } from "components/services/brickService";
import UsersPagination from "components/teach/manageClassrooms/components/UsersPagination";
import ExportBtn from "../components/ExportBtn";
import { exportToCSV } from "services/excel";
import { exportToPDF } from "services/pdf";
import AddUserBtn from "../components/AddUserBtn";
import map from "components/map";
import { getSubjects } from "services/axios/subject";
import { Subject } from "model/brick";


interface UsersProps {
  history: History;
  searchString: string;

  // redux
  user: User;
  requestFailed(e: string): void;
}

interface UsersState {
  users: User[];
  page: number,
  pageSize: number;
  totalUsersCount: number;
  userPreference: UserPreferenceType | null;

  selectedSubjects: Subject[];
  subjects: Subject[];

  deleteUserId: number;
  isDeleteDialogOpen: boolean;

  isStudentClassroomOpen: boolean;
  userClassrooms: any[];

  isSearching: boolean;
  searchString: string;

  orderBy: string;
  isAscending: boolean;

  libraries: RealLibrary[];

  downloadClicked: boolean;
}

class UsersPage extends Component<UsersProps, UsersState> {
  constructor(props: UsersProps) {
    super(props);

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

    this.getUsers(null, 0, [], '', 'user.created', true);

    this.getLibraries();
  }

  async getUsers(userPreference: UserPreferenceType | null, page: number, selectedSubjects: Subject[], searchString: string, orderBy: string, isAscending: boolean) {
    let roleFilters = [];
    if (userPreference !== null) {
      roleFilters.push(userPreference);
    }
    const res = await getUsers({
      pageSize: this.state.pageSize,
      page: page.toString(),
      searchString,
      subjectFilters: selectedSubjects.map(s => s.id),
      roleFilters,
      orderBy,
      isAscending
    });
    if (res) {
      this.setState({
        userPreference,
        page,
        users: res.pageData,
        selectedSubjects,
        orderBy,
        isAscending,
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
      this.state.isAscending
    );

    setTimeout(() => {
      this.setState({ isSearching: true });
    })
  }

  async searching(searchString: string) {
    if (searchString.length === 0) {
      await this.getUsers(this.state.userPreference, 0, this.state.selectedSubjects, searchString, this.state.orderBy, this.state.isAscending);
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

  renderBody() {
    const { users } = this.state;
    if (users.length == 0) {
      return <div className="table-body">
        <div className="table-row">
          <div className="publish-column">No Users</div>
        </div>
      </div>;
    }

    return <div className="table-body">
      {users.map(u => {
        return (<div className="table-row">
          <div className="publish-column">{u.created && getDateString(u.created)}</div>
          <div className="author-column">{u.firstName} {u.lastName}</div>
          <div className="see-container" style={{ position: "relative", width: "3.5%" }}>
            {(u.studyClassroomCount ?? 0) > 0 &&
              <Tooltip title="See Study Classrooms">
                <span
                  className="btn"
                  style={{ cursor: "pointer", borderRadius: "50%", backgroundColor: "var(--theme-green)", width: "1.8vw", height: "1.8vw", display: "inline-block", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
                  onClick={async () => {
                    this.setState({ isStudentClassroomOpen: true });
                  }}
                >
                  <SpriteIcon name="student-back-to-work" style={{ color: "white", width: "1.5vw", height: "1.5vw", position: "absolute", margin: "auto", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
                </span>
              </Tooltip>
            }
          </div>
          <div className="second-column">{u.email}</div>
          <div className="third-column">{this.renderUserType(u)}{this.renderLibrary(u)}</div>
          <div className="second-column">
            <div className={`attempts-count-box ${u.attempts.length > 0 ? '' : 'whiter'}`} onClick={() => {
              if (u.attempts.length > 0) {
                this.props.history.push({ pathname: map.MyLibrary + '/' + u.id })
              }
            }}>
              <SpriteIcon name={u.attempts.length > 0 ? "user-event-activity" : "user-event-activity-disabled"} />
              <div className="absolute-count-d4421">
                {u.attempts.length}
              </div>
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
    this.getUsers(this.state.userPreference, page, this.state.selectedSubjects, this.state.searchString, this.state.orderBy, this.state.isAscending);
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
              this.getUsers(this.state.userPreference, 0, this.state.selectedSubjects, this.state.searchString, "user.created", isAscending);
            }} /></div>
          </div>
          <div className="author-column header">
            <div>Name</div>
            <div><SpriteIcon name="sort-arrows" onClick={() => {
              let isAscending = this.state.isAscending;
              if (this.state.orderBy === "user.lastName") {
                isAscending = !isAscending;
              }
              this.getUsers(this.state.userPreference, 0, this.state.selectedSubjects, this.state.searchString, "user.lastName", isAscending);
            }} /></div>
          </div>
          <div style={{ width: "3.5%" }}></div>
          <div className="second-column header">
            <div>Email</div>
          </div>
          <div className="third-column header">
            <div>User Type</div>
          </div>
          <div className="second-column header">
            <div>Activity</div>
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
      this.getUsers(this.state.userPreference, this.state.page, this.state.selectedSubjects, this.state.searchString, this.state.orderBy, this.state.isAscending);
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
      <div className="main-listing bricks-played-page user-list-page manage-classrooms-page">
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
            selectSubjects={selectedSubjects => {
              this.getUsers(this.state.userPreference, 0, selectedSubjects, this.state.searchString, this.state.orderBy, this.state.isAscending);
            }}
            setUserPreference={userPreference => {
              this.getUsers(userPreference, 0, this.state.selectedSubjects, this.state.searchString, this.state.orderBy, this.state.isAscending);
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

                    exportToCSV(data, `Brillder data ${fileFormattedDate(new Date().toString())}.pdf`);

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
