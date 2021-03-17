import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";

import './TeachPage.scss';
import { ReduxCombinedState } from "redux/reducers";
import actions from 'redux/actions/requestFailed';

import { User } from "model/user";
import { Subject } from "model/brick";
import { TeachClassroom, TeachStudent } from "model/classroom";
import { createClass, getAllClassrooms } from "components/teach/service";
import { checkAdmin, checkTeacher } from "components/services/brickService";
import { TeachFilters } from '../model';
import { Assignment } from "model/classroom";
import { getAssignmentStats } from "services/axios/stats";
import { ApiAssignemntStats } from "model/stats";
import { downKeyPressed, upKeyPressed } from "components/services/key";

import BackPagePagination from 'components/backToWorkPage/components/BackPagePagination';
import TeachFilterSidebar from './components/TeachFilterSidebar';
import ClassroomList from './components/ClassroomList';
import ClassroomsList from './components/ClassroomsList';
import ActiveStudentBricks from "./components/ActiveStudentBricks";
import ExpandedAssignment from './components/ExpandedAssignment';
import TeachTab from "components/teach/TeachTab";
import { TeachActiveTab } from "components/teach/model";
import { getSubjects } from "services/axios/subject";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import map from "components/map";
import ReminderSuccessDialog from "components/baseComponents/dialogs/ReminderSuccessDialog";
import CreateClassDialog from "../manageClassrooms/components/CreateClassDialog";
import { isArchived } from "./service/service";


interface RemindersData {
  isOpen: boolean;
  count: number;
  isDeadlinePassed: boolean;
}

interface TeachProps {
  history: any;
  searchString: string;

  // redux
  user: User;
  requestFailed(e: string): void;
}

interface TeachState {
  isTeach: boolean;
  isAdmin: boolean;
  isArchive: boolean;
  pageSize: number;
  classPageSize: number;
  assignmentPageSize: number;
  sortedIndex: number;
  classrooms: TeachClassroom[];
  activeClassroom: TeachClassroom | null;
  activeAssignment: Assignment | null;
  activeStudent: TeachStudent | null;
  assignmentStats: ApiAssignemntStats | null;
  totalCount: number;
  subjects: Subject[];
  isSearching: boolean;
  isLoaded: boolean;
  remindersData: RemindersData;
  createClassOpen: boolean;

  filters: TeachFilters;
  handleKey(e: any): void;
}

class TeachPage extends Component<TeachProps, TeachState> {
  constructor(props: TeachProps) {
    super(props);

    const isTeach = checkTeacher(props.user);
    const isAdmin = checkAdmin(props.user.roles);

    const pathname = props.history.location.pathname as string;
    const isArchive = pathname.search('/archive') >= 0;

    this.state = {
      isAdmin,
      isTeach,

      isArchive,

      filters: {
        assigned: false,
        completed: false
      },

      classrooms: [],
      activeClassroom: null,
      activeAssignment: null,
      assignmentStats: null,
      activeStudent: null,
      isLoaded: false,

      remindersData: {
        isOpen: false,
        count: 0,
        isDeadlinePassed: false
      },
      createClassOpen: false,

      totalCount: 0,
      isSearching: false,
      subjects: [],

      pageSize: 6,
      classPageSize: 5,
      assignmentPageSize: 8,
      sortedIndex: 0,
      handleKey: this.handleKey.bind(this),
    };

    this.loadData();
  }

  componentDidMount() {
    document.addEventListener("keydown", this.state.handleKey, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.state.handleKey, false);
  }

  async loadData() {
    let subjects = await getSubjects();
    if (subjects) {
      this.setState({ subjects });
    }
    this.loadClasses();
  }

  async loadClasses(activeClassId?: number) {
    let classrooms = await getAllClassrooms() as TeachClassroom[] | null;
    if (classrooms) {
      classrooms = classrooms.filter(c => c.subjectId);

      let { activeClassroom } = this.state;

      if (activeClassId) {
        const classroom = classrooms.find(c => c.id == activeClassId);
        if (classroom) {
          activeClassroom = classroom;
          activeClassroom.active = true;
        }
      }

      this.setState({ classrooms, activeClassroom, isLoaded: true });
      return classrooms;
    } else {
      this.props.requestFailed('can`t get classrooms');
    }
  }

