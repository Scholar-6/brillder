import React, { Component } from "react";
import { connect } from "react-redux";
import { Swiper, SwiperSlide } from 'swiper/react';

import { ReduxCombinedState } from "redux/reducers";
import { AssignmentBrick, AssignmentBrickStatus } from "model/assignment";
import actions from 'redux/actions/requestFailed';
import { getAssignedBricks } from "services/axios/brick";
import { checkAdmin, checkTeacher } from "components/services/brickService";
import { User } from "model/user";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import PhoneTopBrick16x9 from "components/baseComponents/PhoneTopBrick16x9";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import PhoneExpandedBrick from "components/viewAllPage/components/PhoneExpandedBrick";
import MobileHelp from "components/baseComponents/hoverHelp/MobileHelp";
import LevelHelpContent from "components/baseComponents/hoverHelp/LevelHelpContent";
import { AcademicLevel, AcademicLevelLabels, Subject } from "model/brick";
import { isLevelVisible, toggleElement } from "components/viewAllPage/service/viewAll";
import { getSubjects } from "services/axios/subject";
import map from "components/map";
import ClassInvitationDialog from "components/baseComponents/classInvitationDialog/ClassInvitationDialog";

enum Tab {
  Assignemnts,
  Completed,
}

interface ClassroomView {
  id: number;
  name: string;
  assignments: AssignmentBrick[];
}

interface PlayProps {
  history: any;
  match: any;

  // redux
  user: User;
  requestFailed(value: string): void;
}

interface PlayState {
  activeTab: any;
  tab1Count: number;
  tab2Count: number;
  expandedClassroom: ClassroomView | null;
  expandedAssignment: AssignmentBrick | null;
  finalAssignments: AssignmentBrick[];
  rawAssignments: AssignmentBrick[];
  classrooms: ClassroomView[];
  filterLevels: AcademicLevel[];
  subjects: Subject[];
  isAdmin: boolean;
  isTeach: boolean;
  isLoaded: boolean;
}

class AssignmentMobilePage extends Component<PlayProps, PlayState> {
  constructor(props: PlayProps) {
    super(props);

    const isTeach = checkTeacher(this.props.user);
    const isAdmin = checkAdmin(this.props.user.roles);

    this.state = {
      tab1Count: 0,
      tab2Count: 0,
      activeTab: Tab.Assignemnts,
      expandedAssignment: null,
      expandedClassroom: null,
      finalAssignments: [],
      rawAssignments: [],
      classrooms: [],
      subjects: [],
      filterLevels: [],
      isLoaded: false,
      isAdmin, isTeach,
    }

    this.getAssignments();
  }

  getClassrooms(assignments: AssignmentBrick[]) {
    let classrooms: ClassroomView[] = [];
    for (let assignment of assignments) {
      if (assignment.classroom) {
        const found = classrooms.find(c => c.id === assignment.classroom.id);
        if (!found) {
          classrooms.push(assignment.classroom);
        }
      }
    }
    for (let classroom of classrooms) {
      classroom.assignments = [];
      for (let assignment of assignments) {
        if (assignment.classroom?.id === classroom.id) {
          classroom.assignments.push(assignment);
        }
      }
    }
    return classrooms;
  }

  countTab1(assignments: AssignmentBrick[]) {
    let count = 0;
    for (let assignment of assignments) {
      if (assignment.status === AssignmentBrickStatus.ToBeCompleted) {
        count += 1;
      }
    }
    return count;
  }

  countTab2(assignments: AssignmentBrick[]) {
    let count = 0;
    for (let assignment of assignments) {
      if (assignment.status !== AssignmentBrickStatus.ToBeCompleted) {
        count += 1;
      }
    }
    return count;
  }

  async getAssignments() {
    const assignments = await getAssignedBricks();
    const subjects = await getSubjects();
    if (assignments && subjects) {
      let classrooms = this.getClassrooms(assignments);
      this.filter([], Tab.Assignemnts, assignments, classrooms);
      classrooms = this.sortClassrooms(classrooms);
      this.setState({ ...this.state, subjects, tab1Count: this.countTab1(assignments), tab2Count: this.countTab2(assignments), isLoaded: true, rawAssignments: assignments, finalAssignments: assignments, classrooms });
    } else {
      this.props.requestFailed('Can`t get bricks for current user');
      this.setState({ isLoaded: true })
    }
  }

  sortClassrooms(classrooms: ClassroomView[]) {
    return classrooms.sort(c1 => c1.assignments.find(a => a.deadline) ? -1 : 1);
  }

  sortAssignments(assignments: AssignmentBrick[]) {
    return assignments.sort((a, b) => {
      if (a.deadline) {
        if (a.deadline && b.deadline) {
          if (new Date(a.deadline).getTime() < new Date(b.deadline).getTime()) {
            return -1;
          } else {
            return 0;
          }
        }
        return -1;
      }
      return 1;
    });
  }

