import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";

import './ManageClassrooms.scss';
import '../style.scss';

import { User } from "model/user";
import { MUser, TeachActiveTab } from "../model";
import { deleteClassroom, getStudents, updateClassroom } from 'services/axios/classroom';
import { ReduxCombinedState } from "redux/reducers";
import { checkAdmin } from "components/services/brickService";
import {
  getAllClassrooms, unassignStudent, createClass, assignStudentsToClassroom, ClassroomApi, assignStudentIdsToClassroom
} from '../service';

import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";

import AddButton from './components/AddButton';
import StudentTable from './studentTable/StudentTable';
import UsersPagination from './components/UsersPagination';
import AssignClassDialog from './components/AssignClassDialog';
import CreateClassDialog from './components/CreateClassDialog';
import DeleteClassDialog from './components/DeleteClassDialog';
import InviteStudentEmailDialog from './components/InviteStudentEmailDialog';
import UnassignStudentDialog from './components/UnassignStudentDialog';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import TeachTab from '../TeachTab';
import EmptyFilter from "./components/EmptyFilter";
import ValidationFailedDialog from "components/baseComponents/dialogs/ValidationFailedDialog";
import StudentInviteSuccessDialog from "components/play/finalStep/dialogs/StudentInviteSuccessDialog";
import NameAndSubjectForm from "../components/NameAndSubjectForm";
import { Subject } from "model/brick";
import map from "components/map";
import ClassroomFilterItem from "./components/ClassroomFilterItem";


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
  isLoaded: boolean;
  users: MUser[];
  page: number;
  pageSize: number;
  totalCount: number;

  searchString: string;
  isSearching: boolean;
  searchUsers: MUser[];
  cantCreate: boolean;

  isAdmin: boolean;
  classrooms: ClassroomApi[];

  sortBy: UserSortBy;
  isAscending: boolean;

  createClassOpen: boolean;
  assignClassOpen: boolean;
  deleteClassOpen: boolean;

  selectedUsers: MUser[];
  activeClassroom: ClassroomApi | null;
  classroomToRemove: ClassroomApi | null;

  unassignStudent: MUser | null;
  unassignOpen: boolean;

  inviteEmailOpen: boolean;
  numStudentsInvited: number;

  pageStudentsSelected: boolean;
}

class ManageClassrooms extends Component<UsersListProps, UsersListState> {
  constructor(props: UsersListProps) {
    super(props);
    this.state = {
      isLoaded: false,
      users: [],
      classrooms: [],
      page: 0,
      pageSize: 12,
      totalCount: 0,
      cantCreate: false,

      searchString: "",
      isSearching: false,
      searchUsers: [],

      sortBy: UserSortBy.None,
      isAscending: false,
      isAdmin: checkAdmin(props.user.roles),

      createClassOpen: false,
      assignClassOpen: false,
      deleteClassOpen: false,

      classroomToRemove: null,
      activeClassroom: null,
      selectedUsers: [],

      unassignStudent: null,
      unassignOpen: false,

      inviteEmailOpen: false,
      numStudentsInvited: 0,

      pageStudentsSelected: false
    };

    this.loadData();
  }

  async loadData() {
    await this.getStudents();
    await this.getClassrooms();
    this.setState({ isLoaded: true });
  }

  async getStudents() {
    const users = await getStudents() as MUser[] | null;
    if (users) {
      users.map(u => u.selected = false);
      this.setState({ ...this.state, users, totalCount: users.length });
    } else {
      // getting students failed
    }
  }

  prepareClassrooms(classrooms: ClassroomApi[]) {
    for (let classroom of classrooms) {
      if (classroom.studentsInvitations) {
        for (let student of classroom.studentsInvitations) {
          student.hasInvitation = true;
        }
        classroom.students = [...classroom.students, ...classroom.studentsInvitations];
      }
    }
  }

  async getClassrooms() {
    const classrooms = await getAllClassrooms();
    if (classrooms) {
      this.prepareClassrooms(classrooms);
      this.setState({
        classrooms,
        activeClassroom: this.state.activeClassroom ? classrooms.find(c => c.id === this.state.activeClassroom!.id) ?? null : null
      });
    } else {
      console.log('geting classrooms failed');
    }
  }

  createClass(name: string, subject: Subject) {
    createClass(name, subject).then(newClassroom => {
      if (newClassroom) {
        this.state.classrooms.push(newClassroom);
        this.setState({ ...this.state });
      } else {
        // creation failed
      }
    });
  }

