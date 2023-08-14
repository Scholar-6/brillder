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
import { countClassroomAssignments, sortAssignments } from "./service";
import ClassInvitationDialog from "components/baseComponents/classInvitationDialog/ClassInvitationDialog";
import ClassTInvitationDialog from "components/baseComponents/classInvitationDialog/ClassTInvitationDialog";
import { SortClassroom } from "components/admin/bricksPlayed/BricksPlayedSidebar";
import { stripHtml } from "components/build/questionService/ConvertService";


interface PlayProps {
  history: any;
  match: any;

  // redux
  user: User;
  requestFailed(value: string): void;
}

interface PlayState {
  subjects: Subject[];
  rawAssignments: AssignmentBrick[];
  activeClassroomId: number;
  classrooms: any[];
  classSort: SortClassroom;
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
      subjects: [],
      rawAssignments: [],
      classrooms: [],
      activeClassroomId,
      classSort: SortClassroom.Assignment,
      isLoaded: false,
    }

    this.getAssignments();
  }

  componentDidUpdate() {
    const {pathname} = this.props.history.location;
    const res = pathname.split('/');

    // checking path for class id
    if (res.length === 2) {
      if (this.state.activeClassroomId > 0) {
        this.setState({activeClassroomId: -1});
      }
    } else if (res.length === 3) {
      // check if active class the same
      const id = parseInt(res[2]);
      if (this.state.activeClassroomId != id) {
        this.setState({activeClassroomId: id});
      }
    }
  }

  async getAssignments() {
    let assignments = await getAssignedBricks();
    const subjects = await getSubjects();
    if (assignments && subjects) {
      assignments = assignments.sort(sortAssignments);
      this.setAssignments(assignments, subjects);
    } else {
      this.props.requestFailed('Can`t get bricks for current user');
      this.setState({ isLoaded: true })
    }
  }

  setAssignments(assignments: AssignmentBrick[], subjects: Subject[]) {
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

    countClassroomAssignments(classrooms, assignments);

    classrooms.sort((c1, c2) => c2.assignmentsBrick.length - c1.assignmentsBrick.length);

    for (let classroom of classrooms) {
      classroom.assignmentsBrick.sort((a: any) => {
        if (a.bestScore && a.bestScore > 0) {
          return 1;
        }
        return -1;
      });
    }

    this.setState({ ...this.state, subjects, isLoaded: true, classrooms, rawAssignments: assignments });
  }


  setActiveClassroom(classroomId: number) {
    if (classroomId > 0) {
      this.props.history.push(map.AssignmentsPage + '/' + classroomId);
    } else {
      this.props.history.push(map.AssignmentsPage);
    }
    this.setState({ activeClassroomId: classroomId });
  }

  sorting(sort: SortClassroom) {
    let classrooms = this.state.classrooms;

    if (sort == SortClassroom.Assignment) {
      classrooms = this.state.classrooms.sort((c1, c2) => c2.assignmentsBrick.length - c1.assignmentsBrick.length);
    } else if (sort === SortClassroom.Name) {
      classrooms = this.state.classrooms.sort((c1, c2) => stripHtml(c2.name) > stripHtml(c1.name) ? -1 : 1);
    } else {
      classrooms = this.state.classrooms.sort((c1, c2) => new Date(c2.created).getTime() > new Date(c1.created).getTime() ? 1 : -1);
    }
    
    this.setState({classSort: sort, classrooms});
  }

  render() {
    return (
      <Grid container direction="row" className="sorted-row">
        <PlayFilterSidebar
          activeClassroomId={this.state.activeClassroomId}
          assignmentsLength={this.state.rawAssignments.length}
          setActiveClassroom={this.setActiveClassroom.bind(this)}
          classrooms={this.state.classrooms}
          classSort={this.state.classSort}
          sorting={this.sorting.bind(this)}
        />
        <Grid item xs={9} className="brick-row-container">
          {this.state.isLoaded &&
            <div className="tab-content learn-tab-desktop">
              <AssignedBricks
                user={this.props.user}
                activeClassroomId={this.state.activeClassroomId}
                subjects={this.state.subjects}
                classrooms={this.state.classrooms}
                assignments={this.state.rawAssignments}
                history={this.props.history}
                activateClassroom={this.setActiveClassroom.bind(this)}
              />
            </div>
          }
        </Grid>
        <ClassInvitationDialog onFinish={this.getAssignments.bind(this)} />
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
