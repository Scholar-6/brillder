import React, { Component } from "react";
import { History } from "history";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import queryString from 'query-string';

import './TeachPage.scss';
import { ReduxCombinedState } from "redux/reducers";
import actions from 'redux/actions/requestFailed';

import { User } from "model/user";
import { Subject } from "model/brick";
import { ClassroomStatus, TeachClassroom, TeachStudent } from "model/classroom";
import { getAllClassrooms, getAssignmentsClassrooms, searchClassrooms } from "components/teach/service";
import { getDateString } from "components/services/brickService";
import { TeachFilters } from '../model';
import { Assignment } from "model/classroom";
import { getAssignmentStats } from "services/axios/stats";
import { ApiAssignemntStats } from "model/stats";
import { downKeyPressed, upKeyPressed } from "components/services/key";

import BackPagePagination from 'components/backToWorkPage/components/BackPagePagination';
import TeachFilterSidebar, { SortClassroom } from './components/TeachFilterSidebar';
import ClassroomList from './components/ClassroomList';
import ActiveStudentBricks from "./components/ActiveStudentBricks";
import ExpandedAssignment from './components/ExpandedAssignment';
import { getSubjects } from "services/axios/subject";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import map from "components/map";
import ReminderSuccessDialog from "components/baseComponents/dialogs/ReminderSuccessDialog";
import CreateClassDialog from "../manageClassrooms/components/CreateClassDialog";
import EmptyTabContent from "./components/EmptyTabContent";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { getClassAssignedCount } from "./service/service";
import PremiumEducatorDialog from "components/play/baseComponents/dialogs/PremiumEducatorDialog";
import DeleteClassDialog from "../manageClassrooms/components/DeleteClassDialog";
import { deleteClassroom } from "services/axios/classroom";
import EmptyClassTab from "./components/EmptyClassTab";
import AssignBrickClass from "components/baseComponents/dialogs/AssignBrickClass";
import AssignSuccessDialog from "components/baseComponents/dialogs/AssignSuccessDialog";
import AssignFailedDialog from "components/baseComponents/dialogs/AssignFailedDialog";
import { fileUrl } from "components/services/uploadFile";
import HoverButton from "components/baseComponents/hoverHelp/HoverButton";


interface RemindersData {
  isOpen: boolean;
  count: number;
  isDeadlinePassed: boolean;
}

enum ClassroomSearchType {
  Any,
  StudentOnly,
  TeacherOnly,
}

interface TeachProps {
  history: History;
  searchString: string;

  // redux
  user: User;
  requestFailed(e: string): void;
}

interface TeachState {
  isSearching: boolean;
  finalSearchString: string;
  searchString: string;
  searchType: ClassroomSearchType;

  pageSize: number;
  classPageSize: number;
  assignmentPageSize: number;
  sortedIndex: number;
  classrooms: TeachClassroom[];
  activeClassroom: any;
  activeAssignment: Assignment | null;
  activeStudent: TeachStudent | null;
  assignmentStats: ApiAssignemntStats | null;
  totalCount: number;
  subjects: Subject[];

  isLoaded: boolean;
  remindersData: RemindersData;
  createClassOpen: boolean;
  isAssignOpen: boolean;
  selectedClassroom: any;
  successAssignResult: any;
  failAssignResult: any;

  deleteClassOpen: boolean;
  classroomToRemove: TeachClassroom | null;

  isPremiumDialogOpen: boolean;

  teacherId: number;

  filters: TeachFilters;
  handleKey(e: any): void;
}