  async loadClass(id: number) {
    let classrooms = await this.loadClasses();
    if (classrooms) {
      const classroom = classrooms.find(c => c.id === id);
      if (classroom) {
        this.setState({ activeClassroom: classroom });
      }
    }
  }

  handleKey(e: any) {
    let pageSize = this.state.pageSize;
    if (!this.state.activeStudent && this.state.activeClassroom && this.state.activeAssignment) {
      pageSize = this.state.assignmentPageSize;
    }
    if (this.state.activeClassroom) {
      pageSize = this.state.classPageSize;
    }
    if (upKeyPressed(e)) {
      this.moveBack(pageSize);
    } else if (downKeyPressed(e)) {
      this.moveNext(pageSize);
    }
  }

  setActiveStudent(activeStudent: TeachStudent) {
    this.setState({ activeStudent, sortedIndex: 0 });
  }

  setActiveClassroom(id: number | null) {
    this.collapseClasses();
    const { classrooms } = this.state;
    let classroom = classrooms.find(c => c.id === id);
    if (classroom) {
      classroom.active = true;
      this.setState({ sortedIndex: 0, classrooms, activeClassroom: classroom, activeAssignment: null, activeStudent: null, assignmentStats: null });
    } else {
      this.setState({ sortedIndex: 0, activeClassroom: null, activeStudent: null, activeAssignment: null, assignmentStats: null });
    }
  }

  async setActiveAssignment(classroomId: number, assignmentId: number) {
    this.collapseClasses();
    const classroom = this.state.classrooms.find(c => c.id === classroomId);
    if (classroom) {
      const assignment = classroom.assignments.find(c => c.id === assignmentId);
      if (assignment) {
        classroom.active = true;
        const assignmentStats = await getAssignmentStats(assignment.id);
        this.setState({ sortedIndex: 0, activeClassroom: classroom, activeAssignment: assignment, assignmentStats });
      }
    }
  }

  collapseClasses() {
    for (let classroom of this.state.classrooms) {
      classroom.active = false;
    }
  }

  unselectAssignment() {
    this.collapseClasses();
    this.setState({ sortedIndex: 0, activeClassroom: null, activeAssignment: null, assignmentStats: null });
  }

  teachFilterUpdated(filters: TeachFilters) {
    this.setState({ filters });
  }

  //#region pagination
  moveNext(pageSize: number) {
    const index = this.state.sortedIndex;
    let itemsCount = this.getTotalCount();

    if (!this.state.activeStudent && this.state.activeAssignment && this.state.assignmentStats && this.state.activeClassroom) {
      itemsCount = this.state.activeClassroom.students.length;
    }

    if (index + pageSize < itemsCount) {
      this.setState({ ...this.state, sortedIndex: index + pageSize });
    }
  }

  moveBack(pageSize: number) {
    let index = this.state.sortedIndex;
    if (index >= pageSize) {
      this.setState({ ...this.state, sortedIndex: index - pageSize });
    }
  }

  async createClass(name: string, subject: Subject) {
    const newClassroom = await createClass(name, subject);
    if (newClassroom) {
      await this.loadClasses(newClassroom.id);
    } else {
      // creation failed
    }
  }

  getTotalCount() {
    const { classrooms, activeClassroom } = this.state;
    let itemsCount = 0;
    if (activeClassroom) {
      itemsCount = activeClassroom.assignments.length;
    } else {
      for (const classroom of classrooms) {
        itemsCount += 1;
        itemsCount += classroom.assignments.length;
      }
    }
    return itemsCount;
  }

  getArchiveClassCount(classroom: TeachClassroom) {
    let count = 0;
    for (const assignment of classroom.assignments) {
      const archived = isArchived(assignment);
      if (archived) {
        count += 1;
      }
    }
    return count;
  }

  getArchiveClassesCount() {
    let count = 0;
    for (const classroom of this.state.classrooms) {
      count += this.getArchiveClassCount(classroom);
    }
    return count;
  }

  getArchivedAssigmentsCount() {
    if (this.state.activeStudent) {
      return '';
    }
    if (this.state.activeClassroom) {
      return this.getArchiveClassCount(this.state.activeClassroom);
    } else {
      return this.getArchiveClassesCount();
    }
  }

  getLiveClassCount(classroom: TeachClassroom) {
    let count = 0;
    for (const assignment of classroom.assignments) {
      const archived = isArchived(assignment);
      if (!archived) {
        count += 1;
      }
    }
    return count;
  }

