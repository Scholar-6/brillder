import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";

import { ReduxCombinedState } from "redux/reducers";
import { PlayFilters, ThreeAssignmentColumns } from '../../model';
import { AssignmentBrick, AssignmentBrickStatus } from "model/assignment";
import actions from 'redux/actions/requestFailed';
import { getAssignedBricks } from "services/axios/brick";
import service, { getLongestColumn, hideAssignments } from './service';
import { checkAdmin, checkTeacher } from "components/services/brickService";
import { downKeyPressed, upKeyPressed } from "components/services/key";

import { User } from "model/user";

import AssignedBricks from "./AssignedBricks";
import PlayFilterSidebar from "./PlayFilterSidebar";
import BackPagePagination from "../BackPagePagination";
import BackPagePaginationV2 from "../BackPagePaginationV2";
import MobileLearn from "./MobileLearn";
import map from "components/map";
import { isPhone } from "services/phone";


interface PlayProps {
  history: any;
  match: any;

  // redux
  user: User;
  requestFailed(value: string): void;
}

interface PlayState {
  filterExpanded: boolean;
  isClearFilter: boolean;
  filters: PlayFilters;
  threeColumns: ThreeAssignmentColumns;
  finalAssignments: AssignmentBrick[];
  rawAssignments: AssignmentBrick[];
  activeClassroomId: number;
  classrooms: any[];
  sortedIndex: number;
  pageSize: number;
  isAdmin: boolean;
  isTeach: boolean;
  isLoaded: boolean;
  handleKey(e: any): void;
}