class TeachPage extends Component<TeachProps, TeachState> {
  constructor(props: TeachProps) {
    super(props);

    let teacherId = -1;

    const values = queryString.parse(this.props.history.location.search);
    if (values.teacherId) {
      teacherId = parseInt(values.teacherId as string);
    }

    this.state = {
      isSearching: false,
      finalSearchString: '',

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
      isPremiumDialogOpen: false,

      teacherId,

      totalCount: 0,
      searchString: '',
      searchType: ClassroomSearchType.Any,
      subjects: [],

      deleteClassOpen: false,
      classroomToRemove: null,
      isAssignOpen: false,
      selectedClassroom: null,

      successAssignResult: {
        isOpen: false, brick: null
      },
      failAssignResult: {
        isOpen: false, brick: null
      },

      pageSize: 6,
      classPageSize: 5,
      assignmentPageSize: 8,
      sortedIndex: 0,
      handleKey: this.handleKey.bind(this),
    };

    this.loadInitData();
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
        if (activeAssignment) {
          await this.setActiveAssignment(classroomId, activeAssignment.id);
        }
      }
    } else if (values.search) {
      this.searching(values.search as string);
      this.search();
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

  async loadClasses(activeClassId?: number) {
    let classrooms = await getAllClassrooms() as TeachClassroom[] | null;


    if (classrooms) {
      if (this.state.teacherId > 0) {
        classrooms = classrooms.filter(c => {
          const found = c.teachers.find(t => t.id === this.state.teacherId);
          if (found) {
            return true;
          }
          return false;
        });
      }

      let { activeClassroom } = this.state;

      if (activeClassId) {
        const classroom = classrooms.find(c => c.id === activeClassId);
        if (classroom) {
          activeClassroom = classroom;
          activeClassroom.active = true;
          activeClassroom.assignments = await getAssignmentsClassrooms(activeClassroom.id);
        }
      }

      classrooms = this.sortAndReturnClassrooms(SortClassroom.Date, classrooms);

      this.setState({ classrooms, activeClassroom, isLoaded: true });
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
        classroom.assignments = await getAssignmentsClassrooms(classroom.id);
        this.setState({ activeClassroom: classroom, activeAssignment: null });
      } else {
        this.setState({ activeClassroom: null, activeAssignment: null });
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

  async deleteClass() {
    const { classroomToRemove } = this.state;
    if (!classroomToRemove) {
      return this.setState({ deleteClassOpen: false, activeClassroom: null, classroomToRemove: null, sortedIndex: 0 });
    }
    let deleted = await deleteClassroom(classroomToRemove.id);
    if (deleted) {
      const { classrooms } = this.state;
      let index = classrooms.indexOf(classroomToRemove);
      classrooms.splice(index, 1);
      this.setState({ classrooms, activeClassroom: null, classroomToRemove: null, deleteClassOpen: false, sortedIndex: 0 });
    }
  }

  onDeleteClass(c: TeachClassroom) {
    this.setState({ deleteClassOpen: true, classroomToRemove: c });
  }

  setActiveStudent(activeStudent: TeachStudent) {
    this.setState({ activeStudent, sortedIndex: 0 });
  }

  async setActiveClassroom(id: number | null) {
    this.collapseClasses();
    const { classrooms } = this.state;
    let classroom = classrooms.find(c => c.id === id);
    if (classroom) {
      classroom.assignments = await getAssignmentsClassrooms(classroom.id);
      classroom.active = true;

      this.setState({
        sortedIndex: 0, classrooms,
        activeClassroom: classroom,
        activeAssignment: null,
        activeStudent: null,
        assignmentStats: null
      });
      this.props.history.push({ search: queryString.stringify({ classroomId: id, teacherId: this.state.teacherId }) });
    } else {
      this.setState({
        sortedIndex: 0,
        activeClassroom: null,
        activeStudent: null,
        activeAssignment: null,
        assignmentStats: null
      });
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
    this.props.history.push({ search: queryString.stringify({ classroomId, assignmentId, teacherId: this.state.teacherId }) });
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
    this.props.history.push({ search: queryString.stringify({ classroomId: this.state.activeClassroom?.id, teacherId: this.state.teacherId }) });
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
        isSearching: false,
        finalSearchString: '',
        activeClassroom: null,
        activeAssignment: null,
        assignmentStats: null,
        activeStudent: null
      });
      this.loadInitData();
    } else {
      const studentMatch = searchString.match(/^student:(.+)/)?.[1]
      const teacherMatch = searchString.match(/^teacher:(.+)/)?.[1]
      if (studentMatch) {
        this.setState({ ...this.state, searchString: studentMatch, searchType: ClassroomSearchType.StudentOnly });
      } else if (teacherMatch) {
        this.setState({ ...this.state, searchString: teacherMatch, searchType: ClassroomSearchType.TeacherOnly });
      } else {
        this.setState({ ...this.state, searchString, searchType: ClassroomSearchType.Any });
      }
    }
  }

  sortClassrooms(sort: SortClassroom) {
    const classrooms = this.state.classrooms.filter(c => c.status == ClassroomStatus.Active);
    const finalClasses = this.sortAndReturnClassrooms(sort, classrooms);
    this.setState({ classrooms: finalClasses });
  }

  sortAndReturnClassrooms(sort: SortClassroom, classrooms: TeachClassroom[]) {
    let finalClasses: any[] = [];
    for (const cls of classrooms) {
      const finalClass = Object.assign({}, cls) as any;
      finalClass.assigned = getClassAssignedCount(cls);
      finalClasses.push(finalClass);
    }
    if (sort === SortClassroom.Date) {
      finalClasses = finalClasses.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());
    } else if (sort === SortClassroom.Assignment) {
      finalClasses = finalClasses.sort((a, b) => b.assignmentsCount - a.assignmentsCount);
    } else if (sort === SortClassroom.Name) {
      finalClasses = finalClasses.sort((a, b) => {
        const al = a.name.toUpperCase();
        const bl = b.name.toUpperCase();
        if (al < bl) { return -1; }
        if (al > bl) { return 1; }
        return 0;
      });
    }
    return finalClasses;
  }

  async search() {
    let classrooms = await searchClassrooms(this.state.searchString, this.state.searchType) as TeachClassroom[] | null;
    if (classrooms) {
      this.setState({ ...this.state, isSearching: true, finalSearchString: this.state.searchString, isLoaded: true, activeClassroom: null, activeAssignment: null, activeStudent: null, classrooms, sortedIndex: 0 });
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
    let pageSize = this.state.pageSize;
    const { activeClassroom } = this.state;

    if (this.state.activeStudent) {
      return "";
    } else if (activeClassroom && this.state.activeAssignment) {
      return this.renderAssignmentPagination(activeClassroom);
    } else if (activeClassroom) {
      pageSize = this.state.classPageSize;

      let itemsCount = 0;
      if (activeClassroom.assignments) {
        itemsCount = parseInt(activeClassroom.assignmentsCount);
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

    return <div />;
  }
  //#endregion

  setReminderNotification(count: number, isDeadlinePassed: boolean) {
    this.setState(state => ({ ...state, remindersData: { isOpen: true, count, isDeadlinePassed } }));
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

    if (this.state.isLoaded && (this.state.classrooms?.length === 0 || (activeClassroom && activeClassroom?.assignments?.length === 0))) {
      return <EmptyClassTab history={this.props.history} activeClassroom={this.state.activeClassroom} />;
    }

    return (
      <Grid item xs={9} className="brick-row-container teach-tab-d94 bg-light-blue no-active-class flex-center">
        <div className="tab-content">
          {this.state.activeStudent ?
            <ActiveStudentBricks
              subjects={this.state.subjects}
              history={this.props.history}
              isArchive={false}
              classroom={activeClassroom}
              activeStudent={this.state.activeStudent}
              onRemind={this.setReminderNotification.bind(this)}
            />
            : this.state.activeAssignment && this.state.assignmentStats && activeClassroom &&
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
          }
          {this.renderTeachPagination()}
        </div>
      </Grid>
    );
  }

  renderClassroom() {
    return (
      <Grid item xs={9} className="brick-row-container teach-tab-d94">
        <ClassroomList
          subjects={this.state.subjects}
          isArchive={false}
          history={this.props.history}
          startIndex={this.state.sortedIndex}
          activeClassroom={this.state.activeClassroom}
          pageSize={this.state.classPageSize}
          toggleArchive={() => { }}
          expand={this.moveToAssignment.bind(this)}
          reloadClass={this.loadClass.bind(this)}
          onRemind={this.setReminderNotification.bind(this)}
          onArchive={() => { }}
          onUnarchive={() => { }}
          onDelete={this.onDeleteClass.bind(this)}
          onAssign={() => this.setState({ isAssignOpen: true })}
        />
        {this.renderTeachPagination()}
      </Grid>
    )
  }

  renderEmptyAssignment() {
    return <div className="empty-assignment">
      <SpriteIcon name="manage-classes-v51" />
    </div>
  }

  renderAssignment(assignment: any, classroomId: number, assignmentsCount: number) {
    return <div className="assignment-v31" onClick={() => {
      this.setActiveClassroom(classroomId);
    }}>
      <div className="absolute-bricks-count">
        <SpriteIcon name="book-checked-circled" />
        <div>{assignmentsCount} Brick{assignmentsCount > 1 ? 's' : ''}</div>
      </div>
      <img src={fileUrl(assignment.brick.coverImage)} />
    </div>
  }

  renderContainer() {
    return (
      <Grid item xs={9} className="brick-row-container teach-tab-d94 bg-light-blue no-active-class flex-center">
        <div>
          <div className="sub-title-v12 bold">{this.state.isSearching ? 'Search: ' + this.state.finalSearchString : 'All My Classes'}</div>
          {this.state.classrooms.map(c => {
            let teacherNames = '';

            let index = 0;

            for (let teacher of c.teachers) {
              let teacherName = (teacher.firstName ? teacher.firstName : '') + ' ' + (teacher.lastName ? teacher.lastName : '');
              teacherNames += teacherName;
              if (index < c.teachers.length - 1) {
                teacherNames += ', ';
              }
              index += 1;
            }

            const assignmentsCount = c.assignments.length;

            let newestAssignment = null;
            for (let assignment of c.assignments) {
              if (newestAssignment === null) {
                newestAssignment = assignment;
              }
            }

            return (
              <div className="classroom-row-v12">
                <div className="assignment-column">
                  {assignmentsCount > 0
                    ? this.renderAssignment(newestAssignment, c.id, assignmentsCount)
                    : this.renderEmptyAssignment()
                  }
                </div>
                <div className="title-column">
                  <div>
                    <div className="bold overflow-ellipsis" dangerouslySetInnerHTML={{ __html: c.name }} />
                    <div>{teacherNames}</div>
                  </div>
                </div>
                <div className="users-column">
                  <div>
                    <div className="flex-left-v2"><SpriteIcon name="users-v2" /> {c.students.length}</div>
                    {c.studentsInvitations.length > 0 &&
                      <div className="flex-left-v2"><SpriteIcon name="sandclock-v2" /> {c.studentsInvitations.length} Pending</div>
                    }
                  </div>
                </div>
                <div className="flex-center before-last-column">
                  <SpriteIcon name="calendar-v2" /> {getDateString(c.created.toString())}
                </div>
                <div className="flex-center last-column">
                  <HoverButton icon="button-r46" className="button-svg first-btn-s57" onClick={() => this.setState({ isAssignOpen: true, selectedClassroom: c })}>
                    <div>Assign Bricks</div>
                  </HoverButton>
                  <HoverButton icon="button-r44" className="button-svg" onClick={() => this.setState({ selectedClassroom: c })}>
                    <div>Share</div>
                  </HoverButton>
                  <HoverButton icon="button-r45" className="button-svg last-btn" onClick={() => this.onDeleteClass(c)}>
                    <div>Delete Class</div>
                  </HoverButton>
                </div>
              </div>
            );
          })}
        </div>
      </Grid>
    );
  }

  renderData() {
    if (!this.state.isLoaded) {
      return (
        <Grid item xs={9} className="brick-row-container teach-tab-d94">
          <div className="tab-content">
            <div className="f-top-loader">
              <SpriteIcon name="f-loader" className="spinning" />
            </div>
          </div>
        </Grid>
      );
    }
    if (this.state.classrooms?.length === 0) {
      return (
        <Grid item xs={9} className="brick-row-container">
          <EmptyTabContent
            history={this.props.history}
            classrooms={this.state.classrooms}
            activeClassroom={this.state.activeClassroom}
            openClass={() => this.setState({ createClassOpen: true })}
          />
        </Grid>
      );
    }

    if (this.state.activeClassroom && !this.state.activeAssignment && !this.state.activeStudent) {
      return this.renderClassroom();
    } else if (this.state.activeClassroom && this.state.activeAssignment) {
      return this.renderTabContent();
    } else {
      return this.renderContainer();
    }
  }

  render() {
    let showedClasses = this.state.classrooms;

    const { history } = this.props;
    const { remindersData } = this.state;

    return (
      <div className="main-listing user-list-page manage-classrooms-page">
        <PageHeadWithMenu
          page={PageEnum.ManageClasses}
          placeholder="Search by Class Name, Brick Title, Subject, or Student"
          user={this.props.user}
          history={history}
          search={this.search.bind(this)}
          searching={this.searching.bind(this)}
        />
        <Grid container direction="row" className="sorted-row back-to-work-teach">
          <TeachFilterSidebar
            user={this.props.user}
            classrooms={showedClasses}
            isLoaded={this.state.isLoaded}
            subjects={this.state.subjects}
            history={this.props.history}
            activeStudent={this.state.activeStudent}
            activeClassroom={this.state.activeClassroom}
            setActiveClassroom={this.setActiveClassroom.bind(this)}
            loadClass={classId => this.loadClass(classId)}
            setActiveStudent={this.setActiveStudent.bind(this)}
            filterChanged={this.teachFilterUpdated.bind(this)}
            sortClassrooms={this.sortClassrooms.bind(this)}
            moveToPremium={() => this.setState({ isPremiumDialogOpen: true })}
          />
          {this.renderData()}
        </Grid>
        <ReminderSuccessDialog
          header={`Reminder${remindersData.count > 1 ? 's' : ''} sent!`}
          isOpen={remindersData.isOpen}
          isDeadlinePassed={remindersData.isDeadlinePassed}
          close={() => this.setState(state => ({ ...state, remindersData: { ...remindersData, isOpen: false } }))}
        />
        {this.state.createClassOpen &&
          <CreateClassDialog
            isOpen={this.state.createClassOpen}
            subjects={this.state.subjects}
            history={this.props.history}
            submit={async (classroomId) => {
              await this.loadClass(classroomId);
              this.setState({ createClassOpen: false });
            }}
            close={() => { this.setState({ createClassOpen: false }) }}
          />}
        {this.state.isAssignOpen &&
          <AssignBrickClass
            isOpen={this.state.isAssignOpen}
            classroom={this.state.selectedClassroom}
            subjects={this.state.subjects}
            subjectId={this.state.selectedClassroom.subjectId || this.state.selectedClassroom.subject?.id}
            success={(brick: any) => {
              this.setState({ successAssignResult: { isOpen: true, brick } });
              this.loadClass(this.state.selectedClassroom.id);
            }}
            showPremium={() => this.setState({ isPremiumDialogOpen: true })}
            failed={brick => this.setState({ failAssignResult: { isOpen: true, brick } })}
            close={() => this.setState({ isAssignOpen: false })}
          />}
        {this.state.successAssignResult.isOpen &&
          <AssignSuccessDialog
            isOpen={this.state.successAssignResult.isOpen}
            brickTitle={this.state.successAssignResult.brick?.title}
            selectedItems={[this.state.selectedClassroom]}
            close={() => this.setState({ successAssignResult: { isOpen: false, brick: null } })}
          />}
        {this.state.failAssignResult.isOpen &&
          <AssignFailedDialog
            isOpen={this.state.failAssignResult.isOpen}
            brickTitle={this.state.failAssignResult.brick?.title}
            selectedItems={[{ classroom: this.state.selectedClassroom }]}
            close={() => this.setState({ failAssignResult: { isOpen: false, brick: null } })}
          />}
        <PremiumEducatorDialog isOpen={this.state.isPremiumDialogOpen} close={() => this.setState({ isPremiumDialogOpen: false })} submit={() => this.props.history.push(map.StripeEducator)} />
        <DeleteClassDialog
          isOpen={this.state.deleteClassOpen}
          submit={() => this.deleteClass()}
          close={() => { this.setState({ deleteClassOpen: false }) }}
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
