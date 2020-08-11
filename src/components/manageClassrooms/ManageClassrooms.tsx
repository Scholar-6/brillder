import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import axios from "axios";
import { connect } from "react-redux";

import './ManageClassrooms.scss';

import { User, UserType, UserStatus } from "model/user";
import { ReduxCombinedState } from "redux/reducers";
import { checkAdmin } from "components/services/brickService";

import sprite from "assets/img/icons-sprite.svg";
import PageHeadWithMenu, {
  PageEnum,
} from "components/baseComponents/pageHeader/PageHeadWithMenu";

import AddButton from './AddButton';

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

const connector = connect(mapState);

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
    };

    this.getUsers(this.state.page);

    axios
      .get(process.env.REACT_APP_BACKEND_HOST + "/subjects", {
        withCredentials: true,
      })
      .then((res) => {
        this.setState({ ...this.state, subjects: res.data });
      })
      .catch((error) => {
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

    axios
      .post(
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
      )
      .then((res) => {
        this.setState({
          ...this.state,
          users: res.data.pageData,
          totalCount: res.data.totalCount,
        });
      })
      .catch((error) => {
        alert("Can`t get users");
      });
  }

  move(brickId: number) {
    this.props.history.push(
      `/build/brick/${brickId}/build/investigation/question`
    );
  }

  handleSortChange = (e: any) => { };

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
    axios
      .put(
        `${process.env.REACT_APP_BACKEND_HOST}/user/activate/${userId}`,
        {},
        { withCredentials: true } as any
      )
      .then((res) => {
        if (res.data === "OK") {
          const user = this.state.users.find((user) => user.id === userId);
          if (user) {
            user.status = UserStatus.Active;
          }
          this.setState({ ...this.state });
        }
      })
      .catch((error) => {
        alert("Can`t activate user");
      });
  }

  deactivateUser(userId: number) {
    axios
      .put(
        `${process.env.REACT_APP_BACKEND_HOST}/user/deactivate/${userId}`,
        {},
        { withCredentials: true } as any
      )
      .then((res) => {
        if (res.data === "OK") {
          const user = this.state.users.find((user) => user.id === userId);
          if (user) {
            user.status = UserStatus.Disabled;
          }
          this.setState({ ...this.state });
        }
      })
      .catch((error) => {
        alert("Can`t deactivate user");
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
          <div style={{ display: 'flex' }}>
            <div className="class-header" style={{ width: '50%' }}>CLASSES</div>
            <div className="record-header" style={{ width: '50%', textAlign: 'right' }}>RECORDS</div>
          </div>
        </div>
        <div className="create-class-button">+ Create Class</div>
        <div className="filter-header">
          View All
        </div>
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
              {showPrev ? (
                <button
                  className={
                    "btn btn-transparent prev-button svgOnHover " +
                    (showPrev ? "active" : "")
                  }
                  onClick={previousPage}
                >
                  <svg className="svg w100 h100 active">
                    {/*eslint-disable-next-line*/}
                    <use href={sprite + "#arrow-up"} />
                  </svg>
                </button>
              ) : (
                  ""
                )}
              {showNext ? (
                <button
                  className={
                    "btn btn-transparent next-button svgOnHover " +
                    (showNext ? "active" : "")
                  }
                  onClick={nextPage}
                >
                  <svg className="svg w100 h100 active">
                    {/*eslint-disable-next-line*/}
                    <use href={sprite + "#arrow-down"} />
                  </svg>
                </button>
              ) : (
                  ""
                )}
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
        <th className="user-full-name" style={{width: '20%'}}>
          <Grid container>
            NAME
            {this.renderSortArrow(UserSortBy.Name)}
          </Grid>
        </th>
        <th className="email-column" style={{width: '27%'}}>EMAIL</th>
        <th>
          <Grid container>
            CLASSES
            {this.renderSortArrow(UserSortBy.Role)}
          </Grid>
        </th>
        <th>
          <Grid container>
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
                  <td className="activate-button-container">
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  renderRoleDescription() {
    return (
      <div className="role-description">
        <span className="bold">S</span>: Student,&nbsp;
        <span className="bold">T</span>: Teacher,&nbsp;
        <span className="bold">B</span>: Builder,&nbsp;
        <span className="bold">E</span>: Editor,&nbsp;
        <span className="bold">A</span>: Admin
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
            {this.renderRoleDescription()}
            {this.renderPagination()}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default connector(ManageClassrooms);
