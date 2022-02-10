import "./UsersList.scss";
import React, { Component } from "react";
import { Grid, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import axios from "axios";
import { connect } from "react-redux";
import Dialog from "@material-ui/core/Dialog";

import actions from 'redux/actions/requestFailed';
import { User, UserType, UserStatus, UserPreferenceType } from "model/user";
import { ReduxCombinedState } from "redux/reducers";
import { checkAdmin } from "components/services/brickService";

import PageHeadWithMenu, {
  PageEnum,
} from "components/baseComponents/pageHeader/PageHeadWithMenu";

import SubjectsList from "components/baseComponents/subjectsList/SubjectsList";
import AddUserButton from "./components/AddUserButton";
import UserActionsCell from "./components/UserActionsCell";
import RoleDescription from "components/baseComponents/RoleDescription";
import CustomToggle from './components/CustomToggle';
import UsersListPagination from "./components/Pagination";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { isPhone } from "services/phone";

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e)),
});

const connector = connect(mapState, mapDispatch);

interface UsersListProps {
  user: User;
  history: any;
  requestFailed(e: string): void;
}

enum UserSortBy {
  Name,
  Joined,
  Subscription,
  Status,
}

interface UsersListState {
  users: User[];
  page: number;
  pageSize: number;
  totalCount: number;

  searchString: string;
  isSearching: boolean;

  subjects: any[];
  roles: any[];

  filterExpanded: boolean;
  filterHeight: string;
  isAdmin: boolean;

  sortBy: UserSortBy;
  isAscending: boolean;
  isClearFilter: boolean;

  isDeleteDialogOpen: boolean;
  deleteUserId: number;
}

const MobileTheme = React.lazy(() => import('./themes/UserListPageMobileTheme'));

class UsersListPage extends Component<UsersListProps, UsersListState> {
  constructor(props: UsersListProps) {
    super(props);
    this.state = {
      users: [],
      page: 0,
      pageSize: 14,
      subjects: [],
      filterExpanded: true,

      roles: [
        { name: "Learner", type: UserPreferenceType.Student, checked: false, isPreference: true },
        { name: "Educator", type: UserPreferenceType.Teacher, checked: false, isPreference: true },
        { name: "Builder", type: UserPreferenceType.Builder, checked: false, isPreference: true },
        { name: "Publisher", type: UserType.Publisher, checked: false },
        { name: "Admin", type: UserType.Admin, checked: false },
      ],

      totalCount: 0,
      searchString: "",
      isSearching: false,
      filterHeight: "auto",

      sortBy: UserSortBy.Joined,
      isAscending: true,
      isAdmin: checkAdmin(props.user.roles),
      isClearFilter: false,
      isDeleteDialogOpen: false,
      deleteUserId: -1
    };

    this.getUsers(this.state.page, this.state.sortBy);

    axios.get(process.env.REACT_APP_BACKEND_HOST + "/subjects", {
      withCredentials: true,
    }).then((res) => {
      this.setState({ ...this.state, subjects: res.data });
    }).catch(() => {
      this.props.requestFailed("Can`t get subjects");
    });
  }

  getUsers(
    page: number,
    sortBy: UserSortBy,
    subjects: number[] = [],
    roleFilters: any = [],
    isAscending: any = null,
    search: string = ""
  ) {
    let searchString = "";
    let orderBy = "user.lastName";

    if (sortBy === UserSortBy.Joined) {
      orderBy = "user.created";
    } else if (sortBy === UserSortBy.Status) {
      orderBy = "user.status";
    } else if (sortBy === UserSortBy.Subscription) {
      orderBy = "subscription.subscriptionState";
    }

    if (isAscending === null) {
      isAscending = this.state.isAscending;
    }

    if (search) {
      searchString = search;
    } else {
      if (this.state.isSearching) {
        searchString = this.state.searchString;
      }
    }

    axios.post(
      process.env.REACT_APP_BACKEND_HOST + "/users",
      {
        pageSize: this.state.pageSize,
        page: page.toString(),
        searchString,
        subjectFilters: subjects,
        roleFilters,
        orderBy,
        isAscending,
      },
      { withCredentials: true }
    ).then((res) => {
      this.setState({
        ...this.state,
        users: res.data.pageData,
        totalCount: res.data.totalCount,
      });
    }).catch(() => {
      this.props.requestFailed("Can`t get users");
    });
  }

