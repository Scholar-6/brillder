import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";

import { ReduxCombinedState } from "redux/reducers";
import { PlayFilters } from '../../model';
import { AssignmentBrick, AssignmentBrickStatus } from "model/assignment";
import actions from 'redux/actions/requestFailed';
import { getAssignedBricks } from "services/axios/brick";
import { downKeyPressed, upKeyPressed } from "components/services/key";

import { User } from "model/user";

import AssignedBricks from "./AssignedBricks";
import PlayFilterSidebar from "./PlayFilterSidebar";
import BackPagePagination from "../BackPagePagination";
import map from "components/map";
import { Subject } from "model/brick";
import { getSubjects } from "services/axios/subject";


interface PlayProps {
  history: any;
  match: any;

  // redux
  user: User;
  requestFailed(value: string): void;
}

interface PlayState {
  filters: PlayFilters;
  subjects: Subject[];
  finalAssignments: AssignmentBrick[];
  rawAssignments: AssignmentBrick[];
  activeClassroomId: number;
  classrooms: any[];
  sortedIndex: number;
  pageSize: number;
  isLoaded: boolean;
  handleKey(e: any): void;
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
      finalAssignments: [],
      rawAssignments: [],
      classrooms: [],
      activeClassroomId,

      sortedIndex: 0,
      pageSize: 6,

      subjects: [],

      isLoaded: false,

      filters: {
        viewAll: false,
        completed: false,
        submitted: false,
        checked: false
      },
      handleKey: this.handleKey.bind(this)
    }

    this.getAssignments();
  }

  async getAssignments() {
    const assignments = await getAssignedBricks();
    const subjects = await getSubjects();
    if (assignments && subjects) {
      this.setAssignments(assignments, subjects);
    } else {
      this.props.requestFailed('Can`t get bricks for current user');
      this.setState({ isLoaded: true })
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.state.handleKey, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.state.handleKey, false);
  }

  handleKey(e: any) {
    if (upKeyPressed(e)) {
      this.moveBack();
    } else if (downKeyPressed(e)) {
      this.moveNext();
    }
  }

  countClassroomAssignments(classrooms: any[], assignments: AssignmentBrick[]) {
    for (let c of classrooms) {
      c.assignmentsCount = 0;
      for (let a of assignments) {
        if (a.classroom && a.classroom.id === c.id) {
          c.assignmentsCount += 1;
        }
      }
    }
  }

  setAssignments(assignments: AssignmentBrick[], subjects: Subject[]) {
    let classrooms: any[] = [];
    for (let assignment of assignments) {
      if (assignment.classroom) {
        const found = classrooms.find(c => c.id === assignment.classroom.id);
        if (!found) {
          classrooms.push(assignment.classroom);
        }
      }
    }

    this.countClassroomAssignments(classrooms, assignments);
    this.setState({ ...this.state, subjects, isLoaded: true, classrooms, rawAssignments: assignments, finalAssignments: assignments, sortedIndex: 0 });
  }

  playFilterUpdated(filters: PlayFilters) {
    const { checked, submitted, completed } = filters;
    let finalAssignments = this.state.rawAssignments;

    if (!checked && !submitted && !completed) {
    } else {
      finalAssignments = this.state.rawAssignments.filter(a => {
        if (checked) {
          if (a.status === AssignmentBrickStatus.CheckedByTeacher) {
            return true;
          }
        }
        if (submitted) {
          if (a.status === AssignmentBrickStatus.SubmitedToTeacher) {
            return true;
          }
        }
        if (completed) {
          if (a.status === AssignmentBrickStatus.ToBeCompleted) {
            return true;
          }
        }
        return false;
      });
    }
    this.setState({ filters, finalAssignments, sortedIndex: 0 });
  }

  //#region Pagination
  moveBack() {
    let index = this.state.sortedIndex;
    if (index >= this.state.pageSize) {
      this.setState({ ...this.state, sortedIndex: index - this.state.pageSize });
    }
  }

  moveNext() {
    let index = this.state.sortedIndex;
    if (index + this.state.pageSize <= this.state.finalAssignments.length) {
      this.setState({ ...this.state, sortedIndex: index + this.state.pageSize });
    }
  }
  //#endregion

  setActiveClassroom(classroomId: number) {
    let { filters } = this.state;
    let assignments = this.state.rawAssignments;
    if (classroomId > 0) {
      assignments = this.state.rawAssignments.filter(s => s.classroom?.id === classroomId);
      filters.submitted = false;
      filters.completed = false;
      filters.checked = false;
      this.props.history.push(map.AssignmentsPage + '/' + classroomId);
    } else {
      filters.viewAll = true;
      this.props.history.push(map.AssignmentsPage);
    }

    this.setState({ activeClassroomId: classroomId, finalAssignments: assignments, filters, sortedIndex: 0 });
  }

  render() {
    return (
      <Grid container direction="row" className="sorted-row">
        <PlayFilterSidebar
          filters={this.state.filters}
          activeClassroomId={this.state.activeClassroomId}
          assignmentsLength={this.state.rawAssignments.length}
          assignments={this.state.finalAssignments}
          setActiveClassroom={this.setActiveClassroom.bind(this)}
          classrooms={this.state.classrooms}
          filterChanged={this.playFilterUpdated.bind(this)}
        />
        <Grid item xs={9} className="brick-row-container">
          <div className="brick-row-title main-title uppercase">
            Assignments
          </div>
          {this.state.isLoaded &&
            <div className="tab-content learn-tab-desktop">
              <AssignedBricks
                user={this.props.user}
                shown={true}
                subjects={this.state.subjects}
                filters={this.state.filters}
                pageSize={this.state.pageSize}
                sortedIndex={this.state.sortedIndex}
                assignments={this.state.finalAssignments}
                history={this.props.history}
              />
              <BackPagePagination
                sortedIndex={this.state.sortedIndex}
                pageSize={this.state.pageSize}
                isRed={this.state.sortedIndex === 0}
                bricksLength={this.state.finalAssignments.length}
                moveNext={this.moveNext.bind(this)}
                moveBack={this.moveBack.bind(this)}
              />
            </div>
          }
        </Grid>
      </Grid>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e))
});

export default connect(mapState, mapDispatch)(AssignmentPage);
