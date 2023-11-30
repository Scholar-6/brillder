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
import { ClassroomStatus, TeachClassroom } from "model/classroom";
import { getAdminClassrooms, getAllClassrooms, getAssignmentsClassrooms, getTeacherClassrooms, searchClassrooms } from "components/teach/service";
import { checkAdminOrInstitution, getDateString } from "components/services/brickService";
import map from "components/map";
import { deleteClassroom } from "services/axios/classroom";
import { getClassAssignedCount } from "./service/service";

import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import TeachFilterSidebar, { ClassroomChoice, SortClassroom } from './components/TeachFilterSidebar';
import ClassroomList from './components/ClassroomList';
import EmptyTabContent from "./components/EmptyTabContent";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { fileUrl } from "components/services/uploadFile";
import HoverButton from "components/baseComponents/hoverHelp/HoverButton";

import ReminderSuccessDialog from "components/baseComponents/dialogs/ReminderSuccessDialog";
import CreateClassDialog from "./components/CreateClassDialog";
import PremiumEducatorDialog from "components/play/baseComponents/dialogs/PremiumEducatorDialog";
import DeleteClassDialog from "./components/DeleteClassDialog";
import UpdateClassDialog from "./components/UpdateClassDialog";
import AssignBrickClassDialog from "./components/AssignBrickClassDialog";
import { GetSetSortSidebarAssignment, GetSortSidebarClassroom } from "localStorage/assigningClass";
import subjectActions from "redux/actions/subject";
import searchActions from "redux/actions/search";
import EmptySearchTabContent from "./components/EmptySearchTabContent";

interface RemindersData {
  isOpen: boolean;
  count: number;
}

enum ClassroomSearchType {
  Any,
  StudentOnly,
  TeacherOnly,
}

interface TeachProps {
  history: History;

  // redux
  user: User;
  requestFailed(e: string): void;

  subjects: Subject[];
  getSubjects(): Promise<Subject[]>;

  searchString: string;
  clearSearch(): void;
}

interface TeachState {
  isSearching: boolean;
  finalSearchString: string;
  searchString: string;
  searchType: ClassroomSearchType;

  classrooms: TeachClassroom[];
  searchClassrooms: TeachClassroom[];
  activeClassroom: any;

  isLoaded: boolean;
  remindersData: RemindersData;
  createClassOpen: boolean;
  updateClassId: number;
  isAssignOpen: boolean;
  selectedClassroom: any;

  shareClass: any;

  deleteClassOpen: boolean;
  classroomToRemove: TeachClassroom | null;

  isPremiumDialogOpen: boolean;

  teacherId: number;

  selectedChoice: ClassroomChoice;
  selectedDomain: string;
  isAdminOrInstitution: boolean;
  page: number;
  totalCount: number;

  sort: number;
}

class TeachPage extends Component<TeachProps, TeachState> {
  constructor(props: TeachProps) {
    super(props);

    let teacherId = -1;

    const values = queryString.parse(this.props.history.location.search);
    if (values.teacherId) {
      teacherId = parseInt(values.teacherId as string);
    }

    let isAssignOpen = false;

    if (values.onlyAssignBricks) {
      isAssignOpen = true;
    }

    let isSearching = false;
    if (values.search || props.searchString) {
      isSearching = true;
    }

    let isAdminOrInstitution = checkAdminOrInstitution(this.props.user.roles);

    let sortD = GetSortSidebarClassroom();

    let sort = sortD ? sortD : SortClassroom.Name;

    this.state = {
      isAdminOrInstitution,
      selectedDomain: '',
      selectedChoice: ClassroomChoice.AllClasses,

      isSearching,
      finalSearchString: '',

      sort,

      classrooms: [],
      searchClassrooms: [],
      activeClassroom: null,
      isLoaded: false,

      shareClass: null,

      remindersData: {
        isOpen: false,
        count: 0
      },
      createClassOpen: false,
      updateClassId: -1,
      isPremiumDialogOpen: false,

      teacherId,

      searchString: props.searchString,
      searchType: ClassroomSearchType.Any,

      page: 0,
      totalCount: 0,

      deleteClassOpen: false,
      classroomToRemove: null,
      isAssignOpen,
      selectedClassroom: null,
    };

    this.loadInitData(props.searchString, teacherId);
  }