  getLiveClassesCount() {
    let count = 0;
    for (const classroom of this.state.classrooms) {
      count += this.getLiveClassCount(classroom);
    }
    return count;
  }

  getLiveAssignmentsCount() {
    if (this.state.activeStudent) {
      return '';
    }
    if (this.state.activeClassroom) {
      return this.getLiveClassCount(this.state.activeClassroom);
    } else {
      return this.getLiveClassesCount();
    }
  }

  renderArchiveButton() {
    const className = this.state.isArchive ? "active" : "";
    return (
      <div
        className={className}
        onClick={() => {
          this.props.history.push(map.TeachAssignedArchiveTab);
          this.setState({ isArchive: true });
        }}
      >
        {this.getArchivedAssigmentsCount()} ARCHIVED
      </div>
    );
  }

  renderLiveBricksButton() {
    const className = this.state.isArchive ? "" : "active";
    return (
      <div
        className={className}
        onClick={() => {
          this.props.history.push(map.TeachAssignedTab);
          this.setState({ isArchive: false })
        }}
      >
        {this.getLiveAssignmentsCount()} LIVE BRICKS
      </div>
    );
  }

  renderAssignmentPagination = (classroom: TeachClassroom) => {
    const { assignmentPageSize } = this.state;
    const itemsCount = classroom.students.length;
    return <BackPagePagination
      sortedIndex={this.state.sortedIndex}
      pageSize={this.state.assignmentPageSize}
      bricksLength={itemsCount}
      isRed={this.state.sortedIndex === 0}
      moveNext={() => this.moveNext(assignmentPageSize)}
      moveBack={() => this.moveBack(assignmentPageSize)}
    />
  }

  renderTeachPagination = () => {
    let itemsCount = 0;
    let pageSize = this.state.pageSize;
    const { activeClassroom } = this.state;

    if (this.state.activeStudent) {
      return "";
    } else if (activeClassroom && this.state.activeAssignment) {
      return this.renderAssignmentPagination(activeClassroom);
    } else {
      itemsCount = this.getTotalCount();
    }

    if (activeClassroom) {
      pageSize = this.state.classPageSize;
    }

    return <BackPagePagination
      sortedIndex={this.state.sortedIndex}
      pageSize={pageSize}
      bricksLength={itemsCount}
      isRed={this.state.sortedIndex === 0}
      moveNext={() => this.moveNext(pageSize)}
      moveBack={() => this.moveBack(pageSize)}
    />
  }
  //#endregion