  //#region Students selection
  togglePageStudents() {
    if (this.state.pageStudentsSelected) {
      this.unselectAllStudents();
      const { activeClassroom } = this.state;
      if (activeClassroom) {
        activeClassroom.isActive = true;
      }
      this.setState({ pageStudentsSelected: false, selectedUsers: [] });
    } else {
      // select whole page
      this.selectPageStudents();
      this.setState({ pageStudentsSelected: true });
    }
  }

  selectPageStudents() {
    if (this.state.activeClassroom) {
      this.selectPageClassStudents();
    } else {
      this.selectGlobalPageStudents();
    }
  }

  selectPageClassStudents() {
    const { page, pageSize, activeClassroom } = this.state;
    if (activeClassroom) {
      let index = 0;
      for (let student of activeClassroom.students) {
        if (index >= page * pageSize && index < (page + 1) * pageSize) {
          student.selected = true;
          this.state.selectedUsers.push(student);
        }
        index += 1;
      }
    }
  }

  selectGlobalPageStudents() {
    let index = 0;
    const { page, pageSize } = this.state;
    for (let student of this.state.users) {
      if (index >= page * pageSize && index < (page + 1) * pageSize) {
        student.selected = true;
        this.state.selectedUsers.push(student);
      }
      index += 1;
    }
  }
  //#endregion

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
      let res = student.firstName?.toLowerCase().search(searchString.toLowerCase());
      if (res >= 0) {
        searchUsers.push(student)
        continue;
      }
      res = student.lastName?.toLocaleLowerCase().search(searchString.toLowerCase());
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

  toggleUser(userId: number) {
    let { users } = this.state;
    if (this.state.activeClassroom) {
      users = this.state.activeClassroom.students;
    }
    const student = users.find(s => s.id === userId);
    if (student) {
      student.selected = !student.selected;
    }
    let selectedUsers = users.filter(u => u.selected);
    this.setState({ ...this.state, pageStudentsSelected: false, selectedUsers });
  }

  setActiveClassroom(activeClassroom: ClassroomApi) {
    this.unselectAllStudents();
    activeClassroom.isActive = true;
    this.setState({ activeClassroom, page: 0, selectedUsers: [], isSearching: false });
  }

  async deleteClass() {
    const { classroomToRemove } = this.state;
    if (!classroomToRemove) {
      return this.setState({ deleteClassOpen: false, activeClassroom: null, classroomToRemove: null, page: 0 });
    }
    let deleted = await deleteClassroom(classroomToRemove.id);
    if (deleted) {
      const { classrooms } = this.state;
      let index = classrooms.indexOf(classroomToRemove);
      classrooms.splice(index, 1);
      this.setState({ classrooms, activeClassroom: null, classroomToRemove: null, deleteClassOpen: false, page: 0 });
    }
  }

  onDeleteClass(c: ClassroomApi) {
    this.setState({ deleteClassOpen: true, classroomToRemove: c });
  }

  unselectAllStudents() {
    this.unselectionClasses();
    for (let user of this.state.users) {
      user.selected = false;
    }
    this.setState({ users: this.state.users });
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
    this.setState({ activeClassroom: null, page: 0, isSearching: false });
  }

  onDrop(e: React.DragEvent<HTMLDivElement>, classroomId: number) {
    const dropData = e.dataTransfer.getData("text/plain");
    if (dropData) {
      try {
        const data = JSON.parse(dropData) as { studentIds: number[] };
        if (data.studentIds.length > 0) {
          this.assignDroppedStudents(classroomId, data.studentIds);
        }
      }
      catch { }
    }

    // clearing data not working on firefox
    try { e.dataTransfer.clearData() } catch { }
  }

  renderViewAllFilter() {
    let className = "index-box hover-light item-box2";
    if (!this.state.activeClassroom) {
      className += " active";
    }
    return (
      <div className={className} onClick={() => this.unselectClasses()}>
        View All
        <div className="right-index right-index2">
          {this.state.users.length}
          <SpriteIcon name="users" className="active" />
          <div className="classrooms-box">
            {this.state.classrooms.length}
          </div>
        </div>
      </div>
    );
  }