  openDeleteDialog(deleteUserId: number) {
    this.setState({ isDeleteDialogOpen: true, deleteUserId });
  }

  closeDeleteDialog() {
    this.setState({ isDeleteDialogOpen: false, deleteUserId: -1 });
  }

  deleteUser() {
    const { deleteUserId } = this.state;
    if (deleteUserId === -1) { return }
    axios.delete(
      process.env.REACT_APP_BACKEND_HOST + '/user/delete/' + deleteUserId, { withCredentials: true }
    ).then(res => {
      if (res.data === "OK") {
        this.closeDeleteDialog();
        this.onUserDeleted(deleteUserId);
        return;
      }
      this.closeDeleteDialog();
      this.props.requestFailed("Can`t delete user");
    }).catch(() => {
      this.closeDeleteDialog();
      this.props.requestFailed("Can`t delete user");
    });
  }

  getCheckedRoles() {
    const result = [];
    const { state } = this;
    const { roles } = state;
    for (let role of roles) {
      if (role.checked) {
        result.push(role.type);
      }
    }
    return result;
  }

  searching(searchString: string) {
    if (searchString.length === 0) {
      this.setState({ ...this.state, searchString, isSearching: false });
    } else {
      this.setState({ ...this.state, searchString });
    }
  }

  activateUser(userId: number) {
    axios.put(
      `${process.env.REACT_APP_BACKEND_HOST}/user/activate/${userId}`,
      {},
      { withCredentials: true } as any
    ).then((res) => {
      if (res.data === "OK") {
        const user = this.state.users.find((user) => user.id === userId);
        if (user) {
          user.status = UserStatus.Active;
        }
        this.setState({ ...this.state });
      }
    }).catch(() => {
      this.props.requestFailed("Can`t activate user");
    });
  }

  deactivateUser(userId: number) {
    axios.put(
      `${process.env.REACT_APP_BACKEND_HOST}/user/deactivate/${userId}`,
      {},
      { withCredentials: true } as any
    ).then((res) => {
      if (res.data === "OK") {
        const user = this.state.users.find((user) => user.id === userId);
        if (user) {
          user.status = UserStatus.Disabled;
        }
        this.setState({ ...this.state });
      }
    }).catch(() => {
      this.props.requestFailed("Can`t deactivate user");
    });
  }

  toggleUser(user: User) {
    if (user.status === UserStatus.Active) {
      this.deactivateUser(user.id);
    } else {
      this.activateUser(user.id);
    }
  }

  search() {
    const { searchString } = this.state;
    let filterSubjects = this.getCheckedSubjectIds();
    this.getUsers(
      0,
      this.state.sortBy,
      filterSubjects,
      [],
      this.state.isAscending,
      searchString
    );
  }

  toggleRole(role: any) {
    role.checked = !role.checked;
    let filterSubjects = this.getCheckedSubjectIds();
    let roles = this.getCheckedRoles();
    this.getUsers(0, this.state.sortBy, filterSubjects, roles);
    this.setState({ ...this.state, page: 0 });
  }

  filterBySubject = (i: number) => {
    const { subjects } = this.state;
    subjects[i].checked = !subjects[i].checked;
    this.filter();
    this.setState({ ...this.state, page: 0 });
    this.filterClear();
  };

  getCheckedSubjectIds() {
    const filterSubjects = [];
    const { state } = this;
    const { subjects } = state;
    for (let subject of subjects) {
      if (subject.checked) {
        filterSubjects.push(subject.id);
      }
    }
    return filterSubjects;
  }

