import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import axios from "axios";
import { connect } from "react-redux";

import './ManageClassrooms.scss';
import sprite from "assets/img/icons-sprite.svg";

import { User } from "model/user";
import { ReduxCombinedState } from "redux/reducers";
import { checkAdmin } from "components/services/brickService";

import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";

import AddButton from './components/AddButton';
import StudentTable from './components/StudentTable';
import UsersPagination from './components/UsersPagination';
import AssignClassDialog from './components/AssignClassDialog';
import CreateClassDialog from './components/CreateClassDialog';
import RoleDescription from 'components/baseComponents/RoleDescription';

import { getAllClassrooms, getAllStudents, createClass, assignStudentsToClassroom, ClassroomApi } from '../service';

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });
const connector = connect(mapState);

interface MUser extends User {
  selected: boolean;
}

interface UsersListProps {
  user: User;
  history: any;
}

export enum UserSortBy {
  None,
  Name,
}

interface UsersListState {
  users: MUser[];
  page: number;
  pageSize: number;
  totalCount: number;

  searchString: string;
  isSearching: boolean;

  filterExpanded: boolean;
  filterHeight: string;
  isAdmin: boolean;
  classrooms: ClassroomApi[];

  sortBy: UserSortBy;
  isAscending: boolean;
  isClearFilter: boolean;
  createClassOpen: boolean;
  assignClassOpen: boolean;
  selectedUsers: MUser[];
}

class ManageClassrooms extends Component<UsersListProps, UsersListState> {
  constructor(props: UsersListProps) {
    super(props);
    this.state = {
      users: [],
      classrooms: [],
      page: 0,
      pageSize: 12,
      filterExpanded: true,

      totalCount: 0,
      searchString: "",
      isSearching: false,
      filterHeight: "auto",

      sortBy: UserSortBy.None,
      isAscending: false,
      isAdmin: checkAdmin(props.user.roles),
      isClearFilter: false,

      createClassOpen: false,
      assignClassOpen: false,
      selectedUsers: []
    };

    //this.getUsers(this.state.page);

    getAllStudents().then(students => {
      if (students) {
        this.setState({ ...this.state, users: students as any[], totalCount: students.length });
      } else {
        // getting students failed
      }
    });

    getAllClassrooms().then(classrooms => {
      if (classrooms) {
        this.setState({ classrooms });
      } else {
        // geting classrooms failed
        console.log('geting classrooms failed');
      }
    });
  }

  getUsers(
    page: number,
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
        subjectFilters: [],
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

  createClass(name: string) {
    createClass(name).then(newClassroom => {
      if (newClassroom) {
        this.state.classrooms.push(newClassroom);
        this.setState({ ...this.state });
      } else {
        // creation failed
      }
    });
  }

  searching(searchString: string) {
    if (searchString.length === 0) {
      this.setState({ ...this.state, searchString, isSearching: false });
    } else {
      this.setState({ ...this.state, searchString });
    }
  }

  openAssignDialog() {
    this.setState({ assignClassOpen: true });
  }

  search() {
    const { searchString } = this.state;
    this.getUsers(0, this.state.sortBy, this.state.isAscending, searchString);
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
        <div className="create-class-button" onClick={() => this.setState({ createClassOpen: true })}>
          + Create Class
        </div>
        <div className="filter-header">
          View All
          <div className="right-index">
            {this.state.users.length}
            <svg className="svg active">
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#users"} />
            </svg>
            <div className="white-box">
              {this.state.classrooms.length}
            </div>
          </div>
        </div>
        <div className="indexes-box">
          {this.state.classrooms.map((c, i) =>
            <div key={i} className="index-box" onClick={() => { }}>
              {c.name}
              <div className="right-index">
                {c.students.length}
                <svg className="svg active">
                  {/*eslint-disable-next-line*/}
                  <use href={sprite + "#users"} />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  sort(sortBy: UserSortBy) {
    let isAscending = this.state.isAscending;

    if (sortBy === this.state.sortBy) {
      isAscending = !isAscending;
      this.setState({ ...this.state, isAscending });
    } else {
      isAscending = false;
      this.setState({ ...this.state, isAscending, sortBy });
    }
    this.getUsers(this.state.page, sortBy, isAscending);
  }

  moveToPage(page: number) {
    this.setState({ ...this.state, page, selectedUsers: [] });
    this.getUsers(page);
  };

  assignSelectedStudents(classroomId: number) {
    this.setState({ assignClassOpen: false });
    assignStudentsToClassroom(classroomId, this.state.selectedUsers).then(res => {
      if (res) {
        // assign success
      } else {
        // failed
      }
    });
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
            <StudentTable
              users={this.state.users}
              selectedUsers={this.state.selectedUsers}
              sortBy={this.state.sortBy}
              isAscending={this.state.isAscending}
              sort={sortBy => this.sort(sortBy)}
              toggleUser={i => this.toggleUser(i)}
              assignToClass={() => this.openAssignDialog()}
            />
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
        <AssignClassDialog
          users={this.state.selectedUsers}
          classrooms={this.state.classrooms}
          isOpen={this.state.assignClassOpen}
          submit={classroomId => this.assignSelectedStudents(classroomId)}
          close={() => { this.setState({ assignClassOpen: false }) }}
        />
        <CreateClassDialog
          isOpen={this.state.createClassOpen}
          submit={name => {
            this.createClass(name);
            this.setState({ createClassOpen: false })
          }}
          close={() => { this.setState({ createClassOpen: false }) }}
        />
      </div>
    );
  }
}

export default connector(ManageClassrooms);