  expandClass(c: any) {
    c.assignments = this.sortAssignments(c.assignments);
    this.setState({ expandedClassroom: c })
  }

  hideClass() {
    this.setState({ expandedClassroom: null });
  }

  setCompletedTab() {
    if (this.state.activeTab !== Tab.Completed) {
      this.setState({ activeTab: Tab.Completed });
    }
  }

  setAssignmentsTab() {
    if (this.state.activeTab !== Tab.Assignemnts) {
      this.setState({ activeTab: Tab.Assignemnts });
    }
  }

  clearAssignments(classrooms: ClassroomView[]) {
    for (let classroom of classrooms) {
      classroom.assignments = [];
    }
  }

  addBrickByClass(classrooms: ClassroomView[], assignment: AssignmentBrick) {
    const classrrom = classrooms.find(c => c.id === assignment.classroom?.id);
    if (classrrom) {
      classrrom.assignments.push(assignment);
    }
  }

  isStatusVisible(a: AssignmentBrick, tab: Tab) {
    if (tab === Tab.Assignemnts) {
      return a.status === AssignmentBrickStatus.ToBeCompleted;
    } else {
      return a.status !== AssignmentBrickStatus.ToBeCompleted;
    }
  }

  filter(levels: AcademicLevel[], activeTab: Tab, assignments: AssignmentBrick[], classrooms: ClassroomView[]) {
    this.clearAssignments(classrooms);
    for (let assignment of assignments) {
      if (isLevelVisible(assignment.brick, levels)) {
        if (this.isStatusVisible(assignment, activeTab)) {
          this.addBrickByClass(classrooms, assignment);
        }
      }
    }
    for (let c of classrooms) {
      c.assignments = this.sortAssignments(c.assignments);
    }
  }

  filterByLevel(level: AcademicLevel) {
    const { filterLevels } = this.state;
    const levels = toggleElement(filterLevels, level);
    this.filter(levels, this.state.activeTab, this.state.rawAssignments, this.state.classrooms);
    const classrooms = this.sortClassrooms(this.state.classrooms);
    this.setState({ filterLevels: levels, classrooms });
  }

  getColor(a: AssignmentBrick) {
    return this.state.subjects.find(s => s.id === a.brick.subjectId)?.color;
  }

  onIconClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>, a: AssignmentBrick) {
    if (this.state.activeTab === Tab.Completed) {
      e.stopPropagation();
      this.props.history.push(map.postPlay(a.brick.id, this.props.user.id));
    }
  }

  getIcon() {
    let circleIcon = '';
    if (this.state.activeTab === Tab.Completed) {
      circleIcon = 'book-open';
    }
    return circleIcon;
  }

  renderTab(label: string, icon: string, tab: Tab, className: string) {
    const onClick = () => {
      if (this.state.activeTab !== tab) {
        this.clearAssignments(this.state.classrooms);
        this.filter(this.state.filterLevels, tab, this.state.rawAssignments, this.state.classrooms);
        const classrooms = this.sortClassrooms(this.state.classrooms);
        this.setState({ activeTab: tab, expandedClassroom: null, expandedAssignment: null, classrooms });
      }
    }
    return (
      <div
        className={`${className} ${this.state.activeTab === tab ? "active" : ""}`}
        onClick={onClick}
      >
        {label}
        <SpriteIcon name={icon} />
      </div>
    );
  }

  renderMobileBricks() {
    const assignments = this.state.finalAssignments.sort((a, b) => new Date(a.brick.updated).getTime() - new Date(b.brick.updated).getTime());

    return (
      <Swiper slidesPerView={1}>
        {assignments.map((a, i) => {
          const color = this.getColor(a);
          return (
            <SwiperSlide key={i} onClick={() => { }}>
              {i === 0 && <div className="week-brick">Latest assignment</div>}
              <PhoneTopBrick16x9
                circleIcon='file-plus'
                brick={a.brick}
                deadline={a.deadline}
                bestScore={a.bestScore}
                isAssignment={true}
                color={color}
              />
            </SwiperSlide>
          );
        }
        )}
      </Swiper>
    );
  }

  renderAssignments(assignments: any[]) {
    return (
      assignments.map((a, i) => {
        const color = this.getColor(a);
        const circleIcon = this.getIcon();
        return (
          <PhoneTopBrick16x9
            circleIcon={circleIcon}
            key={i}
            brick={a.brick}
            color={color}
            isAssignment={true}
            deadline={a.deadline}
            bestScore={a.bestScore}
            onIconClick={e => this.onIconClick(e, a)}
            onClick={() => {
              if (this.state.expandedAssignment === a) {
                this.setState({ expandedAssignment: null });
              } else {
                this.setState({ expandedAssignment: a });
              }
            }}
          />
        );
      }
      )
    );
  }

  renderHorizontalAssignments(assignments: AssignmentBrick[]) {
    return (
      <div className="bricks-scroll-row">
        <div className="bricks-flex-row" style={{ width: assignments.length * 60 + 2 + "vw" }}>
          {this.renderAssignments(assignments)}
        </div>
      </div>
    )
  }

  renderEmptyClass() {
    return (
      <div className="subject-no-bricks">
        <div>
          <p>Sorry, no bricks found.</p>
          <p>Try adjusting the filters or</p>
          <p>selecting another subject.</p>
        </div>
      </div>
    );
  }

  renderExpandClassAssignments(assignments: AssignmentBrick[]) {
    return (
      <div className="ba-content full">
        {assignments.map((a, i) => {
          const color = this.getColor(a);
          const circleIcon = this.getIcon();
          return (
            <PhoneTopBrick16x9
              circleIcon={circleIcon}
              brick={a.brick}
              color={color}
              deadline={a.deadline}
              isAssignment={true}
              bestScore={a.bestScore}
              onIconClick={e => this.onIconClick(e, a)}
              onClick={() => {
                if (this.state.expandedAssignment === a) {
                  this.setState({ expandedAssignment: null });
                } else {
                  this.setState({ expandedAssignment: a });
                }
              }}
            />
          );
        }
        )}
      </div>
    )
  }

  renderExpandedClass(classroom: ClassroomView) {
    return (
      <div>
        <div className="gg-subject-name">
          {classroom.name} {classroom.assignments.length > 0 && <div className="va-class-count">{classroom.assignments.length}</div>}
          {classroom.assignments.length > 0 && (
            <div
              className="va-expand va-hide"
              onClick={this.hideClass.bind(this)}
            >
              <SpriteIcon name="arrow-up" />
            </div>
          )}
        </div>
        {this.renderExpandClassAssignments(classroom.assignments)}
      </div>
    )
  }

  renderClassroom(classroom: ClassroomView, i: number) {
    const { assignments } = classroom;
    return (
      <div key={i}>
        <div className="gg-subject-name">
          {classroom.name} {assignments.length > 0 && <div className="va-class-count">{assignments.length}</div>}
          {assignments.length > 0 && (
            <div
              className="va-expand"
              onClick={() => this.expandClass(classroom)}
            >
              <SpriteIcon name="arrow-down" />
            </div>
          )}
        </div>
        {assignments.length > 0
          ? this.renderHorizontalAssignments(assignments)
          : this.renderEmptyClass()}
      </div>
    );
  }

  renderAcademicLevel(level: AcademicLevel) {
    const isActive = !!this.state.filterLevels.find((l) => l === level);
    return (
      <div
        className={`va-round-level ${isActive ? "active" : ""}`}
        onClick={() => this.filterByLevel(level)}
      >
        {AcademicLevelLabels[level]}
      </div>
    );
  }

  render() {
    const { expandedAssignment, expandedClassroom } = this.state;
    const classrooms = this.state.classrooms;
    return (
      <div className="main-listing dashboard-page mobile-category learn-mobile-tab student-mobile-assignments-page">
        <PageHeadWithMenu
          page={PageEnum.ViewAll}
          user={this.props.user}
          history={this.props.history}
        />
        <div className="mobile-scroll-bricks phone-top-bricks16x9">
          {this.renderMobileBricks()}
        </div>
        <div className="ss-tabs-container">
          {this.renderTab(this.state.tab1Count + ' Assignments', 'f-activity', Tab.Assignemnts, 'ss-tab-1')}
          {this.renderTab(this.state.tab2Count + ' Completed', 'f-check-clircle', Tab.Completed, 'ss-tab-2')}
        </div>
        <div className="va-level-container">
          {this.renderAcademicLevel(AcademicLevel.First)}
          {this.renderAcademicLevel(AcademicLevel.Second)}
          {this.renderAcademicLevel(AcademicLevel.Third)}
          {this.renderAcademicLevel(AcademicLevel.Fourth)}
          <div className="va-difficult-help">
            <MobileHelp>
              <LevelHelpContent />
            </MobileHelp>
          </div>
        </div>
        <div className={`va-bricks-container ${this.state.activeTab === Tab.Completed ? 'completed' : ''}`}>
          {expandedClassroom
            ? this.renderExpandedClass(expandedClassroom)
            : classrooms.map(this.renderClassroom.bind(this))
          }
        </div>
        {expandedAssignment && expandedAssignment.brick && (
          <PhoneExpandedBrick
            brick={expandedAssignment.brick}
            history={this.props.history}
            hide={() => this.setState({ expandedAssignment: null })}
          />
        )}
        <ClassInvitationDialog onFinish={() => this.getAssignments()} />
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e))
});

export default connect(mapState, mapDispatch)(AssignmentMobilePage);
