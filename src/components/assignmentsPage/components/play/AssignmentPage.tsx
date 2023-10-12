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
import { countClassroomAssignments } from "./service";
import ClassInvitationDialog from "components/baseComponents/classInvitationDialog/ClassInvitationDialog";
import ClassTInvitationDialog from "components/baseComponents/classInvitationDialog/ClassTInvitationDialog";
import { stripHtml } from "components/build/questionService/ConvertService";
import { GetSortSidebarClassroom } from "localStorage/assigningClass";
import { SortClassroom } from "components/teach/assignments/components/TeachFilterSidebar";
import subjectActions from "redux/actions/subject";

interface PlayProps {
  history: any;
  match: any;

  // redux
  user: User;
  requestFailed(value: string): void;

  subjects: Subject[];
  getSubjects(): Promise<Subject[]>;
}

interface PlayState {
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
    
    const classSort = GetSortSidebarClassroom();

    this.state = {
      rawAssignments: [],
      classrooms: [],
      activeClassroomId,
      classSort: classSort ? classSort : SortClassroom.Assignment,
      isLoaded: false,
    }

    this.getAssignments(classSort);
    if (this.props.subjects.length === 0) {
      this.props.getSubjects();
    }
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

  async getAssignments(classSort: SortClassroom | null) {
    let assignments = await getAssignedBricks();

    if (assignments) {
      assignments = assignments.sort((a, b) => {
        if (a.bestScore && a.bestScore > 0) {
          return -1;
        }
        if (b.bestScore && b.bestScore > 0) {
          return 1;
        }
        return a.order - b.order;
      });
      this.setAssignments(assignments, classSort);
    } else {
      this.props.requestFailed('Can`t get bricks for current user');
      this.setState({ isLoaded: true })
    }
  }

  setAssignments(assignments: AssignmentBrick[], sort: SortClassroom | null) {
    let classrooms: any[] = [];
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

    classrooms = this.getSorted(classrooms, sort);

    this.setState({ ...this.state, isLoaded: true, classrooms, rawAssignments: assignments });
  }


  setActiveClassroom(classroomId: number) {
    if (classroomId > 0) {
      this.props.history.push(map.AssignmentsPage + '/' + classroomId);
    } else {
      this.props.history.push(map.AssignmentsPage);
    }
    this.setState({ activeClassroomId: classroomId });
  }

  getSorted(classrooms: any[], sort: SortClassroom | null) {
    if (sort == SortClassroom.Assignment) {
      classrooms = classrooms.sort((c1, c2) => c2.assignmentsBrick.length - c1.assignmentsBrick.length);
    } else if (sort === SortClassroom.Name) {
      classrooms = classrooms.sort((c1, c2) =>  stripHtml(c2.name).toLocaleLowerCase() > stripHtml(c1.name).toLocaleLowerCase() ? -1 : 1);
    } else {
      classrooms = classrooms.sort((c1, c2) => new Date(c2.created).getTime() > new Date(c1.created).getTime() ? 1 : -1);
    }
    return classrooms;
  }

  sorting(sort: SortClassroom) {
    console.log('sorting')
    const classrooms = this.getSorted(this.state.classrooms, sort);
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
                subjects={this.props.subjects}
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

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  subjects: state.subjects.subjects
});

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e)),
  getSubjects: () => dispatch(subjectActions.fetchSubjects())
});

export default connect(mapState, mapDispatch)(AssignmentPage);