  filter() {
    const filterSubjects = this.getCheckedSubjectIds();
    const filterRoles = this.getCheckedRoles();
    this.getUsers(0, this.state.sortBy, filterSubjects, filterRoles);
  }

  //region Hide / Expand / Clear Filter
  clearStatus() {
    let { state } = this;
    let { subjects } = state;
    subjects.forEach((r: any) => (r.checked = false));
    this.filter();
    this.filterClear();
  }

  filterClear() {
    this.setState({
      isClearFilter: this.state.subjects.some((r: any) => r.checked)
        ? true
        : false,
    });
  }
  //endregion

  onUserDeleted(userId: number) {
    let { users } = this.state;
    let removeIndex = users.findIndex((user) => user.id === userId);
    users.splice(removeIndex, 1);
    this.setState({ ...this.state, users });
  }

  renderSortAndFilterBox = () => {
    return (
      <div className="flex-height-box">
        <div className="sort-box">
          <div className="filter-container sort-by-box">
            <div className="sort-header">User Type</div>
            <RoleDescription />
            <RadioGroup
              className="sort-group"
              aria-label="SortBy"
              name="SortBy"
              value={this.state.sortBy}
            >
              <Grid container direction="row">
                {this.state.roles.map((role, i) => (
                  <Grid item xs={4} key={i}>
                    <FormControlLabel
                      checked={role.checked}
                      control={<Radio onClick={() => this.toggleRole(role)} className={"filter-radio"} />}
                      label={role.name}
                    />
                  </Grid>
                ))}
              </Grid>
            </RadioGroup>
          </div>
          <div className="filter-header">
            <span>Subject</span>
          </div>
        </div>
        <div className="sort-box subject-scrollable">
          <SubjectsList
            subjects={this.state.subjects}
            filterHeight={this.state.filterHeight}
            filterBySubject={this.filterBySubject}
            showUserCount={true}
          />
        </div>
      </div>
    );
  };

  nextPage() {
    const { page } = this.state;
    this.setState({ ...this.state, page: page + 1 });
    let filterSubjects = this.getCheckedSubjectIds();
    const filterRoles = this.getCheckedRoles();
    this.getUsers(page + 1, this.state.sortBy, filterSubjects, filterRoles);
  }

  previousPage() {
    const { page } = this.state;
    this.setState({ ...this.state, page: page - 1 });
    let filterSubjects = this.getCheckedSubjectIds();
    const filterRoles = this.getCheckedRoles();
    this.getUsers(page - 1, this.state.sortBy, filterSubjects, filterRoles);
  }

  renderUserType(user: User) {
    let type = "";

    for (let role of user.roles) {
      if (role.roleId === UserType.Admin) {
        type += "A";
      } else if (role.roleId === UserType.Publisher) {
        type += "P";
      }
    }
    if (user.userPreference?.preferenceId === UserPreferenceType.Builder) {
      type += "B";
    } else if (user.userPreference?.preferenceId === UserPreferenceType.Student) {
      type += "L";
    } else if (user.userPreference?.preferenceId === UserPreferenceType.Teacher) {
      type += "E";
    } else if (user.userPreference?.preferenceId === UserPreferenceType.Institution) {
      type += "I";
    }
    return type;
  }

  sortBy(sortBy: UserSortBy) {
    let isAscending = this.state.isAscending;

    if (sortBy === this.state.sortBy) {
      isAscending = !isAscending;
      this.setState({ ...this.state, isAscending });
    } else {
      isAscending = false;
      this.setState({ ...this.state, sortBy: sortBy, isAscending });
    }
    let filterSubjects = this.getCheckedSubjectIds();
    this.getUsers(this.state.page, sortBy, filterSubjects, [], isAscending);
  }