  renderSortAndFilterBox() {
    if (!this.state.isLoaded) {
      return <div></div>;
    }
    if (this.state.isLoaded && this.state.users.length === 0 && this.state.classrooms.length === 0) {
      return <EmptyFilter />;
    }
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
        <div className="subject-indexes-box filter-container manage-classrooms-filter">
          {this.renderViewAllFilter()}
          {this.state.classrooms.map((c, i) =>
            <ClassroomFilterItem
              classroom={c}
              key={i}
              activeClassroom={this.state.activeClassroom}
              setActiveClassroom={this.setActiveClassroom.bind(this)}
              onDeleteClass={this.onDeleteClass.bind(this)}
              onDrop={this.onDrop.bind(this)}
            />
          )}
        </div>
      </div>
    );
  };

  sortByLastName() {
    let { users, isAscending } = this.state;
    isAscending = !isAscending;
    if (isAscending) {
      users.sort((a, b) => a.lastName < b.lastName ? -1 : 1);
    } else {
      users.sort((a, b) => a.lastName < b.lastName ? 1 : -1);
    }
    this.setState({ ...this.state, users, sortBy: UserSortBy.Name, isAscending });
  }

  moveToPage(page: number) {
    this.unselectAllStudents();
    this.setState({ ...this.state, pageStudentsSelected: false, page, selectedUsers: [] });
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

  assignDroppedStudents(classroomId: number, studentIds: number[]) {
    assignStudentIdsToClassroom(classroomId, studentIds).then(res => {
      if (res) {
        // assign success
        this.getClassrooms();
      } else {
        // failed
      }
    });
  }

  unassignStudent(student: MUser | null) {
    const { activeClassroom } = this.state;
    if (activeClassroom && student) {
      const { id } = activeClassroom;
      unassignStudent(id, student.id).then(res => {
        if (res) {
          const classroom = this.state.classrooms.find(c => c.id === id);
          if (classroom) {
            let index = classroom.students.findIndex(s => s.id === student.id);
            classroom.students.splice(index, 1);
            this.setState({ classrooms: this.state.classrooms, unassignOpen: false });
          }
        } else {
          // failture
          this.setState({ unassignOpen: false });
        }
      });
    }
  }

  unassigningStudent(student: MUser) {
    const { activeClassroom } = this.state;
    if (activeClassroom) {
      this.setState({ unassignStudent: student, unassignOpen: true });
    }
  }

  getUsersByPage(users: MUser[]) {
    const pageStart = this.state.page * this.state.pageSize;
    return users.slice(pageStart, pageStart + this.state.pageSize);
  }

  renderPagination(visibleUsers: MUser[], users: MUser[]) {
    return (
      <UsersPagination
        users={visibleUsers}
        page={this.state.page}
        totalCount={users.length}
        pageSize={this.state.pageSize}
        moveToPage={page => this.moveToPage(page)}
      />
    );
  }

  renderEmptyTab() {
    const moveToNewUser = () => {
      if (this.state.isAdmin) {
        this.props.history.push(map.UserProfile + '/new');
      } else {
        this.setState({ cantCreate: true });
      }
    }

    return (
      <div className="tab-content">
        <div className="tab-content-centered">
          {this.state.activeClassroom ?
            <div>
              <div className="icon-container">
                <SpriteIcon
                  name="users-custom"
                  className="stroke-1"
                  onClick={() => this.setState({ inviteEmailOpen: true })}
                />
              </div>
              <div className="bold">+ Invite Students</div>
            </div>
            : <div>
              <div className="icon-container">
                <SpriteIcon
                  name="user-plus"
                  className="stroke-1"
                  onClick={moveToNewUser}
                />
              </div>
              <div className="bold">+ Invite Pupil&nbsp;&nbsp;&nbsp;&nbsp;</div>
            </div>
          }
        </div>
      </div>
    );
  }

  async updateClassroom(name: string, subject: Subject) {
    if (this.state.activeClassroom) {
      let success = await updateClassroom({ ...this.state.activeClassroom, name, subject });
      if (success) {
        this.getClassrooms();
      }
    }
  }

  renderTopRow() {
    return (
      <Grid container alignItems="stretch" direction="row">
        <Grid item xs>
          <NameAndSubjectForm
            name={this.state.activeClassroom!.name}
            subject={this.state.activeClassroom!.subject}
            onChange={this.updateClassroom.bind(this)}
          />
        </Grid>
        <Grid item>
          <AddButton isAdmin={this.state.isAdmin} onOpen={() => this.setState({ inviteEmailOpen: true })} />
        </Grid>
      </Grid>
    );
  }

  renderTabContent() {
    if (!this.state.isLoaded) {
      return <div className="tab-content" />
    }
    const { activeClassroom } = this.state;
    let { users } = this.state;

    const moveToNewUser = () => {
      if (this.state.isAdmin) {
        this.props.history.push(map.UserProfile + '/new');
      } else {
        this.setState({ cantCreate: true });
      }
    }

    if (this.state.isLoaded && users.length === 0 && this.state.classrooms.length === 0) {
      return (
        <div className="tab-content">
          <div className="tab-content-centered">
            <div>
              <div className="icon-container">
                <SpriteIcon
                  name="users-custom"
                  className="stroke-1"
                  onClick={() => this.setState({ createClassOpen: true })}
                />
              </div>
              <div className="bold">+ Create Class</div>
            </div>
            <div>
              <div className="icon-container">
                <SpriteIcon
                  name="user-plus"
                  className="stroke-1"
                  onClick={moveToNewUser}
                />
              </div>
              <div className="bold">+ Invite Pupil&nbsp;&nbsp;&nbsp;&nbsp;</div>
            </div>
          </div>
        </div>
      );
    }

    if (activeClassroom) {
      users = activeClassroom.students as MUser[];
    }
    if (this.state.isSearching) {
      users = this.state.searchUsers;
    }

    const visibleUsers = this.getUsersByPage(users);

    return (
      <div className="tab-content">
        {visibleUsers.length > 0 ? <>
          {activeClassroom && this.renderTopRow()}
          <StudentTable
            history={this.props.history}
            users={visibleUsers}
            isClassroom={!!activeClassroom}
            isAdmin={this.state.isAdmin}
            selectedUsers={this.state.selectedUsers}
            sortBy={this.state.sortBy}
            isAscending={this.state.isAscending}
            pageStudentsSelected={this.state.pageStudentsSelected}
            sort={this.sortByLastName.bind(this)}
            toggleUser={this.toggleUser.bind(this)}
            assignToClass={this.openAssignDialog.bind(this)}
            unassign={this.unassigningStudent.bind(this)}
            togglePageStudents={this.togglePageStudents.bind(this)}
          />
        </> :
          this.renderEmptyTab()
        }
        {this.renderPagination(visibleUsers, users)}
      </div>
    );
  }

  render() {
    const { history } = this.props;

    return (
      <div className="main-listing user-list-page manage-classrooms-page manage-classrooms-checkboxes">
        <PageHeadWithMenu
          page={PageEnum.ManageClasses}
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
            <TeachTab history={history} activeTab={TeachActiveTab.Students} assignmentsEnabled={this.state.classrooms.length > 0} />
            {this.renderTabContent()}
          </Grid>
        </Grid>
        <AssignClassDialog
          users={this.state.selectedUsers}
          classrooms={this.state.classrooms}
          isOpen={this.state.assignClassOpen}
          submit={classroomId => this.assignSelectedStudents(classroomId)}
          close={() => { this.setState({ assignClassOpen: false }) }}
        />
        <DeleteClassDialog
          isOpen={this.state.deleteClassOpen}
          submit={() => this.deleteClass()}
          close={() => { this.setState({ deleteClassOpen: false }) }}
        />
        <CreateClassDialog
          isOpen={this.state.createClassOpen}
          submit={(name, subject) => {
            this.createClass(name, subject);
            this.setState({ createClassOpen: false })
          }}
          close={() => { this.setState({ createClassOpen: false }) }}
        />
        <UnassignStudentDialog
          isOpen={this.state.unassignOpen}
          student={this.state.unassignStudent}
          close={() => this.setState({ unassignOpen: false })}
          submit={() => this.unassignStudent(this.state.unassignStudent)}
        />
        {this.state.activeClassroom && <>
          <InviteStudentEmailDialog
            isOpen={this.state.inviteEmailOpen}
            close={(numInvited) => this.setState({ inviteEmailOpen: false, numStudentsInvited: numInvited })}
            classroom={this.state.activeClassroom}
          />
          <StudentInviteSuccessDialog
            numStudentsInvited={this.state.numStudentsInvited}
            close={() => this.setState({ numStudentsInvited: 0 })}
          />
        </>}
        <ValidationFailedDialog
          isOpen={this.state.cantCreate}
          header="You don`t have permisions to create new user"
          close={() => this.setState({ cantCreate: false })}
        />
      </div>
    );
  }
}

export default connector(ManageClassrooms);
