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
import { isMobile } from "react-device-detect";
import MobileLearn from "./MobileLearn";


interface PlayProps {
  history: any;

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
  handleKey(e: any): void;
}

class PlayPage extends Component<PlayProps, PlayState> {
  constructor(props: PlayProps) {
    super(props);

    const isTeach = checkTeacher(this.props.user.roles);
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
    
    this.state = {
      finalAssignments: [],
      rawAssignments: [],
      threeColumns,
      classrooms: [],
      activeClassroomId: -1,

      filterExpanded: true,
      isClearFilter: false,
      sortedIndex: 0,
      pageSize: 18,

      isAdmin, isTeach,

      filters: {
        viewAll: true,
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
    this.setState({ ...this.state, classrooms, rawAssignments: assignments, threeColumns, sortedIndex: 0 });
  }

  onThreeColumnsMouseHover(index: number, status: AssignmentBrickStatus) {
    const key = Math.floor(index / 3);
    const name = service.getPlayThreeColumnName(status);
    const {threeColumns} = this.state;

    let assignment = service.getPlayThreeColumnBrick(threeColumns, name, key);
    if (assignment && assignment.brick.expanded) return;
  
    hideAssignments(this.state.rawAssignments);

    this.setState({ ...this.state });

    setTimeout(() => {
      hideAssignments(this.state.rawAssignments);
      const name = service.getPlayThreeColumnName(status);
      service.expandPlayThreeColumnBrick(this.state.threeColumns, name, key + this.state.sortedIndex);
      this.setState({ ...this.state });
    }, 400);
  }

  onThreeColumnsMouseLeave(index: number, status: AssignmentBrickStatus) {
    hideAssignments(this.state.rawAssignments);

    const key = Math.ceil(index / 3);
    const name = service.getPlayThreeColumnName(status);

    const assignment = service.getPlayThreeColumnBrick(this.state.threeColumns, name, key + this.state.sortedIndex);

    if (assignment) {
      assignment.brick.expandFinished = true;
      this.setState({ ...this.state });
      setTimeout(() => {
        if (assignment) {
          assignment.brick.expandFinished = false;
          this.setState({ ...this.state });
        }
      }, 400);
    }
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
    this.setState({ ...this.state });
    setTimeout(() => {
      hideAssignments(this.state.rawAssignments);
      const assignment = this.state.finalAssignments[index];
      if (assignment) {
        assignment.brick.expanded = true;
      }
      this.setState({ ...this.state });
    }, 400);
  }

  onMouseLeave(key: number) {
    let { finalAssignments } = this.state;
    hideAssignments(this.state.rawAssignments);
    finalAssignments[key].brick.expandFinished = true;
    this.setState({ ...this.state });
    setTimeout(() => {
      finalAssignments[key].brick.expandFinished = false;
      this.setState({ ...this.state });
    }, 400);
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
    } else {
      filters.viewAll = true;
    }
    const finalAssignments = this.getFilteredAssignemnts(assignments);
    const threeColumns = service.prepareThreeAssignmentRows(finalAssignments);

    this.setState({activeClassroomId: classroomId, finalAssignments, threeColumns, filters, sortedIndex: 0});
  }

  //#region mobile functions
  handleMobileClick(index: number) {
    let { finalAssignments } = this.state;
    if (finalAssignments[index].brick.expanded === true) {
      finalAssignments[index].brick.expanded = false;
      this.setState({ ...this.state });
      return;
    }
    finalAssignments.forEach(a => a.brick.expanded = false);
    finalAssignments[index].brick.expanded = true;
    this.setState({ ...this.state });
  }

  render() {
    if (isMobile) {
      return (
        <MobileLearn
          shown={true}
          assignments={this.state.finalAssignments}
          user={this.props.user}
          history={this.props.history}

          isCore={true}
          onCoreSwitch={() => {}}

          handleClick={this.handleMobileClick.bind(this)}
        />
      );
    }
    return (
      <Grid container direction="row" className="sorted-row">
        <PlayFilterSidebar
          filters={this.state.filters}
          activeClassroomId={this.state.activeClassroomId}
          assignments={this.state.finalAssignments}
          setActiveClassroom={this.setActiveClassroom.bind(this)}
          classrooms={this.state.classrooms}
          filterChanged={this.playFilterUpdated.bind(this)}
        />
        <Grid item xs={9} className="brick-row-container">
          <div className="brick-row-title main-title uppercase">
            Assignments
          </div>
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
        </Grid>
      </Grid>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e))
});

export default connect(mapState, mapDispatch)(PlayPage);
