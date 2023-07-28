import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";

import { ReduxCombinedState } from "redux/reducers";
import { AssignmentBrick } from "model/assignment";
import actions from 'redux/actions/requestFailed';
import { getAssignedBricks } from "services/axios/brick";

import { User } from "model/user";

import AssignedBricks from "./AssignedBricks";
import PlayFilterSidebar from "./PlayFilterSidebar";
import map from "components/map";
import { Subject } from "model/brick";
import { getSubjects } from "services/axios/subject";
import { countClassAssignments, countClassroomAssignments, filter, getAssignmentsTabCount, getCompletedTabCount, sortAssignments } from "./service";
import ClassInvitationDialog from "components/baseComponents/classInvitationDialog/ClassInvitationDialog";
import ClassTInvitationDialog from "components/baseComponents/classInvitationDialog/ClassTInvitationDialog";


interface PlayProps {
  history: any;
  match: any;

  // redux
  user: User;
  requestFailed(value: string): void;
}

interface PlayState {
  assignmentsTabCount: number;
  completedTabCount: number;
  subjects: Subject[];
  finalAssignments: AssignmentBrick[];
  rawAssignments: AssignmentBrick[];
  activeClassroomId: number;
  classrooms: any[];
  sortedIndex: number;
  isLoaded: boolean;
}

class AssignmentPage extends Component<PlayProps, PlayState> {
  constructor(props: PlayProps) {
    super(props);

    let activeClassroomId = -1;
    const { classId } = props.match.params;
    if (classId && classId > 0) {
      activeClassroomId = parseInt(classId as string);
    }

    this.state = {
      assignmentsTabCount: 0,
      completedTabCount: 0,
      subjects: [],
      finalAssignments: [],
      rawAssignments: [],
      classrooms: [],
      activeClassroomId,
      sortedIndex: 0,
      isLoaded: false,
    }

    this.getAssignments(activeClassroomId);
  }

  async getAssignments(classroomId: number) {
    let assignments = await getAssignedBricks();
    const subjects = await getSubjects();
    if (assignments && subjects) {
      assignments = assignments.sort(sortAssignments);
      this.setAssignments(assignments, subjects, classroomId);
    } else {
      this.props.requestFailed('Can`t get bricks for current user');
      this.setState({ isLoaded: true })
    }
  }

  setAssignments(assignments: AssignmentBrick[], subjects: Subject[], classroomId: number) {
    const classrooms: any[] = [];
    for (let assignment of assignments) {
      if (assignment.classroom) {
        assignment.classroom.teacher = assignment.teacher;
        const found = classrooms.find(c => c.id === assignment.classroom.id);
        if (!found) {
          classrooms.push(assignment.classroom);
        }
      }
    }

    const finalAssignments = filter(assignments, classroomId);
    countClassroomAssignments(classrooms, assignments);
    const assignmentsTabCount = getAssignmentsTabCount(assignments);
    const completedTabCount = getCompletedTabCount(assignments);
    this.setState({ ...this.state, subjects, isLoaded: true, classrooms, assignmentsTabCount, completedTabCount, rawAssignments: assignments, finalAssignments, sortedIndex: 0 });
  }

  setActiveClassroom(classroomId: number) {
    const {rawAssignments} = this.state;
    if (classroomId > 0) {
      this.props.history.push(map.AssignmentsPage + '/' + classroomId);
    } else {
      this.props.history.push(map.AssignmentsPage);
    }
    const assignments = filter(rawAssignments, classroomId);

    let assignmentsTabCount = 0;
    let completedTabCount = 0; 

    if (classroomId > 0) {
      let assignments = [];
      for (let a of rawAssignments) {
        if (a.classroom?.id === classroomId) {
          assignments.push(a);
        }
      }
      ({ assignmentsTabCount, completedTabCount } = countClassAssignments(classroomId, rawAssignments))
    } else {
      assignmentsTabCount = getAssignmentsTabCount(rawAssignments);
      completedTabCount = getCompletedTabCount(rawAssignments);
    }
    this.setState({ activeClassroomId: classroomId, assignmentsTabCount, completedTabCount, finalAssignments: assignments, sortedIndex: 0 });
  }

  getViewAllCount() {
    let allCount = 0;
    for (let a of this.state.rawAssignments) {
      allCount += 1;
    }
    return allCount;
  }

  render() {
    const allCount = this.getViewAllCount();
    return (
      <Grid container direction="row" className="sorted-row">
        <PlayFilterSidebar
          activeClassroomId={this.state.activeClassroomId}
          assignmentsLength={allCount}
          setActiveClassroom={this.setActiveClassroom.bind(this)}
          classrooms={this.state.classrooms}
        />
        <Grid item xs={9} className="brick-row-container">
          {this.state.isLoaded &&
            <div className="tab-content learn-tab-desktop">
              <AssignedBricks
                user={this.props.user}
                subjects={this.state.subjects}
                assignments={this.state.finalAssignments}
                history={this.props.history}
              />
            </div>
          }
        </Grid>
        <ClassInvitationDialog onFinish={() => this.getAssignments(-1)} />
        <ClassTInvitationDialog />
      </Grid>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e))
});

export default connect(mapState, mapDispatch)(AssignmentPage);
