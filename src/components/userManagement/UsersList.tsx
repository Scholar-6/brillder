import "./UsersList.scss";
import React, { Component } from "react";
import { Grid, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import axios from "axios";
import { connect } from "react-redux";
import Dialog from "@material-ui/core/Dialog";

import actions from 'redux/actions/requestFailed';
import { User, UserType, UserStatus, RolePreference } from "model/user";
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
import CustomFilterBox from "components/library/components/CustomFilterBox";
import UsersListPagination from "./components/Pagination";

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
  Joined
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

class UsersListPage extends Component<UsersListProps, UsersListState> {
  constructor(props: UsersListProps) {
    super(props);
    this.state = {
      users: [],
      page: 0,
      pageSize: 12,
      subjects: [],
      filterExpanded: true,

      roles: [
        { name: "Student", type: RolePreference.Student, checked: false },
        { name: "Teacher", type: RolePreference.Teacher, checked: false },
        { name: "Builder", type: RolePreference.Builder, checked: false },
        { name: "Publisher", type: UserType.Publisher, checked: false },
        { name: "Admin", type: UserType.Admin, checked: false },
      ],

      totalCount: 0,
      searchString: "",
      isSearching: false,
      filterHeight: "auto",

      sortBy: UserSortBy.Name,
      isAscending: false,
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
    this.setState({...this.state});
  }

  filterBySubject = (i: number) => {
    const { subjects } = this.state;
    subjects[i].checked = !subjects[i].checked;
    this.filter();
    this.setState({ ...this.state });
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
    let filterSubjects = this.getCheckedSubjectIds();
    let filterRoles = this.getCheckedRoles();
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
      <div className="sort-box">
        <div className="filter-container sort-by-box">
          <div className="sort-header">Filter by: Role</div>
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
        <CustomFilterBox
          label="Filter by: Subject"
          isClearFilter={this.state.isClearFilter}
          setHeight={filterHeight => this.setState({filterHeight})}
          clear={this.clearStatus.bind(this)}
        />
        <SubjectsList
          subjects={this.state.subjects}
          filterHeight={this.state.filterHeight}
          filterBySubject={this.filterBySubject}
          showUserCount={true}
        />
      </div>
    );
  };

  nextPage() {
    const {page} = this.state;
    this.setState({ ...this.state, page: page + 1 });
    let filterSubjects = this.getCheckedSubjectIds();
    this.getUsers(page + 1, this.state.sortBy, filterSubjects);
  }

  previousPage() {
    const {page} = this.state;
    this.setState({ ...this.state, page: page - 1 });
    let filterSubjects = this.getCheckedSubjectIds();
    this.getUsers(page - 1, this.state.sortBy, filterSubjects);
  }

  renderPreferenceType(user: User) {
    if (user.rolePreference?.roleId === RolePreference.Builder) {
      return "B";
    } else if (user.rolePreference?.roleId === RolePreference.Student) {
      return "S";
    } else if (user.rolePreference?.roleId === RolePreference.Teacher) {
      return "T";
    }
    return "";
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
      <img
        className="sort-button"
        alt=""
        src={
          sortBy === currentSortBy
            ? !isAscending
              ? "/feathericons/chevron-down.svg"
              : "/feathericons/chevron-up.svg"
            : "/feathericons/chevron-right.svg"
        }
        onClick={() => this.sortBy(currentSortBy)}
      />
    );
  }

  renderUserTableHead() {
    return (
      <tr>
        <th className="subject-title">
          <Grid container>JOINED {this.renderSortArrow(UserSortBy.Joined)}</Grid>
        </th>
        <th className="user-full-name">
          <Grid container>NAME {this.renderSortArrow(UserSortBy.Name)}</Grid>
        </th>
        <th className="email-column">EMAIL</th>
        <th>
          <Grid container>USER PREFERENCE</Grid>
        </th>
        <th>
          <Grid container>ROLE</Grid>
        </th>
        <th>
          <Grid container>
            ACTIVE?
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
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
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
                  <td>
                    <span className="user-first-name">{user.firstName} </span>
                    <span className="user-last-name">{user.lastName}</span>
                  </td>
                  <td>{user.email}</td>
                  <td>{this.renderPreferenceType(user)}</td>
                  <td>{this.renderUserType(user)}</td>
                  <td className="activate-button-container">
                    <CustomToggle checked={user.status === UserStatus.Active} onClick={() => this.toggleUser(user)} />
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
        <h1 className="brick-row-title">ALL USERS</h1>
        <AddUserButton history={this.props.history} />
      </div>
    );
  }

  render() {
    const { history } = this.props;
    return (
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
          <Grid container item xs={3} className="sort-and-filter-container">
            {this.renderSortAndFilterBox()}
          </Grid>
          <Grid item xs={9} className="brick-row-container">
            {this.renderTableHeader()}
            {this.renderUsers()}
            <RoleDescription />
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
    );
  }
}

export default connector(UsersListPage);