  renderSortArrow(currentSortBy: UserSortBy) {
    const { sortBy, isAscending } = this.state;

    return (
      <SpriteIcon
        className="sort-button"
        name={
          sortBy === currentSortBy
            ? !isAscending
              ? "arrow-down"
              : "arrow-up"
            : "arrow-right"
        }
        onClick={() => this.sortBy(currentSortBy)}
      />
    );
  }

  renderUserTableHead() {
    return (
      <tr>
        <th className="subject-title">
          <Grid container>Joined {this.renderSortArrow(UserSortBy.Joined)}</Grid>
        </th>
        <th className="user-full-name">
          <Grid container>Name {this.renderSortArrow(UserSortBy.Name)}</Grid>
        </th>
        <th className="email-column">Email</th>
        <th className="type-column">
          <Grid container>{!isPhone() && 'User'} Type {this.renderSortArrow(UserSortBy.Subscription)}</Grid>
        </th>
        <th className="active-column">
          <Grid container>
            Active? {this.renderSortArrow(UserSortBy.Status)}
          </Grid>
        </th>
        <th className="edit-button-column"></th>
      </tr>
    );
  }

  formatDate(date: string) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear().toString();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [day, month, year.slice(2)].join('.');
  }

  renderDate(stringDate: string) {
    if (!stringDate) { return '—'; }
    return <div>{this.formatDate(stringDate)}</div>;
  }

  renderUsers() {
    if (!this.state.users) {
      return "";
    }
    return (
      <div className="users-table">
        <table cellSpacing="0" cellPadding="0">
          <thead>{this.renderUserTableHead()}</thead>
          <tbody>
            {this.state.users.map((user: any, i: number) => {
              return (
                <tr className="user-row" key={i}>
                  <td className="joing-date">
                    {this.renderDate(user.created)}
                  </td>
                  <td className="name-container">
                    <span className="user-first-name">{user.firstName} </span>
                    <span className="user-last-name">{user.lastName}</span>
                  </td>
                  <td className="email-container">{user.email}</td>
                  <td className="preference-type">
                    {this.renderUserType(user)}
                    {user.subscriptionState > 1 && <SpriteIcon name="hero-sparkle" />}
                  </td>
                  <td className="activate-button-container">
                    <CustomToggle checked={user.status === UserStatus.Active} name={user.firstName} onClick={() => this.toggleUser(user)} />
                  </td>
                  <UserActionsCell
                    userId={user.id}
                    history={this.props.history}
                    isAdmin={this.state.isAdmin}
                    onDelete={(userId) => this.openDeleteDialog(userId)}
                  />
                </tr>
              );
            })}
          </tbody>
        </table>
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
      </div>
    );
  }

  renderTableHeader() {
    return (
      <div className="user-header">
        <h1 className="brick-row-title">All Users</h1>
        <AddUserButton history={this.props.history} />
      </div>
    );
  }

  render() {
    const { history } = this.props;
    return (
      <React.Suspense fallback={<></>}>
        {isPhone() && <MobileTheme />}
        <div className="main-listing user-list-page">
          <PageHeadWithMenu
            page={PageEnum.ManageUsers}
            placeholder="Search by Name, Email or Subject"
            user={this.props.user}
            history={history}
            search={() => this.search()}
            searching={(v: string) => this.searching(v)}
          />
          <Grid container direction="row" className="sorted-row">
            <Grid container item xs={3} className="sort-and-filter-container users-filter">
              {this.renderSortAndFilterBox()}
              <div className="sidebar-footer" />
            </Grid>
            <Grid item xs={9} className="brick-row-container">
              {this.renderTableHeader()}
              {this.renderUsers()}
              <UsersListPagination
                page={this.state.page}
                totalCount={this.state.totalCount}
                users={this.state.users}
                pageSize={this.state.pageSize}
                nextPage={this.nextPage.bind(this)}
                previousPage={this.previousPage.bind(this)}
              />
            </Grid>
          </Grid>
        </div>
      </React.Suspense>
    );
  }
}

export default connector(UsersListPage);
