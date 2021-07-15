import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";

import { ReduxCombinedState } from "redux/reducers";
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
import SpriteIcon from "components/baseComponents/SpriteIcon";


export enum Tab {
  Assignments,
  Completed
}

interface PlayProps {
  history: any;
  match: any;

  // redux
  user: User;
  requestFailed(value: string): void;
}

interface PlayState {
  subjects: Subject[];
  activeTab: Tab,
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

      activeTab: Tab.Assignments,

      sortedIndex: 0,
      pageSize: 6,

      subjects: [],

      isLoaded: false,
      handleKey: this.handleKey.bind(this)
    }

    this.getAssignments(activeClassroomId);
  }

  sortAssignments(a: AssignmentBrick, b: AssignmentBrick) {
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
  }

  async getAssignments(classroomId: number) {
    let assignments = await getAssignedBricks();
    const subjects = await getSubjects();
    if (assignments && subjects) {
      assignments = assignments.sort(this.sortAssignments);
      this.setAssignments(assignments, subjects, classroomId);
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

  setAssignments(assignments: AssignmentBrick[], subjects: Subject[], classroomId: number) {
    const classrooms: any[] = [];
    for (let assignment of assignments) {
      if (assignment.classroom) {
        const found = classrooms.find(c => c.id === assignment.classroom.id);
        if (!found) {
          classrooms.push(assignment.classroom);
        }
      }
    }

    const finalAssignments = this.filter(assignments, Tab.Assignments, classroomId);
    this.countClassroomAssignments(classrooms, assignments);
    this.setState({ ...this.state, subjects, isLoaded: true, classrooms, rawAssignments: assignments, finalAssignments, sortedIndex: 0 });
  }

  isVisibled(tab: Tab, a: AssignmentBrick) {
    if (tab === Tab.Assignments) {
      if (a.status === AssignmentBrickStatus.ToBeCompleted) {
        return true;
      }
    } else {
      if (a.status !== AssignmentBrickStatus.ToBeCompleted) {
        return true;
      }
    }
    return false;
  }

  filter(assignments: AssignmentBrick[], activeTab: Tab, classroomId: number) {
    let asins = assignments;
    if (classroomId > 0) {
      asins = assignments.filter(s => s.classroom?.id === classroomId);
    }

    const res = [];
    for (let a of asins) {
      if (this.isVisibled(activeTab, a)) {
        res.push(a);
      }
    }
    return res;
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
    if (classroomId > 0) {
      this.props.history.push(map.AssignmentsPage + '/' + classroomId);
    } else {
      this.props.history.push(map.AssignmentsPage);
    }
    const assignments = this.filter(this.state.rawAssignments, this.state.activeTab, classroomId);
    this.setState({ activeClassroomId: classroomId, finalAssignments: assignments, sortedIndex: 0 });
  }

  setTab(tab: Tab) {
    if (tab !== this.state.activeTab) {
      const finalAssignments = this.filter(this.state.rawAssignments, tab, this.state.activeClassroomId);
      this.setState({ finalAssignments, sortedIndex: 0, activeTab: tab });
    }
  }

  getViewAllCount() {
    let allCount = 0;
    for (let a of this.state.rawAssignments) {
      if (this.isVisibled(this.state.activeTab, a)) {
        allCount += 1;
      }
    }
    return allCount;
  }

  renderTabs() {
    const {activeTab} = this.state;
    return (
      <div className="er-tab-container">
        <div className={`er-tab first ${activeTab === Tab.Assignments ? 'active' : 'no-active'}`} onClick={() => this.setTab(Tab.Assignments)}>
          <span>Assignments</span>
          <SpriteIcon name="f-activity" />
        </div>
        <div className={`er-tab second ${activeTab === Tab.Completed ? 'active' : 'no-active'}`} onClick={() => this.setTab(Tab.Completed)}>
          <span>Completed</span>
          <SpriteIcon name="f-check-clircle" />
        </div>
      </div>
    );
  }

  render() {
    const allCount = this.getViewAllCount();
    return (
      <Grid container direction="row" className="sorted-row">
        <PlayFilterSidebar
          activeTab={this.state.activeTab}
          activeClassroomId={this.state.activeClassroomId}
          assignmentsLength={allCount}
          setActiveClassroom={this.setActiveClassroom.bind(this)}
          classrooms={this.state.classrooms}
        />
        <Grid item xs={9} className="brick-row-container">
          {this.renderTabs()}
          {this.state.isLoaded &&
            <div className="tab-content learn-tab-desktop">
              <AssignedBricks
                user={this.props.user}
                shown={true}
                subjects={this.state.subjects}
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
