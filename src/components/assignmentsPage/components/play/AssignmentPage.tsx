import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";

import { ReduxCombinedState } from "redux/reducers";
import { AssignmentBrick } from "model/assignment";
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
import { countClassAssignments, countClassroomAssignments, filter, getAssignmentsTabCount, getCompletedTabCount, isVisibled, sortAssignments, Tab } from "./service";


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
      assignmentsTabCount: 0,
      completedTabCount: 0,
      subjects: [],
      finalAssignments: [],
      rawAssignments: [],
      classrooms: [],
      activeClassroomId,
      activeTab: Tab.Assignments,
      sortedIndex: 0,
      pageSize: 6,
      isLoaded: false,
      handleKey: this.handleKey.bind(this)
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

    const finalAssignments = filter(assignments, Tab.Assignments, classroomId);
    countClassroomAssignments(Tab.Assignments, classrooms, assignments);
    const assignmentsTabCount = getAssignmentsTabCount(assignments);
    const completedTabCount = getCompletedTabCount(assignments);
    this.setState({ ...this.state, subjects, isLoaded: true, classrooms, assignmentsTabCount, completedTabCount, rawAssignments: assignments, finalAssignments, sortedIndex: 0 });
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
    const {rawAssignments} = this.state;
    if (classroomId > 0) {
      this.props.history.push(map.AssignmentsPage + '/' + classroomId);
    } else {
      this.props.history.push(map.AssignmentsPage);
    }
    const assignments = filter(rawAssignments, this.state.activeTab, classroomId);

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

  setTab(tab: Tab) {
    if (tab !== this.state.activeTab) {
      const finalAssignments = filter(this.state.rawAssignments, tab, this.state.activeClassroomId);
      countClassroomAssignments(tab, this.state.classrooms, this.state.rawAssignments);
      this.setState({ finalAssignments, sortedIndex: 0, activeTab: tab });
    }
  }

  getViewAllCount() {
    let allCount = 0;
    for (let a of this.state.rawAssignments) {
      if (isVisibled(this.state.activeTab, a)) {
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
          <span>{this.state.assignmentsTabCount} Assignments</span>
          <SpriteIcon name="f-activity" />
        </div>
        <div className={`er-tab second ${activeTab === Tab.Completed ? 'active' : 'no-active'}`} onClick={() => this.setTab(Tab.Completed)}>
          <span>{this.state.completedTabCount} Completed</span>
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
