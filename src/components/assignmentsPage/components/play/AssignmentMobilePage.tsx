import React, { Component } from "react";
import { connect } from "react-redux";
import { Swiper, SwiperSlide } from 'swiper/react';

import { ReduxCombinedState } from "redux/reducers";
import { AssignmentBrick } from "model/assignment";
import actions from 'redux/actions/requestFailed';
import { getAssignedBricks } from "services/axios/brick";
import { checkAdmin, checkTeacher } from "components/services/brickService";
import { User } from "model/user";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import PhoneTopBrick16x9 from "components/baseComponents/PhoneTopBrick16x9";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import PhoneExpandedBrick from "components/viewAllPage/components/PhoneExpandedBrick";
import { getSubjects } from "services/axios/subject";
import map from "components/map";
import ClassInvitationDialog from "components/baseComponents/classInvitationDialog/ClassInvitationDialog";
import ClassTInvitationDialog from "components/baseComponents/classInvitationDialog/ClassTInvitationDialog";
import PersonalBrickInvitationDialog from "components/baseComponents/classInvitationDialog/PersonalBrickInvitationDialog";
import { Subject } from "model/brick";


interface ClassroomView {
  id: number;
  name: string;
  teacher?: User;
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
  searchExpanded: boolean;
  subjects: Subject[];
  expandedClassroom: ClassroomView | null;
  expandedAssignment: AssignmentBrick | null;
  finalAssignments: AssignmentBrick[];
  rawAssignments: AssignmentBrick[];
  classrooms: ClassroomView[];
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
      subjects: [],
      searchExpanded: false,
      expandedAssignment: null,
      expandedClassroom: null,
      finalAssignments: [],
      rawAssignments: [],
      classrooms: [],
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
          classroom.teacher = assignment.teacher;
          classroom.assignments.push(assignment);
        }
      }
    }
    return classrooms.filter(c => c.assignments.length > 0);
  }

  async getAssignments() {
    const assignments = await getAssignedBricks();
    const subjects = await getSubjects();
    if (assignments && subjects) {
      let classrooms = this.getClassrooms(assignments);
      classrooms = this.sortClassrooms(classrooms);
      this.setState({ ...this.state, subjects, isLoaded: true, rawAssignments: assignments, finalAssignments: assignments, classrooms });
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
    this.setState({ expandedClassroom: c });
    this.props.history.push(map.AssignmentsPage + '/' + c.id);
  }

  hideClass() {
    this.setState({ expandedClassroom: null });
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

  getColor(a: AssignmentBrick) {
    return this.state.subjects.find(s => s.id === a.brick.subjectId)?.color;
  }

  onIconClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>, a: AssignmentBrick) {
    e.stopPropagation();
    this.props.history.push(map.postPlay(a.brick.id, this.props.user.id));
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
        return (
          <PhoneTopBrick16x9
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

  renderExpandClassAssignments(assignments: AssignmentBrick[]) {
    return (
      <div className="ba-content full">
        {assignments.map((a, i) => {
          const color = this.getColor(a);
          return (
            <PhoneTopBrick16x9
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
    const { assignments, teacher } = classroom;
    return (
      <div>
        <div className="gg-subject-name">
          <div className="gg-class-name">
            <span className="bold">{classroom.name}</span> {teacher && <span>by <span className="bold">{teacher.firstName} {teacher.lastName}</span></span>}
          </div>
          {assignments.length > 0 && (
            <div className="va-expand" onClick={() => this.expandClass(classroom)}>
              <div className="va-class-count flex-center">{assignments.length}</div>
              View All
            </div>
          )}
        </div>
        {this.renderExpandClassAssignments(classroom.assignments)}
      </div>
    )
  }

  renderClassroom(classroom: ClassroomView, i: number) {
    const { assignments, teacher } = classroom;
    return (
      <div key={i}>
        <div className="gg-subject-name">
          <div className="gg-class-name">
            <span className="bold">{classroom.name}</span> {teacher && <span>by <span className="bold">{teacher.firstName} {teacher.lastName}</span></span>}
          </div>
          {assignments.length > 0 && (
            <div
              className="va-expand"
              onClick={() => this.expandClass(classroom)}
            >
              <div className="va-class-count flex-center">{assignments.length}</div>
              View All
            </div>
          )}
        </div>
        {assignments.length > 0 && this.renderHorizontalAssignments(assignments)}
      </div>
    );
  }

  moveBack() {
    if (this.state.expandedClassroom) {
      this.setState({expandedClassroom: null});
      this.props.history.push(map.AssignmentsPage);
    } else {
      this.props.history.push(map.MainPage);
    }
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
        <div className="assignment-phone-container">
          <div className="assigments-top-menu">
            <div className="flex-center" onClick={() => this.moveBack()}>
              <SpriteIcon name="arrow-left-stroke" className="arrow-left-v6" />
            </div>
            <div className="flex-center">
              Assignments
            </div>

            {/*
            <div className="filter-btn-container">
              <div className="filter-btn">
                <div onClick={() => this.setState({ searchExpanded: true })}>
                  <div>
                    Filters
                  </div>
                  <SpriteIcon name="arrow-down" />
                </div>
              </div>
            </div>*/}
          </div>
          <div className="va-bricks-container">
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
        </div>
        <ClassInvitationDialog onFinish={() => this.getAssignments()} />
        <PersonalBrickInvitationDialog />
        <ClassTInvitationDialog />
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e))
});

export default connect(mapState, mapDispatch)(AssignmentMobilePage);