  renderEmptyTabContent() {
    const { activeClassroom } = this.state;
    if (this.state.classrooms.length === 0) {
      return (
        <div className="tab-content">
          <div className={"tab-content-centered " + (activeClassroom ? 'empty-tab-content' : '')}>
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
    return (
      <div className="tab-content">
        <div className={"tab-content-centered " + (activeClassroom ? 'empty-tab-content' : '')}>
          <div>
            {activeClassroom && <div className="bold"> {activeClassroom.name} has no assignments for the moment</div>}
            <div className="icon-container glasses-icon-container" onClick={() => this.props.history.push(map.ViewAllPage)}>
              <SpriteIcon name="glasses-home-blue" className="glasses-icon" />
              <div className="glass-eyes-inside">
                <div className="glass-eyes-left svgOnHover">
                  <svg className="svg active eyeball" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <path fill="#F5F6F7" className="eyeball" d="M2,12c0,0,3.6-7.3,10-7.3S22,12,22,12s-3.6,7.3-10,7.3S2,12,2,12z" />
                  </svg>
                  <div className="glass-left-inside svgOnHover">
                    {/* <SpriteIcon name="aperture" className="aperture" /> */}
                    <SpriteIcon name="eye-pupil" className="eye-pupil" />
                  </div>
                </div>
                <div className="glass-eyes-right svgOnHover">
                  <svg className="svg active eyeball" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <path fill="#F5F6F7" className="eyeball" d="M2,12c0,0,3.6-7.3,10-7.3S22,12,22,12s-3.6,7.3-10,7.3S2,12,2,12z" />
                  </svg>
                  <div className="glass-right-inside svgOnHover">
                    {/* <SpriteIcon name="aperture" className="aperture" /> */}
                    <SpriteIcon name="eye-pupil" className="eye-pupil" />
                  </div>
                </div>
              </div>
            </div>
            <div className="bold">Click the icon above to search for brick to assign</div>
          </div>
        </div>
      </div>
    );
  }

  setReminderNotification(count: number, isDeadlinePassed: boolean) {
    this.setState(state => ({ ...state, remindersData: { isOpen: true, count, isDeadlinePassed } }));
  }

  renderTabContent() {
    if (!this.state.isLoaded) {
      return <div className="tab-content" />
    }

    const { activeClassroom } = this.state;

    if (this.state.isLoaded && (this.state.classrooms.length === 0 || (activeClassroom && activeClassroom?.assignments.length === 0))) {
      return this.renderEmptyTabContent();
    }
    return (
      <div className="tab-content">
        <div className="classroom-list-buttons">
          {this.renderLiveBricksButton()}
          {this.renderArchiveButton()}
        </div>
        { this.state.activeStudent ?
          <ActiveStudentBricks
            subjects={this.state.subjects}
            isArchive={this.state.isArchive}
            classroom={activeClassroom}
            activeStudent={this.state.activeStudent}
            onRemind={this.setReminderNotification.bind(this)}
          />
          : this.state.activeAssignment && this.state.assignmentStats && activeClassroom ?
            <ExpandedAssignment
              classroom={activeClassroom}
              assignment={this.state.activeAssignment}
              stats={this.state.assignmentStats}
              subjects={this.state.subjects}
              startIndex={this.state.sortedIndex}
              pageSize={this.state.assignmentPageSize}
              history={this.props.history}
              minimize={() => this.unselectAssignment()}
              onRemind={this.setReminderNotification.bind(this)}
            />
            : activeClassroom ?
              <ClassroomList
                subjects={this.state.subjects}
                isArchive={this.state.isArchive}
                expand={this.setActiveAssignment.bind(this)}
                startIndex={this.state.sortedIndex}
                activeClassroom={activeClassroom}
                pageSize={this.state.classPageSize}
                reloadClass={this.loadClass.bind(this)}
                onRemind={this.setReminderNotification.bind(this)}
              />
              :
              <ClassroomsList
                subjects={this.state.subjects}
                isArchive={this.state.isArchive}
                expand={this.setActiveAssignment.bind(this)}
                startIndex={this.state.sortedIndex}
                classrooms={this.state.classrooms}
                activeClassroom={activeClassroom}
                pageSize={this.state.pageSize}
                reloadClasses={this.loadClasses.bind(this)}
                onRemind={this.setReminderNotification.bind(this)}
              />
        }
        {this.renderTeachPagination()}
      </div>
    );
  }

  render() {
    const { history } = this.props;
    const {remindersData} = this.state;

    return (
      <div className="main-listing user-list-page manage-classrooms-page">
        <PageHeadWithMenu
          page={PageEnum.ManageClasses}
          placeholder="Search by Name, Email or Subject"
          user={this.props.user}
          history={history}
          search={() => { }}
          searching={v => { }}
        />
        <Grid container direction="row" className="sorted-row back-to-work-teach">
          <TeachFilterSidebar
            classrooms={this.state.classrooms}
            isLoaded={this.state.isLoaded}
            activeStudent={this.state.activeStudent}
            activeClassroom={this.state.activeClassroom}
            isArchive={this.state.isArchive}
            setActiveClassroom={this.setActiveClassroom.bind(this)}
            setActiveStudent={this.setActiveStudent.bind(this)}
            filterChanged={this.teachFilterUpdated.bind(this)}
            createClass={this.createClass.bind(this)}
          />
          <Grid item xs={9} className="brick-row-container">
            <TeachTab activeTab={TeachActiveTab.Assignments} history={history} assignmentsEnabled={true} />
            {this.renderTabContent()}
          </Grid>
        </Grid>
        <ReminderSuccessDialog
          header={`Reminder${remindersData.count > 1 ? 's' : ''} sent!`}
          isOpen={remindersData.isOpen}
          isDeadlinePassed={remindersData.isDeadlinePassed}
          close={() => this.setState(state => ({ ...state, remindersData: { ...remindersData, isOpen: false } }))}
        />
        <CreateClassDialog
          isOpen={this.state.createClassOpen}
          submit={(name, subject) => {
            this.createClass(name, subject);
            this.setState({ createClassOpen: false })
          }}
          close={() => { this.setState({ createClassOpen: false }) }}
        />
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e)),
});

export default connect(mapState, mapDispatch)(TeachPage);
