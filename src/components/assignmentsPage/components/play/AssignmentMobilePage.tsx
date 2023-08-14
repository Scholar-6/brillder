import React, { Component } from "react";
import { connect } from "react-redux";

import { ReduxCombinedState } from "redux/reducers";
import { AssignmentBrick } from "model/assignment";
import actions from 'redux/actions/requestFailed';
import { getAssignedBricks } from "services/axios/brick";
import { checkAdmin, checkTeacher } from "components/services/brickService";
import { User } from "model/user";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import PhoneTopBrick16x9 from "components/baseComponents/PhoneTopBrick16x9";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { getSubjects } from "services/axios/subject";
import map from "components/map";
import ClassInvitationDialog from "components/baseComponents/classInvitationDialog/ClassInvitationDialog";
import ClassTInvitationDialog from "components/baseComponents/classInvitationDialog/ClassTInvitationDialog";
import PersonalBrickInvitationDialog from "components/baseComponents/classInvitationDialog/PersonalBrickInvitationDialog";
import { Brick, Subject } from "model/brick";
import { FormControlLabel, Radio } from "@material-ui/core";
import routes from "components/play/routes";


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
  assignments: AssignmentBrick[];
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
      expandedClassroom: null,
      assignments: [],
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
      classroom.assignments.sort((a, b) => {
        if (a.bestScore && a.bestScore > 0) {
          return 1;
        }
        return -1;
      });
    }
    // sort 
    return classrooms.filter(c => c.assignments.length > 0);
  }

  async getAssignments() {
    const assignments = await getAssignedBricks();
    const subjects = await getSubjects();
    if (assignments && subjects) {
      let classrooms = this.getClassrooms(assignments);
      classrooms = this.sortClassrooms(classrooms);
      this.setState({ ...this.state, subjects, isLoaded: true, assignments, classrooms });
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
    this.setState({ expandedClassroom: c, searchExpanded: false });
    this.props.history.push(map.AssignmentsPage + '/' + c.id);
  }

  hideClass() {
    this.setState({ expandedClassroom: null, searchExpanded: false });
    this.props.history.push(map.AssignmentsPage);
  }

  getColor(a: AssignmentBrick) {
    return this.state.subjects.find(s => s.id === a.brick.subjectId)?.color;
  }

  onIconClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>, a: AssignmentBrick) {
    e.stopPropagation();
    this.props.history.push(map.postPlay(a.brick.id, this.props.user.id));
  }

  checkAssignment(brick: Brick) {
    if (brick.assignments && this.props.user) {
      for (let assignmen of brick.assignments) {
        let assignment = assignmen as any;
        if (assignment && assignment.stats) {
          for (let student of assignment?.stats?.byStudent) {
            if (student.studentId === this.props.user.id) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  renderGroupSearch() {
    if (this.state.searchExpanded) {
      return (
        <div>
          <div className="search-background" onClick={() => this.setState({
            searchExpanded: false
          })}></div>
          <div className="assignments-search-dropdown">
            <div className="relative drop-container">
              <FormControlLabel
                checked={this.state.expandedClassroom ? false : true}
                control={<Radio onClick={() => this.hideClass()} className="filter-radio custom-color" />}
                label="All Classes" />
              <div className="c-count-v5">{this.state.assignments.length}</div>
            </div>
            {this.state.classrooms.map(c =>
              <div className="relative drop-container" onClick={() => this.expandClass(c)}>
                <FormControlLabel
                  checked={this.state.expandedClassroom ? this.state.expandedClassroom.id === c.id : false}
                  control={<Radio onClick={() => { }} className="filter-radio custom-color" />}
                  label={c.name} />
                <div className="c-count-v5">{c.assignments.length}</div>
              </div>
            )}
          </div>
        </div>
      );
    }
  }

  renderAssignment(a: AssignmentBrick, i: number) {
    const { brick } = a;
    const color = this.getColor(a);
    return (
      <PhoneTopBrick16x9
        brick={brick}
        color={color}
        key={i}
        deadline={a.deadline}
        isAssignment={true}
        bestScore={a.bestScore}
        onIconClick={e => this.onIconClick(e, a)}
        onClick={() => {
          if (a.bestScore && a.bestScore > 0) {
            const { user } = this.props;
            this.props.history.push(map.postAssignment(brick.id, user.id));
          } else {
            this.props.history.push(routes.playBrief(brick));
          }
        }}
      />
    );
  }

  renderHorizontalAssignments(assignments: AssignmentBrick[]) {
    return (
      <div className="bricks-scroll-row">
        <div className="bricks-flex-row" style={{ width: assignments.length * 60 + 2 + "vw" }}>
          {assignments.map(this.renderAssignment.bind(this))}
        </div>
      </div>
    )
  }

  renderExpandClassAssignments(assignments: AssignmentBrick[]) {
    return (
      <div className="ba-content full">
        {assignments.map(this.renderAssignment.bind(this))}
      </div>
    )
  }

  renderExpandedClass(classroom: ClassroomView) {
    const { assignments, teacher } = classroom;
    const completed = assignments.filter(a => a.bestScore && a.bestScore > 0).length;

    let done = false;
    if (completed == assignments.length) {
      done = true;
    }

    return (
      <div>
        <div className="gg-subject-name">
          <div className="gg-class-name">
            <span className="bold">{classroom.name}</span> {teacher && <span>by <span className="bold">{teacher.firstName} {teacher.lastName}</span></span>}
          </div>
          {assignments.length > 0 && (
            <div className="va-expand">
              {done === true ?
                <div className="va-class-count flex-center completed">
                  <SpriteIcon name="check-custom" />
                </div>
                :
                <div className="va-class-count flex-center">
                  {completed}/{assignments.length}
                </div>}
            </div>
          )}
        </div>
        {this.renderExpandClassAssignments(classroom.assignments)}
      </div>
    )
  }

  renderClassroom(classroom: ClassroomView, i: number) {
    const { assignments, teacher } = classroom;
    const completed = assignments.filter(a => a.bestScore && a.bestScore > 0).length;
    let done = false;
    if (completed == assignments.length) {
      done = true;
    }
    return (
      <div key={i}>
        <div className="gg-subject-name" onClick={() => this.expandClass(classroom)}>
          <div className="gg-class-name">
            <span className="bold">{classroom.name}</span> {teacher && <span>by <span className="bold">{teacher.firstName} {teacher.lastName}</span></span>}
          </div>
          {assignments.length > 0 && (
            <div
              className="va-expand"
              onClick={() => this.expandClass(classroom)}
            >
              {done === true ?
                <div className="va-class-count flex-center completed">
                  <SpriteIcon name="check-custom" />
                </div>
                :
                <div className="va-class-count flex-center">
                  {completed}/{assignments.length}
                </div>}
            </div>
          )}
        </div>
        {assignments.length > 0 && this.renderHorizontalAssignments(assignments)}
      </div>
    );
  }

  moveBack() {
    if (this.state.expandedClassroom) {
      this.setState({ expandedClassroom: null });
      this.props.history.push(map.AssignmentsPage);
    } else {
      this.props.history.push(map.MainPage);
    }
  }

  render() {
    const { expandedClassroom } = this.state;
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
            {this.state.searchExpanded && <div>
              {this.renderGroupSearch()}
            </div>
            }
            <div className="flex-center">
              Assignments
            </div>
            <div className="filter-btn-container">
              <div className="filter-btn">
                <div onClick={() => this.setState({ searchExpanded: !this.state.searchExpanded })}>
                  <div>Choose Class</div>
                  <SpriteIcon name="arrow-down" />
                </div>
              </div>
            </div>
          </div>
          <div className="va-bricks-container">
            {expandedClassroom
              ? this.renderExpandedClass(expandedClassroom)
              : classrooms.map(this.renderClassroom.bind(this))
            }
          </div>
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