class AssignmentPage extends Component<PlayProps, PlayState> {
  constructor(props: PlayProps) {
    super(props);

    const isTeach = checkTeacher(this.props.user);
    const isAdmin = checkAdmin(this.props.user.roles);

    const threeColumns = {
      red: {
        rawAssignments: [],
        finalAssignments: []
      },
      yellow: {
        rawAssignments: [],
        finalAssignments: []
      },
      green: {
        rawAssignments: [],
        finalAssignments: []
      }
    } as ThreeAssignmentColumns;

    let activeClassroomId = -1;
    const {classId} = props.match.params;
    if (classId && classId > 0) {
      activeClassroomId = parseInt(classId as string);
    }
    
    this.state = {
      finalAssignments: [],
      rawAssignments: [],
      threeColumns,
      classrooms: [],
      activeClassroomId,

      filterExpanded: true,
      isClearFilter: false,
      sortedIndex: 0,
      pageSize: 18,

      isLoaded: false,

      isAdmin, isTeach,

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
    if (assignments) {
      this.setAssignments(assignments);
    } else {
      this.props.requestFailed('Can`t get bricks for current user');
      this.setState({isLoaded: true})
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

  getFilteredAssignemnts(assignments: AssignmentBrick[]) {
    return service.filterAssignments(assignments, true);
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

  setAssignments(assignments: AssignmentBrick[]) {
    let classrooms:any[] = [];
    for (let assignment of assignments) {
      if (assignment.classroom) {
        const found = classrooms.find(c => c.id === assignment.classroom.id);
        if (!found) {
          classrooms.push(assignment.classroom);
        }
      }
    }

    const threeColumns = service.prepareThreeAssignmentRows(assignments);
    this.countClassroomAssignments(classrooms, assignments);
    this.setState({ ...this.state, isLoaded: true, classrooms, rawAssignments: assignments, finalAssignments: assignments, threeColumns, sortedIndex: 0 });
  }

  onThreeColumnsMouseHover(index: number, status: AssignmentBrickStatus) {
    const key = Math.floor(index / 3);
    const name = service.getPlayThreeColumnName(status);
    const {threeColumns} = this.state;

    let assignment = service.getPlayThreeColumnBrick(threeColumns, name, key);
    if (assignment && assignment.brick.expanded) return;
  
    hideAssignments(this.state.rawAssignments);
    service.expandPlayThreeColumnBrick(this.state.threeColumns, name, key + this.state.sortedIndex);
    this.setState({ ...this.state });
  }

  onThreeColumnsMouseLeave() {
    hideAssignments(this.state.rawAssignments);
    this.setState({ ...this.state });
  }

  playFilterUpdated(filters: PlayFilters) {
    const { checked, submitted, completed } = filters;
    let finalAssignments = this.state.rawAssignments;
    
    if (!checked && !submitted && !completed) {
    } else {
      finalAssignments = this.state.rawAssignments.filter(a => {
        if (checked) {
          if (a.status === AssignmentBrickStatus.CheckedByTeacher){
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

  onMouseHover(index: number) {
    hideAssignments(this.state.rawAssignments);
    const assignment = this.state.finalAssignments[index];
    if (assignment) {
      assignment.brick.expanded = true;
    }
    this.setState({ ...this.state });
  }

  onMouseLeave() {
    hideAssignments(this.state.rawAssignments);
    this.setState({ ...this.state });
  }

  //#region Pagination
  moveThreeColumnsNext() {
    const longest = getLongestColumn(this.state.threeColumns);
    const { pageSize } = this.state;

    let index = this.state.sortedIndex;
    if (index + pageSize / 3 <= longest) {
      this.setState({ ...this.state, sortedIndex: index + (pageSize / 3) });
    }
  }

  moveThreeColumnsBack() {
    let index = this.state.sortedIndex;
    if (index >= this.state.pageSize / 3) {
      this.setState({ ...this.state, sortedIndex: index - (this.state.pageSize / 3) });
    }
  }

  moveBack() {
    if (this.state.filters.viewAll) {
      return this.moveThreeColumnsBack();
    }
    let index = this.state.sortedIndex;
    if (index >= this.state.pageSize) {
      this.setState({ ...this.state, sortedIndex: index - this.state.pageSize });
    }
  }

  moveNext() {
    if (this.state.filters.viewAll) {
      return this.moveThreeColumnsNext();
    }
    let index = this.state.sortedIndex;
    if (index + this.state.pageSize <= this.state.finalAssignments.length) {
      this.setState({ ...this.state, sortedIndex: index + this.state.pageSize });
    }
  }

  renderPagination = () => {
    let { sortedIndex, pageSize } = this.state;

    if (this.state.filters.viewAll) {
      const longestColumn = getLongestColumn(this.state.threeColumns);

      return (
        <BackPagePaginationV2
          sortedIndex={sortedIndex}
          pageSize={pageSize}
          isRed={sortedIndex === 0}
          longestColumn={longestColumn}
          moveNext={this.moveThreeColumnsNext.bind(this)}
          moveBack={this.moveThreeColumnsBack.bind(this)}
        />
      )
    }
    return (
      <BackPagePagination
        sortedIndex={sortedIndex}
        pageSize={pageSize}
        isRed={sortedIndex === 0}
        bricksLength={this.state.finalAssignments.length}
        moveNext={this.moveNext.bind(this)}
        moveBack={this.moveBack.bind(this)}
      />
    );
  }
  //#endregion

  setActiveClassroom(classroomId: number) {
    let {filters} = this.state;
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
    const threeColumns = service.prepareThreeAssignmentRows(assignments);
    
    this.setState({activeClassroomId: classroomId, finalAssignments: assignments, threeColumns, filters, sortedIndex: 0});
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
          { this.state.isLoaded &&
            <div className="tab-content learn-tab-desktop">
              <AssignedBricks
                user={this.props.user}
                shown={true}
                filters={this.state.filters}
                pageSize={this.state.pageSize}
                sortedIndex={this.state.sortedIndex}
                assignments={this.state.finalAssignments}
                threeColumns={this.state.threeColumns}
                history={this.props.history}
                handleDeleteOpen={() => {}}
                onMouseHover={this.onMouseHover.bind(this)}
                onMouseLeave={this.onMouseLeave.bind(this)}
                onThreeColumnsMouseHover={this.onThreeColumnsMouseHover.bind(this)}
                onThreeColumnsMouseLeave={this.onThreeColumnsMouseLeave.bind(this)}
              />
              {this.renderPagination()}
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