  async loadInitData(searchString?: string, teacherId?: number) {
    if (this.props.subjects.length === 0) {
      await this.props.getSubjects();
    }

    const values = queryString.parse(this.props.history.location.search);
    let searchStringV2 = values.search || searchString;

    if (values.classroomId) {
      const classroomId = parseInt(values.classroomId as string);
      await this.loadClasses(classroomId);

      let updateClassId = -1;
      if (values.shareOpen) {
        updateClassId = parseInt(values.classroomId as string);
        this.setState({ updateClassId });
      }
    } else if (searchStringV2) {
      this.searching(searchStringV2 as string);
      this.search();
    } else {
      this.loadClasses(-1, teacherId);
    }
  }

  async loadData() {
    await this.props.getSubjects();
    this.loadClasses();
  }

  async loadClasses(activeClassId?: number, teacherId?: number) {
    let totalCount = 0;
    let classrooms = [] as TeachClassroom[] | null;
    if ((this.state.teacherId && this.state.teacherId > 0) || (teacherId && teacherId > 0)) {
      classrooms = await getTeacherClassrooms(this.state.teacherId || teacherId) as TeachClassroom[] | null;
    } else {
      if (this.state.isAdminOrInstitution) {
        let data = await getAdminClassrooms(this.state.selectedChoice, this.state.page, this.state.sort);
        if (data && data.result) {
          classrooms = data.result as any[];
          totalCount = data.count;
        }
      } else {
        let data = await getAllClassrooms();
        if (data && data.result) {
          classrooms = data.result as any[];
        }
      }
    }

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

          const data = await getAssignmentsClassrooms(activeClassroom.id);

          classroom.assignments = data.assignments;
          classroom.students = data.classroom.students;
          classroom.studentsInvitations = data.classroom.studentsInvitations;

          for (let student of classroom.students) {
            student.completedCount = 0;
            for (let assignment of classroom.assignments) {
              if (assignment.byStudent) {
                for (let item of assignment.byStudent) {
                  if (item.studentId == student.id) {
                    student.completedCount += 1;
                  }
                }
              }
            }
          }

          const sort = GetSetSortSidebarAssignment();
          if (sort === SortClassroom.Name) {
            activeClassroom.assignments = activeClassroom.assignments.sort((a: any, b: any) => {
              return a.brick.title > b.brick.title ? 1 : -1;
            });
          } else if (sort === SortClassroom.Date) {
            activeClassroom.assignments = activeClassroom.assignments.sort((a: any, b: any) => {
              return new Date(a.brick.created).getTime() - new Date(b.brick.created).getTime();
            });
          }
        }
      }

      const sort = GetSortSidebarClassroom();

      if (sort) {
        classrooms = this.sortAndReturnClassrooms(sort, classrooms);
      }

      this.setState({ classrooms, activeClassroom, totalCount, isLoaded: true });
      return classrooms;
    } else {
      this.props.requestFailed('can`t get classrooms');
    }
  }

  async loadClassesV2(selectedChoice: ClassroomChoice, page: number, selectedDomain: string, sort: number, searchString?: string) {
    let totalCount = this.state.totalCount;
    let classrooms = [] as TeachClassroom[] | null;

    let searchStringR = '';
    if (searchString) {
      searchStringR = searchString;
    }
    if (this.state.isSearching && this.state.searchString) {
      searchStringR = this.state.searchString;
    }
    const data = await getAdminClassrooms(selectedChoice, page, sort, selectedDomain, searchStringR);

    if (data && data.result) {
      classrooms = data.result as any[];
      totalCount = data.count;
    }

    if (classrooms) {
      this.setState({ classrooms, selectedChoice, page, totalCount, selectedDomain, activeClassroom: null, isLoaded: true });
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

        const data = await getAssignmentsClassrooms(classroom.id);

        classroom.assignments = data.assignments;
        classroom.students = data.classroom.students;
        classroom.studentsInvitations = data.classroom.studentsInvitations;

        for (let student of classroom.students) {
          student.completedCount = 0;
          for (let assignment of classroom.assignments) {
            if (assignment.byStudent) {
              for (let item of assignment.byStudent) {
                if (item.studentId == student.id) {
                  student.completedCount += 1;
                }
              }
            }
          }
        }

        this.setState({ activeClassroom: classroom });
      } else {
        this.setState({ activeClassroom: null });
      }
    }
  }

  async deleteClass() {
    const { classroomToRemove } = this.state;
    if (!classroomToRemove) {
      return this.setState({ deleteClassOpen: false, activeClassroom: null, classroomToRemove: null });
    }
    let deleted = await deleteClassroom(classroomToRemove.id);
    if (deleted) {
      const { classrooms } = this.state;
      let index = classrooms.indexOf(classroomToRemove);
      classrooms.splice(index, 1);
      this.setState({ classrooms, activeClassroom: null, classroomToRemove: null, deleteClassOpen: false });
    }
  }

  onDeleteClass(c: TeachClassroom) {
    this.setState({ deleteClassOpen: true, classroomToRemove: c });
  }

  async setActiveClassroom(id: number | null) {
    this.collapseClasses();
    const { classrooms } = this.state;

    let classroom = classrooms.find(c => c.id === id);
    if (this.state.isSearching) {
      classroom = this.state.searchClassrooms.find(c => c.id === id);
    }
    if (classroom) {
      const data = await getAssignmentsClassrooms(classroom.id);

      classroom.assignments = data.assignments;
      classroom.students = data.classroom.students;
      classroom.studentsInvitations = data.classroom.studentsInvitations;

      for (let student of classroom.students) {
        student.completedCount = 0;
        for (let assignment of classroom.assignments) {
          if (assignment.byStudent) {
            for (let item of assignment.byStudent) {
              if (item.studentId == student.id) {
                student.completedCount += 1;
              }
            }
          }
        }
      }

      classroom.active = true;

      this.setState({
        classrooms,
        activeClassroom: { ...classroom },
      });
      this.props.history.push({ search: queryString.stringify({ classroomId: id, teacherId: this.state.teacherId }) });
    } else {
      this.setState({
        activeClassroom: null,
      });
      this.props.history.push({ search: "" });
    }
  }

  collapseClasses() {
    for (let classroom of this.state.classrooms) {
      classroom.active = false;
    }
    for (let classroom of this.state.searchClassrooms) {
      classroom.active = false;
    }
  }
  //#region pagination

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
        activeClassroom: null
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
    if (this.state.isAdminOrInstitution) {
      this.loadClassesV2(this.state.selectedChoice, 0, this.state.selectedDomain, sort);
    } else {
      const classrooms = this.state.classrooms.filter(c => c.status == ClassroomStatus.Active);
      const finalClasses = this.sortAndReturnClassrooms(sort, classrooms);
      this.setState({ ...this.state, classrooms: finalClasses });
    }
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
    if (this.state.isAdminOrInstitution) {
      this.loadClassesV2(this.state.selectedChoice, 0, this.state.selectedDomain, this.state.sort, this.state.searchString);
    } else {
      let classrooms = await searchClassrooms(this.state.searchString, this.state.searchType) as TeachClassroom[] | null;
      if (classrooms) {
        this.setState({ ...this.state, isSearching: true, finalSearchString: this.state.searchString, isLoaded: true, activeClassroom: null, searchClassrooms: classrooms });
      } else {
        // failed
      }
    }
  }
  //#endregion

  setReminderNotification(count: number) {
    this.setState(state => ({ ...state, remindersData: { isOpen: true, count } }));
  }

  renderClassroom() {
    return (
      <Grid item xs={9} className="brick-row-container teach-tab-d94">
        <ClassroomList
          subjects={this.props.subjects}
          history={this.props.history}
          activeClassroom={this.state.activeClassroom}
          reloadClass={this.loadClass.bind(this)}
          onRemind={this.setReminderNotification.bind(this)}
          assignPopup={(c) => this.setState({ isAssignOpen: true, selectedClassroom: c })}
          inviteStudents={() => this.setState({ updateClassId: this.state.activeClassroom.id })}
          onDelete={this.onDeleteClass.bind(this)}
        />
      </Grid>
    )
  }

  renderAssignment(assignment: any, classroomId: number, assignmentsCount: number) {
    return <div className="assignment-v31" onClick={() => {
      this.setActiveClassroom(classroomId);
    }}>
      <div className="absolute-bricks-count">
        <SpriteIcon name="book-checked-circled" />
        <div className="font-10">{assignmentsCount} Brick{assignmentsCount > 1 ? 's' : ''}</div>
      </div>
      {assignment?.brick?.coverImage ? <img src={fileUrl(assignment.brick.coverImage)} />
        : <div className="empty-assignment">
          <SpriteIcon name="manage-classes-v51" />
        </div>
      }
    </div>
  }

  renderData() {
    if (!this.state.isLoaded) {
      return (
        <Grid item xs={9} className="brick-row-container teach-tab-d94 flex-center">
          <div className="tab-content loader-content">
            <div className="f-top-loader">
              <SpriteIcon name="f-loader" className="spinning" />
            </div>
          </div>
        </Grid>
      );
    }

    let showedClasses = this.state.classrooms;

    if (this.state.isSearching) {
      showedClasses = this.state.searchClassrooms;
    }

    if (showedClasses.length === 0 && this.state.classrooms?.length === 0) {
      return (
        <Grid item xs={9} className="brick-row-container">
          <EmptyTabContent openClass={() => this.setState({ createClassOpen: true })} />
        </Grid>
      );
    }

    if (this.state.isSearching && this.state.searchClassrooms?.length === 0) {
      return (
        <Grid item xs={9} className="brick-row-container">
          <EmptySearchTabContent openClass={() => this.setState({ createClassOpen: true })} />
        </Grid>
      );
    }

    if (this.state.activeClassroom) {
      return this.renderClassroom();
    }
    return (
      <Grid item xs={9} className="brick-row-container teach-tab-d94 bg-light-blue no-active-class flex-center">
        <div>
          <div className="sub-title-v12 font-20 bold">{this.state.isSearching ? 'Search: ' + this.state.finalSearchString : 'All My Classes'}</div>
          {showedClasses.map((c, i) => {
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

            let newestAssignment = null;
            for (let assignment of c.assignments) {
              if (newestAssignment === null) {
                if (assignment.brick.coverImage) {
                  newestAssignment = assignment;
                }
              }
            }

            return (
              <div className="classroom-row-v12" key={i}>
                <div className="assignment-column">
                  {c.assignments.length > 0
                    ? this.renderAssignment(newestAssignment, c.id, c.assignments.length)
                    : <div className="empty-assignment" onClick={() => {
                      this.setActiveClassroom(c.id);
                    }}>
                      <SpriteIcon name="manage-classes-v51" />
                    </div>
                  }
                </div>
                <div className="title-column" onClick={() => {
                  this.setActiveClassroom(c.id);
                }}>
                  <div>
                    <div className="bold overflow-ellipsis font-20" dangerouslySetInnerHTML={{ __html: c.name }} />
                    <div className="font-18">{teacherNames}</div>
                  </div>
                </div>
                <div className="users-column">
                  <div>
                    <div className="flex-left-v2 font-16"><SpriteIcon name="users-v2" /> {c.students.length}</div>
                    {c.studentsInvitations.length > 0 &&
                      <div className="flex-left-v2 font-16"><SpriteIcon name="sandclock-v2" /> {c.studentsInvitations.length} Pending</div>
                    }
                  </div>
                </div>
                <div className="flex-center before-last-column font-16">
                  <SpriteIcon name="calendar-v2" /> {getDateString(c.created.toString())}
                </div>
                <div className="flex-center last-column">
                  <HoverButton icon="button-r46" className="button-svg first-btn-s57" onClick={() => this.setState({ isAssignOpen: true, selectedClassroom: c })}>
                    <div>Assign Bricks</div>
                  </HoverButton>
                  <HoverButton icon="button-r44" className="button-svg" onClick={() => this.setState({ shareClass: c })}>
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

  render() {
    let showedClasses = this.state.classrooms;

    if (this.state.isSearching && this.state.searchClassrooms?.length > 0) {
      showedClasses = this.state.searchClassrooms;
    }

    const { history } = this.props;
    const { remindersData } = this.state;

    return (
      <div className="main-listing user-list-page manage-classrooms-page only-manage-classes-page">
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
            isSearching={this.state.isSearching}
            isLoaded={this.state.isLoaded}
            subjects={this.props.subjects}
            selectedChoice={this.state.selectedChoice}
            history={this.props.history}
            activeClassroom={this.state.activeClassroom}
            setActiveClassroom={this.setActiveClassroom.bind(this)}
            loadClass={classId => this.loadClass(classId)}
            sortClassrooms={this.sortClassrooms.bind(this)}
            moveToPremium={() => this.setState({ isPremiumDialogOpen: true })}
            viewAll={() => {
              if (this.props.searchString.length > 0) {
                this.props.clearSearch();
                this.setState({ searchString: '', isSearching: false, activeClassroom: null });
                this.loadClasses(-1);
              } else {
                this.setActiveClassroom(-1);
              }
            }}
            classGroupSelected={(type, domain) => {
              this.loadClassesV2(type, 0, domain, this.state.sort);
            }}
            page={this.state.page}
            totalCount={this.state.totalCount}
            moveToPage={page => {
              this.loadClassesV2(this.state.selectedChoice, page, this.state.selectedDomain, this.state.sort);
            }}
          />
          {this.renderData()}
        </Grid>
        <ReminderSuccessDialog
          header={`Reminder${remindersData.count > 1 ? 's' : ''} sent!`}
          isOpen={remindersData.isOpen}
          close={() => this.setState(state => ({ ...state, remindersData: { ...remindersData, isOpen: false } }))}
        />
        {this.state.createClassOpen &&
          <CreateClassDialog
            isOpen={this.state.createClassOpen}
            subjects={this.props.subjects}
            history={this.props.history}
            submit={async (classroomId) => {
              await this.loadClass(classroomId);
              this.setState({ createClassOpen: false });
            }}
            close={() => { this.setState({ createClassOpen: false }) }}
          />}
        {this.state.shareClass && <UpdateClassDialog
          isOpen={true}
          classroom={this.state.shareClass}
          history={this.props.history}
          submit={async (classroomId) => {
            await this.loadClass(classroomId);
            this.setState({ shareClass: null });
          }}
          close={() => { this.setState({ shareClass: null }) }}
        />}
        {this.state.updateClassId > 0 &&
          <UpdateClassDialog
            isOpen={this.state.updateClassId > 0}
            classroom={this.state.activeClassroom}
            history={this.props.history}
            submit={async (classroomId) => {
              await this.loadClass(classroomId);
              this.setState({ createClassOpen: false });
            }}
            close={() => { this.setState({ updateClassId: -1 }) }}
          />}
        {this.state.isAssignOpen &&
          <AssignBrickClassDialog
            isOpen={this.state.isAssignOpen}
            classroom={this.state.activeClassroom || this.state.selectedClassroom}
            subjects={this.props.subjects}
            history={this.props.history}
            submit={async (classroomId) => {
              await this.loadClass(classroomId);
              this.setState({ isAssignOpen: false });
            }}
            close={() => this.setState({ isAssignOpen: false })}
          />}
        <PremiumEducatorDialog
          isOpen={this.state.isPremiumDialogOpen}
          close={() => this.setState({ isPremiumDialogOpen: false })}
          submit={() => this.props.history.push(map.StripeEducator)}
        />
        <DeleteClassDialog
          isOpen={this.state.deleteClassOpen}
          submit={() => this.deleteClass()}
          close={() => { this.setState({ deleteClassOpen: false }) }}
        />
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  subjects: state.subjects.subjects,
  searchString: state.search.classesValue
});

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e)),
  getSubjects: () => dispatch(subjectActions.fetchSubjects()),
  clearSearch: () => dispatch(searchActions.clearSearch()),
});

export default connect(mapState, mapDispatch)(TeachPage);
