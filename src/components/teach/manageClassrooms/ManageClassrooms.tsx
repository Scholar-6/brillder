import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import queryString from 'query-string';

import './ManageClassrooms.scss';
import '../style.scss';

import { User } from "model/user";
import { MUser, TeachActiveTab } from "../model";
import { deleteClassroom, getClassInvitations, getStudents, resendInvitation, updateClassroom } from 'services/axios/classroom';
import { ReduxCombinedState } from "redux/reducers";
import { checkAdmin } from "components/services/brickService";
import {
  getAllClassrooms, unassignStudent, createClass, assignStudentsToClassroom, ClassroomApi, assignStudentIdsToClassroom
} from '../service';

import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";

import StudentTable from './studentTable/StudentTable';
import UsersPagination from './components/UsersPagination';
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
import ClassroomFilterItem from "./components/ClassroomFilterItem";
import { socket } from "socket/socket";
import map from "components/map";


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
  classPageSize: number;
  viewAllPageSize: number;
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
  deleteClassOpen: boolean;

  selectedUsers: MUser[];
  activeClassroom: ClassroomApi | null;
  classroomToRemove: ClassroomApi | null;

  unassignStudent: MUser | null;
  unassignOpen: boolean;

  inviteOpen: boolean;
  numStudentsInvited: number;

  isPending: boolean;
  pendingUsers: MUser[];

  pageStudentsSelected: boolean;
}

class ManageClassrooms extends Component<UsersListProps, UsersListState> {
  constructor(props: UsersListProps) {
    super(props);

    const pageSize = 14;

    this.state = {
      isLoaded: false,
      users: [],
      classrooms: [],
      page: 0,
      pageSize,
      classPageSize: 12,
      viewAllPageSize: pageSize,
      totalCount: 0,
      cantCreate: false,

      searchString: "",
      isSearching: false,
      searchUsers: [],

      sortBy: UserSortBy.None,
      isAscending: false,
      isAdmin: checkAdmin(props.user.roles),

      createClassOpen: false,
      deleteClassOpen: false,

      classroomToRemove: null,
      activeClassroom: null,
      selectedUsers: [],

      unassignStudent: null,
      unassignOpen: false,

      inviteOpen: false,
      numStudentsInvited: 0,

      isPending: false,
      pendingUsers: [],

      pageStudentsSelected: false
    };

    this.loadInitData();
  }

  componentDidMount() {
    socket.on("invitation_accepted", () => {
      this.loadData();
      console.log("inv update")
    });
  }

  componentWillUnmount() {
    socket.off("invitation_accepted");
  }

  async loadInitData() {
    let activeClassroom = null;
    await this.getStudents();
    const classrooms = await this.getClassrooms();
    const values = queryString.parse(this.props.history.location.search);
    if (values.classroomId) {
      activeClassroom = classrooms.find(c => c.id === parseInt(values.classroomId as string));
      if (!activeClassroom) {
        activeClassroom = null;
      } else {
        activeClassroom.isActive = true;
      }
    }
    this.setState({ isLoaded: true, activeClassroom });
    await this.getInvitations();
  }

  async getInvitations() {
    const pendingUsers = await getClassInvitations();
    if (pendingUsers) {
      for (const u of pendingUsers) {
        u.hasInvitation = true;
      }
      this.setState({pendingUsers});
    }
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
    let classrooms = await getAllClassrooms();
    if (classrooms) {
      this.prepareClassrooms(classrooms);
      classrooms = classrooms.filter(c => c.subjectId);
      classrooms = classrooms.sort((a: any, b: any) => b.students.length - a.students.length);
      this.setState({
        classrooms,
        activeClassroom: this.state.activeClassroom ? classrooms.find(c => c.id === this.state.activeClassroom!.id) ?? null : null
      });
      return classrooms;
    } else {
      console.log('geting classrooms failed');
      return [];
    }
  }

