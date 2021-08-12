import React, { Component } from "react";
import { History } from "history";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import queryString from 'query-string';
// @ts-ignore
import { Steps } from 'intro.js-react';

import './TeachPage.scss';
import { ReduxCombinedState } from "redux/reducers";
import actions from 'redux/actions/requestFailed';

import { User } from "model/user";
import { Subject } from "model/brick";
import { TeachClassroom, TeachStudent } from "model/classroom";
import { createClass, getAllClassrooms, searchClassrooms } from "components/teach/service";
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
import map from "components/map";
import ReminderSuccessDialog from "components/baseComponents/dialogs/ReminderSuccessDialog";
import CreateClassDialog from "../manageClassrooms/components/CreateClassDialog";
import EmptyTabContent from "./components/EmptyTabContent";
import ArchiveToggle from "./components/ArchiveToggle";
import PageLoaderBlue from "components/baseComponents/loaders/pageLoaderBlue";


interface RemindersData {
  isOpen: boolean;
  count: number;
  isDeadlinePassed: boolean;
}

interface TeachProps {
  history: History;
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
  searchString: string;
  isSearching: boolean;
  isLoaded: boolean;
  remindersData: RemindersData;
  createClassOpen: boolean;

  isNewTeacher: boolean;

  haveArchivedBrick: boolean;
  stepsEnabled: boolean;
  steps: any[];

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
      isNewTeacher: false,

      remindersData: {
        isOpen: false,
        count: 0,
        isDeadlinePassed: false
      },
      createClassOpen: false,

      totalCount: 0,
      searchString: '',
      isSearching: false,
      subjects: [],

      haveArchivedBrick: false,
      stepsEnabled: false,
      steps: [{
        element: '.archive-toggle-button',
        intro: `<p>Find your archived assignments here</p>`,
      }, {
        element: '.archive-toggle-button',
        intro: `<p>Find your archived assignments here</p>`,
      }],

