import React, { Component } from "react";
import { Grid, Radio } from "@material-ui/core";
import axios from "axios";
import { connect } from "react-redux";

import './ManageClassrooms.scss';

import { User, UserType } from "model/user";
import { ReduxCombinedState } from "redux/reducers";
import { checkAdmin } from "components/services/brickService";

import sprite from "assets/img/icons-sprite.svg";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";

import AddButton from './AddButton';
import UsersPagination from './UsersPagination';
import RoleDescription from 'components/baseComponents/RoleDescription';

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });
const connector = connect(mapState);

interface MUser extends User {
  selected: boolean;
}

interface UsersListProps {
  user: User;
  history: any;
}

enum UserSortBy {
  None,
  Name,
  Role,
  Status,
}

interface UsersListState {
  users: MUser[];
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

  selectedUsers: MUser[];
}

class ManageClassrooms extends Component<UsersListProps, UsersListState> {
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

      selectedUsers: []
    };

    this.getUsers(this.state.page);

    axios.get(process.env.REACT_APP_BACKEND_HOST + "/subjects", {
      withCredentials: true,
    }).then((res) => {
      this.setState({ ...this.state, subjects: res.data });
    }).catch((error) => {
      alert("Can`t get subjects");
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
      res.data.pageData.map((u: any) => u.selected = false);
      this.setState({ ...this.state, users: res.data.pageData, totalCount: res.data.totalCount });
    }).catch((error) => {
      alert("Can`t get users");
    });
  }

  searching(searchString: string) {
    if (searchString.length === 0) {
      this.setState({ ...this.state, searchString, isSearching: false });
    } else {
      this.setState({ ...this.state, searchString });
    }
  }

  search() {
    const { searchString } = this.state;
    this.getUsers(0, [], this.state.sortBy, this.state.isAscending, searchString);
  }

  toggleUser(i: number) {
    const { users } = this.state;
    users[i].selected = !users[i].selected;
    let selectedUsers = this.state.users.filter(u => u.selected);
    this.setState({ ...this.state, users, selectedUsers });
  }

  renderSortAndFilterBox = () => {
    return (
      <div className="sort-box">
        <div className="filter-container sort-by-box">
          <div style={{ display: 'flex' }}>
            <div className="class-header" style={{ width: '50%' }}>CLASSES</div>
            <div className="record-header" style={{ width: '50%', textAlign: 'right' }}>RECORDS</div>
          </div>
        </div>
        <div className="create-class-button" onClick={() => { }}>+ Create Class</div>
        <div className="filter-header">
          View All
        </div>
      </div>
    );
  };

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
    this.getUsers(this.state.page, [], sortBy, isAscending);
  }

  moveToPage(page: number) {
    this.setState({ ...this.state, page, selectedUsers: [] });
    this.getUsers(page);
  };

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
        <th className="user-full-name" style={{ width: '20%' }}>
          <Grid container>
            NAME
            {this.renderSortArrow(UserSortBy.Name)}
          </Grid>
        </th>
        <th className="email-column" style={{ width: '27%' }}>EMAIL</th>
        <th style={{ width: '29%' }}>
          <Grid container>
            CLASSES
            {this.renderSortArrow(UserSortBy.Role)}
          </Grid>
        </th>
        <th style={{ padding: 0 }}>
          <Grid container className="selected-column">
            <Radio disabled={true} />
            <span className="selected-count">{this.state.selectedUsers.length}</span>
            <svg className="svg active">
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#users"} />
            </svg>
            Selected
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
                  <td></td>
                  <td className="user-radio-column">
                    <Radio checked={this.state.users[i].selected} onClick={() => this.toggleUser(i)} />
                  </td>
                  <td className="activate-button-container"></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  renderTableHeader() {
    return (
      <div className="user-header">
        <h1 className="brick-row-title">ALL STUDENTS</h1>
        <AddButton label="ADD STUDENT" link="/" history={this.props.history} />
      </div>
    );
  }

  render() {
    const { history } = this.props;
    return (
      <div className="main-listing user-list-page manage-classrooms-page">
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
            <UsersPagination
              users={this.state.users}
              page={this.state.page}
              totalCount={this.state.totalCount}
              pageSize={this.state.pageSize}
              moveToPage={page => this.moveToPage(page)}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default connector(ManageClassrooms);