  createClass(name: string, subject: Subject) {
    createClass(name, subject).then(newClassroom => {
      if (newClassroom) {
        this.unselectionClasses();
        this.state.classrooms.push(newClassroom);
        newClassroom.isActive = true;
        this.setState({ ...this.state, activeClassroom: newClassroom });
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
      this.unselectAllStudents();
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
    const selectedUsers: MUser[] = [];
    const { page, pageSize, activeClassroom } = this.state;
    if (activeClassroom) {
      let index = 0;
      for (let student of activeClassroom.students) {
        if (index >= page * pageSize && index < (page + 1) * pageSize) {
          student.selected = true;
          selectedUsers.push(student);
        }
        index += 1;
      }
    }
    this.setState({ selectedUsers });
  }

  selectGlobalPageStudents() {
    let index = 0;
    const { page, pageSize } = this.state;
    const selectedUsers: MUser[] = [];
    for (let student of this.state.users) {
      if (index >= page * pageSize && index < (page + 1) * pageSize) {
        student.selected = true;
        selectedUsers.push(student);
      }
      index += 1;
    }
    this.setState({ selectedUsers });
  }
  //#endregion

  searching(searchString: string) {
    if (searchString.length === 0) {
      this.setState({ ...this.state, searchString, isSearching: false });
    } else {
      this.setState({ ...this.state, searchString });
    }
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
    this.props.history.push(map.ManageClassroomsTab + '?classroomId=' + activeClassroom.id);
    this.setState({ activeClassroom, page: 0, isPending: false, pageStudentsSelected: false, pageSize: this.state.classPageSize, selectedUsers: [], isSearching: false });
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
    this.setState({ users: this.state.users, selectedUsers: [] });
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
    this.setState({
      activeClassroom: null, isPending: false, pageStudentsSelected: false,
      pageSize: this.state.viewAllPageSize, page: 0, isSearching: false
    });
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
    let className = "m-view-all index-box hover-light item-box2";
    if (!this.state.activeClassroom && !this.state.isPending) {
      className += " active";
    }

    return (
      <div className={className} onClick={() => this.unselectClasses()}>
        View All
        <div className="right-index right-index2">
          {this.state.users.length}
          <SpriteIcon name="users-custom" className="active" />
          <div className="classrooms-box">
            {this.state.classrooms.length}
          </div>
        </div>
      </div>
    );
  }

  renderPendingFilter() {
    let className = "m-view-all index-box yellow item-box2";
    if (this.state.isPending) {
      className += " active";
    }

    return (
      <div className={className} onClick={() => {
        this.unselectClasses();
        this.setState({isPending: true});
      }}>
        Pending
        <div className="right-index right-index2">
          {this.state.pendingUsers.length}
          <SpriteIcon name="users-custom" className="active" />
        </div>
      </div>
    );
  }

  renderSortAndFilterBox() {
    if (!this.state.isLoaded) return <div></div>;

    const noClassroom = this.state.users.length === 0 && this.state.classrooms.length === 0;

    if (this.state.isLoaded && noClassroom) {
      return <EmptyFilter />;
    }

    const {classrooms} = this.state;

    return (
      <div className="flex-height-box">
        <div className="sort-box">
          <div className="filter-container sort-by-box">
            <div style={{ display: 'flex' }}>
              {classrooms.length > 1
                ? <div className="class-header" style={{ width: '50%' }}>{classrooms.length} CLASSES</div>
                : <div className="class-header" style={{ width: '50%' }}>{classrooms.length} CLASS</div>
              }
            </div>
          </div>
          <div className="create-class-button" onClick={() => this.setState({ createClassOpen: true })}>
            <SpriteIcon name="plus-circle" /> Create Class
          </div>
          {this.renderViewAllFilter()}
          {this.renderPendingFilter()}
        </div>
        <div className="sort-box subject-scrollable">
          <div className="subject-indexes-box filter-container manage-classrooms-filter">
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
        <div className="sidebar-footer" />
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

  invitationSuccess(numInvited: number) {
    this.setState({ inviteOpen: false, numStudentsInvited: numInvited });
    if (numInvited > 0) {
      this.loadData();
    }
  }

  async resendInvitation(email: string, classroom?: ClassroomApi) {
    if(this.state.activeClassroom || classroom) {
      await resendInvitation((this.state.activeClassroom ?? classroom)!, email);
      this.invitationSuccess(1);
    }
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

  inviteStudent() {
    this.setState({ inviteOpen: true });
  }

  async updateClassroom(name: string, subject: Subject) {
    if (this.state.activeClassroom) {
      let success = await updateClassroom({ ...this.state.activeClassroom, name, subject });
      if (success) {
        this.getClassrooms();
      }
    }
  }

  renderTopRow(inviteHidden?: boolean) {
    return (
      <Grid container alignItems="stretch" direction="row" className="selected-class-name">
        <Grid item xs>
          <NameAndSubjectForm
            isStudents={true}
            inviteHidden={inviteHidden}
            assignHidden={true}
            moveToAssignemts={() => this.props.history.push('/teach/assigned')}
            classroom={this.state.activeClassroom}
            onChange={this.updateClassroom.bind(this)}
            onInvited={this.loadData.bind(this)}
          />
        </Grid>
      </Grid>
    );
  }

  renderClassEmptyStudents() {
    return (
      <div className="tab-content">
        {this.state.activeClassroom &&
          <div>{this.renderTopRow(true)}</div>
        }
        <div className="tab-content-centered">
          <div>
            <div className="icon-container m-l-012">
              <SpriteIcon
                name="user-plus"
                className="stroke-1"
                onClick={() => this.setState({ inviteOpen: true })}
              />
            </div>
            <div className="bold">+ Invite Students</div>
          </div>
        </div>
      </div>
    );
  }

  renderTabContent() {
    if (!this.state.isLoaded) {
      return (
        <div className="tab-content">
          <div className="f-top-loader">
            <SpriteIcon name="f-loader" className="spinning" />
          </div>
        </div>
      );
    }
    const { activeClassroom } = this.state;
    let users = Object.assign([], this.state.users) as MUser[];

    let classHasStudents = activeClassroom && activeClassroom.students.length > 0;

    if (activeClassroom && !classHasStudents) {
      return this.renderClassEmptyStudents();
    }

    if (this.state.isLoaded && users.length === 0 && !classHasStudents) {
      return (
        <div className="tab-content">
          {this.state.activeClassroom &&
            <div>{this.renderTopRow()}</div>
          }
          <div className="tab-content-centered">
            <div className="new-class-container" onClick={() => this.setState({ createClassOpen: true })}>
              <div className="icon-container">
                <SpriteIcon
                  name="users-custom"
                  className="stroke-1"
                />
              </div>
              <div className="bold-hover">+ Create Class</div>
              <div className="text-center f-s-2 m-t-2vh">You can invite between 1 and 50 students to a class</div>
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
    

    if (this.state.isPending) {
      const visibleUsers = this.getUsersByPage(this.state.pendingUsers);

      return (
        <div className="tab-content students-content">
          <StudentTable
            isPending={true}
            history={this.props.history}
            users={visibleUsers}
            isAdmin={this.state.isAdmin}
            selectedUsers={this.state.pendingUsers}
            sortBy={this.state.sortBy}
            isAscending={this.state.isAscending}
            pageStudentsSelected={this.state.pageStudentsSelected}
            sort={this.sortByLastName.bind(this)}
            toggleUser={this.toggleUser.bind(this)}
            unassign={this.unassigningStudent.bind(this)}
            togglePageStudents={this.togglePageStudents.bind(this)}
            resendInvitation={this.resendInvitation.bind(this)}
          />
          {this.renderPagination(visibleUsers, this.state.pendingUsers)}
        </div>
      );
    }

    return (
      <div className="tab-content students-content">
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
          unassign={this.unassigningStudent.bind(this)}
          togglePageStudents={this.togglePageStudents.bind(this)}
          resendInvitation={this.resendInvitation.bind(this)}
        />
        {this.renderPagination(visibleUsers, users)}
      </div>
    );
  }

  render() {
    const { history } = this.props;

    const { activeClassroom } = this.state;

    return (
      <div className="main-listing user-list-page manage-classrooms-page manage-classrooms-checkboxes">
        <PageHeadWithMenu
          page={PageEnum.ManageClasses}
          placeholder="Student Name or Subject"
          user={this.props.user}
          history={history}
          search={() => this.search()}
          searching={v => this.searching(v)}
        />
        <Grid container direction="row" className="sorted-row">
          <Grid container item xs={3} className="sort-and-filter-container manage-class-filter">
            {this.renderSortAndFilterBox()}
          </Grid>
          <Grid item xs={9} className="brick-row-container">
            <TeachTab history={history} activeTab={TeachActiveTab.Students} assignmentsEnabled={this.state.classrooms.length > 0} />
            {this.renderTabContent()}
          </Grid>
        </Grid>
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
        {activeClassroom && <div>
          <InviteStudentEmailDialog
            isOpen={this.state.inviteOpen}
            close={(numInvited) => this.invitationSuccess(numInvited)}
            classroom={activeClassroom}
          />
        </div>}
        <StudentInviteSuccessDialog
          numStudentsInvited={this.state.numStudentsInvited}
          close={() => this.setState({ numStudentsInvited: 0 })}
        />
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