      pageSize: 6,
      classPageSize: 5,
      assignmentPageSize: 8,
      sortedIndex: 0,
      handleKey: this.handleKey.bind(this),
    };

    this.loadInitData();
  }

  componentDidUpdate(prevProps: TeachProps, prevState: TeachState) {
    const value = queryString.parse(this.props.history.location.search);
    if (value.assignmentId) {
      const assignmentId = parseInt(value.assignmentId as string, 10);
      if(prevState.activeAssignment?.id !== assignmentId) {
        if(value.classroomId) {
          const classroomId = parseInt(value.classroomId as string, 10);
          this.setActiveAssignment(classroomId, assignmentId);
        } else if (prevState.activeClassroom) {
          this.setActiveAssignment(prevState.activeClassroom.id, assignmentId);
        } else {
          const classroomId = prevState.classrooms.find(classroom => classroom.assignments.findIndex(assignment => assignment.id === assignmentId) >= 0)?.id;
          if(classroomId) {
            this.setActiveAssignment(classroomId, assignmentId);
          }
        }
      }
    } else if(value.classroomId) {
      const classroomId = parseInt(value.classroomId as string, 10);
      if(prevState.activeClassroom?.id !== classroomId) {
        this.loadClass(classroomId);
      } else if (prevState.activeAssignment) {
        this.unselectAssignment();
      }
    } else if(prevState.activeClassroom) {
      this.loadClass(null);
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.state.handleKey, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.state.handleKey, false);
  }

  async loadInitData() {
    const subjects = await getSubjects();
    if (subjects) {
      this.setState({ subjects });
    }

    const values = queryString.parse(this.props.history.location.search);
    if (values.classroomId) {
      const classroomId = parseInt(values.classroomId as string);
      await this.loadClasses(classroomId);
      if (values.newTeacher) {
        const activeAssignment = this.state.activeClassroom?.assignments[0] as any;
        this.setState({ isNewTeacher: true });
        if (activeAssignment) {
          await this.setActiveAssignment(classroomId, activeAssignment.id);
        }
      }
    } else {
      this.loadClasses();
    }
  }

  async loadData() {
    const subjects = await getSubjects();
    if (subjects) {
      this.setState({ subjects });
    }
    this.loadClasses();
  }

  findClassArchive(c: TeachClassroom) {
    return c.assignments.find(a => a.isArchived === true);
  }

  async loadClasses(activeClassId?: number) {
    let classrooms = await getAllClassrooms() as TeachClassroom[] | null;
    if (classrooms) {
      classrooms = classrooms.filter(c => c.subjectId);

      let { activeClassroom } = this.state;

      if (activeClassId) {
        const classroom = classrooms.find(c => c.id === activeClassId);
        if (classroom) {
          activeClassroom = classroom;
          activeClassroom.active = true;
        }
      }

      const haveArchivedBrick = !!classrooms.find(this.findClassArchive);

      // if reloading
      let stepsEnabled = false;
      if (this.state.isLoaded === true) {
        if (haveArchivedBrick === true && haveArchivedBrick !== this.state.haveArchivedBrick) {
          stepsEnabled = true;
        }
      }

      this.setState({ classrooms, haveArchivedBrick, stepsEnabled, activeClassroom, isLoaded: true });
      return classrooms;
    } else {
      this.props.requestFailed('can`t get classrooms');
    }
  }

  async loadClass(id: number | null) {
    let classrooms = await this.loadClasses();
    if (classrooms) {
      const classroom = classrooms.find(c => c.id === id);
      if (classroom) {
        classroom.active = true;
        this.setState({ activeClassroom: classroom, activeAssignment: null });
      } else {
        this.setState({ activeClassroom: null, activeAssignment: null });
      }
    }
  }

  onIntroExit() {
    this.setState({ stepsEnabled: false });
  }

  onIntroChanged(e: any) {
    if (e !== 0) {
      this.setState({ stepsEnabled: false });
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
      this.props.history.push({ search: queryString.stringify({ classroomId: id }) });
    } else {
      this.setState({ sortedIndex: 0, activeClassroom: null, activeStudent: null, activeAssignment: null, assignmentStats: null });
      this.props.history.push({ search: "" });
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

  moveToAssignment(classroomId: number, assignmentId: number) {
    this.setActiveAssignment(classroomId, assignmentId);
    this.props.history.push({ search: queryString.stringify({ classroomId, assignmentId }) });
  }

  collapseClasses() {
    for (let classroom of this.state.classrooms) {
      classroom.active = false;
    }
  }

  unselectAssignment() {
    this.setState({ sortedIndex: 0, activeAssignment: null, assignmentStats: null });
  }

  moveToNoAssignment() {
    this.unselectAssignment();
    this.props.history.push({ search: queryString.stringify({ classroomId: this.state.activeClassroom?.id }) });
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
      this.props.history.push(map.ManageClassroomsTab + `?classroomId=` + newClassroom.id);
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

  searching(searchString: string) {
    if (searchString.length === 0) {
      this.setState({
        ...this.state, searchString,
        isSearching: true,
        activeClassroom: null,
        activeAssignment: null,
        assignmentStats: null,
        activeStudent: null
      });
    } else {
      this.setState({ ...this.state, searchString });
    }
  }

  async search() {
    const classrooms = await searchClassrooms(this.state.searchString) as TeachClassroom[] | null;
    if (classrooms) {
      this.setState({ ...this.state, classrooms });
    } else {
      // failed
    }
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

  setReminderNotification(count: number, isDeadlinePassed: boolean) {
    this.setState(state => ({ ...state, remindersData: { isOpen: true, count, isDeadlinePassed } }));
  }

  renderTabContent(showedClasses: TeachClassroom[]) {
    let { isArchive } = this.state;

    if (!this.state.isLoaded) {
      return (
        <div className="tab-content">
          <div className="f-top-loader">
            <PageLoaderBlue content="" />
          </div>
        </div>
      );
    }

    const { activeClassroom } = this.state;

    if (this.state.isLoaded && (this.state.classrooms.length === 0 || (activeClassroom && activeClassroom?.assignments.length === 0))) {
      return (
        <EmptyTabContent
          history={this.props.history}
          classrooms={this.state.classrooms}
          activeClassroom={this.state.activeClassroom}
          openClass={() => this.setState({ createClassOpen: true })}
        />
      );
    }

    return (
      <div className="tab-content">
        <ArchiveToggle
          isArchive={isArchive}
          history={this.props.history}
          activeStudent={this.state.activeStudent}
          classrooms={this.state.classrooms}
          activeClassroom={this.state.activeClassroom}
          setArchive={v => this.setState({ isArchive: v })}
        />
        {this.state.activeStudent ?
          <ActiveStudentBricks
            subjects={this.state.subjects}
            history={this.props.history}
            isArchive={isArchive}
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
              minimize={() => this.moveToNoAssignment()}
              onRemind={this.setReminderNotification.bind(this)}
            />
            : activeClassroom ?
              <ClassroomList
                subjects={this.state.subjects}
                isArchive={isArchive}
                expand={this.moveToAssignment.bind(this)}
                startIndex={this.state.sortedIndex}
                activeClassroom={activeClassroom}
                pageSize={this.state.classPageSize}
                reloadClass={this.loadClass.bind(this)}
                onRemind={this.setReminderNotification.bind(this)}
              />
              :
              <ClassroomsList
                subjects={this.state.subjects}
                isArchive={isArchive}
                expand={this.moveToAssignment.bind(this)}
                startIndex={this.state.sortedIndex}
                classrooms={showedClasses}
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
    const { isArchive } = this.state;
    let showedClasses = this.state.classrooms;
    if (isArchive) {
      showedClasses = this.state.classrooms.filter(this.findClassArchive);
    }

    const { history } = this.props;
    const { remindersData } = this.state;

    return (
      <div className="main-listing user-list-page manage-classrooms-page">
        <PageHeadWithMenu
          page={PageEnum.ManageClasses}
          placeholder="Brick Title, Student Name, or Subject"
          user={this.props.user}
          history={history}
          search={this.search.bind(this)}
          searching={this.searching.bind(this)}
        />
        <Grid container direction="row" className="sorted-row back-to-work-teach">
          <TeachFilterSidebar
            isNewTeacher={this.state.isNewTeacher}
            classrooms={showedClasses}
            isLoaded={this.state.isLoaded}
            activeStudent={this.state.activeStudent}
            activeClassroom={this.state.activeClassroom}
            hideIntro={() => this.setState({ isNewTeacher: false })}
            isArchive={isArchive}
            setActiveClassroom={this.setActiveClassroom.bind(this)}
            setActiveStudent={this.setActiveStudent.bind(this)}
            filterChanged={this.teachFilterUpdated.bind(this)}
            createClass={this.createClass.bind(this)}
          />
          <Grid item xs={9} className="brick-row-container">
            <TeachTab activeTab={TeachActiveTab.Assignments} history={history} assignmentsEnabled={true} />
            {this.renderTabContent(showedClasses)}
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
        <Steps
          enabled={this.state.stepsEnabled}
          steps={this.state.steps}
          initialStep={0}
          onChange={this.onIntroChanged.bind(this)}
          onExit={this.onIntroExit.bind(this)}
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
