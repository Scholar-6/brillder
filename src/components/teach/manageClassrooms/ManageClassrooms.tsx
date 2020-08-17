import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";

import './ManageClassrooms.scss';
import sprite from "assets/img/icons-sprite.svg";

import { User } from "model/user";
import { MUser } from "../interface";
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
  searchUsers: MUser[];

  isAdmin: boolean;
  classrooms: ClassroomApi[];

  sortBy: UserSortBy;
  isAscending: boolean;
  createClassOpen: boolean;
  assignClassOpen: boolean;
  selectedUsers: MUser[];
  activeClassroom: ClassroomApi | null;
}

class ManageClassrooms extends Component<UsersListProps, UsersListState> {
  constructor(props: UsersListProps) {
    super(props);
    this.state = {
      users: [],
      classrooms: [],
      page: 0,
      pageSize: 12,
      totalCount: 0,

      searchString: "",
      isSearching: false,
      searchUsers: [],

      sortBy: UserSortBy.None,
      isAscending: false,
      isAdmin: checkAdmin(props.user.roles),

      createClassOpen: false,
      assignClassOpen: false,
      activeClassroom: null,
      selectedUsers: []
    };

    getAllStudents().then(students => {
      if (students) {
        students.map((u: any) => u.selected = false);
        this.setState({ ...this.state, users: students as any[], totalCount: students.length });
      } else {
        // getting students failed
      }
    });

    this.getClassrooms();
  }

  getClassrooms() {
    getAllClassrooms().then(classrooms => {
      if (classrooms) {
        this.setState({ classrooms });
      } else {
        // geting classrooms failed
        console.log('geting classrooms failed');
      }
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
    let students = this.state.users;
    if (this.state.activeClassroom) {
      students = this.state.activeClassroom.students as MUser[];
    }
    let searchUsers = [];
    const { searchString } = this.state;
    for (let student of students) {
      let res = student.firstName.toLowerCase().search(searchString.toLowerCase());
      if (res >= 0) {
        searchUsers.push(student)
        continue;
      }
      res = student.lastName.toLocaleLowerCase().search(searchString.toLowerCase());
      if (res >= 0) {
        searchUsers.push(student);
        continue;
      }
    }
    this.setState({
      isSearching: true,
      selectedUsers: [],
      searchUsers
    });
  }

  toggleUser(i: number) {
    let { users } = this.state;
    if (this.state.activeClassroom) {
      users = this.state.activeClassroom.students;
    }
    users[i].selected = !users[i].selected;
    let selectedUsers = users.filter(u => u.selected);
    this.setState({ ...this.state, selectedUsers });
  }

  setActiveClassroom(activeClassroom: ClassroomApi) {
    this.unselectionClasses();
    activeClassroom.isActive = true;
    for (let user of this.state.users) {
      user.selected = false;
    }
    this.setState({ activeClassroom, selectedUsers: [], isSearching: false });
  }

  unselectionClasses() {
    for (let classroom of this.state.classrooms) {
      classroom.isActive = false;
      for (let student of classroom.students) {
        student.selected = false;
      }
    }
  }

  unselectClasses() {
    this.unselectionClasses();
    this.setState({ activeClassroom: null, isSearching: false });
  }

  renderViewAllFilter() {
    let className = "index-box";
    if (!this.state.activeClassroom) {
      className += " active";
    }
    return (
      <div className={className} onClick={() => this.unselectClasses()}>
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
    );
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
        <div className="indexes-box">
          {this.renderViewAllFilter()}
          {this.state.classrooms.map((c, i) => {
            let className = "index-box";
            if (c.isActive) {
              className += " active";
            }
            return (
              <div key={i} className={className} onClick={() => this.setActiveClassroom(c)}>
                {c.name}
                <div className="right-index">
                  {c.students.length}
                  <svg className="svg active">
                    {/*eslint-disable-next-line*/}
                    <use href={sprite + "#users"} />
                  </svg>
                </div>
              </div>
            );
          })}
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
  }

  moveToPage(page: number) {
    this.setState({ ...this.state, page, selectedUsers: [] });
  };

  assignSelectedStudents(classroomId: number) {
    this.setState({ assignClassOpen: false });
    assignStudentsToClassroom(classroomId, this.state.selectedUsers).then(res => {
      if (res) {
        // assign success
        this.getClassrooms();
      } else {
        // failed
      }
    });
  }

  getUsersByPage(users: MUser[]) {
    const pageStart = this.state.page * this.state.pageSize;
    return users.slice(pageStart, pageStart + this.state.pageSize);
  }

  renderTableHeader() {
    return (
      <div className="user-header">
        <h1 className="brick-row-title">ALL STUDENTS</h1>
        <AddButton label="ADD STUDENT" link="/" history={this.props.history} />
      </div>
    );
  }

  renderPagination() {
    let {users} = this.state;
    if (this.state.activeClassroom) {
      users = this.state.activeClassroom.students;
    }
    if (this.state.isSearching) {
      users = this.state.searchUsers;
    }

    let totalCount = users.length;
    users = this.getUsersByPage(users);

    return (
      <UsersPagination
        users={users}
        page={this.state.page}
        totalCount={totalCount}
        pageSize={this.state.pageSize}
        moveToPage={page => this.moveToPage(page)}
      />
    );
  }

  render() {
    const { history } = this.props;
    let { users } = this.state;
    if (this.state.activeClassroom) {
      users = this.state.activeClassroom.students as MUser[];
    }
    if (this.state.isSearching) {
      users = this.state.searchUsers;
    }

    users = this.getUsersByPage(users);
    
    return (
      <div className="main-listing user-list-page manage-classrooms-page">
        <PageHeadWithMenu
          page={PageEnum.ManageUsers}
          placeholder="Search by Name, Email or Subject"
          user={this.props.user}
          history={history}
          search={() => this.search()}
          searching={v => this.searching(v)}
        />
        <Grid container direction="row" className="sorted-row">
          <Grid container item xs={3} className="sort-and-filter-container">
            {this.renderSortAndFilterBox()}
          </Grid>
          <Grid item xs={9} className="brick-row-container">
            {this.renderTableHeader()}
            <StudentTable
              users={users}
              selectedUsers={this.state.selectedUsers}
              sortBy={this.state.sortBy}
              isAscending={this.state.isAscending}
              sort={sortBy => this.sort(sortBy)}
              toggleUser={i => this.toggleUser(i)}
              assignToClass={() => this.openAssignDialog()}
            />
            <RoleDescription />
            {this.renderPagination()}
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
