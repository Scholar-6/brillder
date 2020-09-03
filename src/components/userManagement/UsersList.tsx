import "./UsersList.scss";
import React, { Component } from "react";
import { Grid, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import axios from "axios";
import { connect } from "react-redux";
import grey from "@material-ui/core/colors/grey";
import Dialog from "@material-ui/core/Dialog";

import actions from 'redux/actions/requestFailed';
import { User, UserType, UserStatus } from "model/user";
import { ReduxCombinedState } from "redux/reducers";
import { checkAdmin } from "components/services/brickService";

import PageHeadWithMenu, {
  PageEnum,
} from "components/baseComponents/pageHeader/PageHeadWithMenu";

import SubjectsList from "components/baseComponents/subjectsList/SubjectsList";
import AddUserButton from "./AddUserButton";
import UserActionsCell from "./UserActionsCell";
import RoleDescription from "components/baseComponents/RoleDescription";
import NextButton from "components/baseComponents/pagination/NextButton";
import PrevButton from "components/baseComponents/pagination/PrevButton";
import CustomToggle from './CustomToggle';

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
  None,
  Name,
  Role,
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
        { name: "Student", type: UserType.Student, checked: false },
        { name: "Teacher", type: UserType.Teacher, checked: false },
        { name: "Builder", type: UserType.Builder, checked: false },
        { name: "Editor", type: UserType.Editor, checked: false },
        { name: "Admin", type: UserType.Admin, checked: false },
      ],

      totalCount: 0,
      searchString: "",
      isSearching: false,
      filterHeight: "auto",

      sortBy: UserSortBy.None,
      isAscending: false,
      isAdmin: checkAdmin(props.user.roles),
      isClearFilter: false,
      isDeleteDialogOpen: false,
      deleteUserId: -1
    };

    this.getUsers(this.state.page);

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
    subjects: number[] = [],
    sortBy: UserSortBy = UserSortBy.None,
    isAscending: any = null,
    search: string = ""
  ) {
    let searchString = "";
    let orderBy = null;

    if (sortBy === UserSortBy.None) {
      sortBy = this.state.sortBy;
    }

    if (isAscending === null) {
      isAscending = this.state.isAscending;
    }

    if (sortBy) {
      if (sortBy === UserSortBy.Name) {
        orderBy = "user.lastName";
      } else if (sortBy === UserSortBy.Status) {
        orderBy = "user.status";
      } else if (sortBy === UserSortBy.Role) {
        orderBy = "user.roles";
      }
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
        roleFilters: [],
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
      filterSubjects,
      this.state.sortBy,
      this.state.isAscending,
      searchString
    );
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
    this.getUsers(0, filterSubjects);
  }

  //region Hide / Expand / Clear Filter
  clearStatus() {
    let { state } = this;
    let { subjects } = state;
    subjects.forEach((r: any) => (r.checked = false));
    this.filter();
    this.filterClear();
  }
  hideFilter() {
    this.setState({ ...this.state, filterExpanded: false, filterHeight: "0" });
  }

  expandFilter() {
    this.setState({
      ...this.state,
      filterExpanded: true,
      filterHeight: "auto",
    });
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
                    control={<Radio className={"filter-radio"} />}
                    label={role.name}
                  />
                </Grid>
              ))}
            </Grid>
          </RadioGroup>
        </div>
        <div className="filter-header">
          <span>Filter by: Subject</span>
          <button
            className={
              "btn-transparent filter-icon " +
              (this.state.filterExpanded
                ? this.state.isClearFilter
                  ? "arrow-cancel"
                  : "arrow-down"
                : "arrow-up")
            }
            onClick={() => {
              this.state.filterExpanded
                ? this.state.isClearFilter
                  ? this.clearStatus()
                  : this.hideFilter()
                : this.expandFilter();
            }}
          ></button>
        </div>
        <SubjectsList
          subjects={this.state.subjects}
          filterHeight={this.state.filterHeight}
          filterBySubject={this.filterBySubject}
        />
      </div>
    );
  };

  renderPagination() {
    const { totalCount, users, page, pageSize } = this.state;
    const showPrev = page > 0;
    const currentPage = page;
    const showNext = totalCount / pageSize - currentPage > 1;
    const prevCount = currentPage * pageSize;
    const minUser = prevCount + 1;
    const maxUser = prevCount + users.length;

    const nextPage = () => {
      this.setState({ ...this.state, page: page + 1 });
      this.getUsers(page + 1);
    };

    const previousPage = () => {
      this.setState({ ...this.state, page: page - 1 });
      this.getUsers(page - 1);
    };

    return (
      <div className="users-pagination">
        <Grid container direction="row">
          <Grid item xs={4} className="left-pagination">
            <div className="first-row">
              {minUser}-{maxUser}
              <span className="gray"> &nbsp;|&nbsp; {totalCount}</span>
            </div>
            <div>
              {page + 1}
              <span className="gray">
                {" "}
                &nbsp;|&nbsp; {Math.ceil(totalCount / pageSize)}
              </span>
            </div>
          </Grid>
          <Grid item xs={4} className="bottom-next-button">
            <div>
              <PrevButton isShown={showPrev} onClick={previousPage} />
              <NextButton isShown={showNext} onClick={nextPage} />
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }

  renderUserType(user: User) {
    let type = "";

    for (let role of user.roles) {
      if (role.roleId === UserType.Admin) {
        type += "A";
      } else if (role.roleId === UserType.Builder) {
        type += "B";
      } else if (role.roleId === UserType.Editor) {
        type += "E";
      } else if (role.roleId === UserType.Student) {
        type += "S";
      } else if (role.roleId === UserType.Teacher) {
        type += "T";
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
      this.setState({ ...this.state, isAscending, sortBy });
    }
    let filterSubjects = this.getCheckedSubjectIds();
    this.getUsers(this.state.page, filterSubjects, sortBy, isAscending);
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
        <th className="subject-title">SC</th>
        <th className="user-full-name">
          <Grid container>
            NAME
            {this.renderSortArrow(UserSortBy.Name)}
          </Grid>
        </th>
        <th className="email-column">EMAIL</th>
        <th>
          <Grid container>
            ROLE
            {this.renderSortArrow(UserSortBy.Role)}
          </Grid>
        </th>
        <th>
          <Grid container>
            ACTIVE?
            {this.renderSortArrow(UserSortBy.Status)}
          </Grid>
        </th>
        <th className="edit-button-column"></th>
      </tr>
    );
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
                  <td></td>
                  <td>
                    <span className="user-first-name">{user.firstName} </span>
                    <span className="user-last-name">{user.lastName}</span>
                  </td>
                  <td>{user.email}</td>
                  <td>{this.renderUserType(user)}</td>
                  <td className="activate-button-container">
                    <CustomToggle checked={user.status === UserStatus.Active} onClick={() => this.toggleUser(user)}  />
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
            {this.renderPagination()}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default connector(UsersListPage);
