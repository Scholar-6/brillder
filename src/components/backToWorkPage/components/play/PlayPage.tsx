import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";

import { ReduxCombinedState } from "redux/reducers";
import { PlayFilters, ThreeAssignmentColumns } from '../../model';
import { AssignmentBrick, AssignmentBrickStatus } from "model/assignment";
import actions from 'redux/actions/requestFailed';
import { getAssignedBricks } from "components/services/axios/brick";
import service, { getLongestColumn, hideAssignments } from './service';
import { checkAdmin, checkEditor, checkTeacher } from "components/services/brickService";

import { User } from "model/user";

import Tab, { ActiveTab } from '../Tab';
import AssignedBricks from "./AssignedBricks";
import PlayFilterSidebar from "./PlayFilterSidebar";
import BackPagePagination from "../BackPagePagination";
import BackPagePaginationV2 from "../BackPagePaginationV2";


interface PlayProps {
  history: any;
  generalSubjectId: number;
  setTab(t: ActiveTab): void;

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
  sortedIndex: number;
  pageSize: number;
  isAdmin: boolean;
  isTeach: boolean;
  isCore: boolean;
}

class PlayPage extends Component<PlayProps, PlayState> {
  constructor(props: PlayProps) {
    super(props);

    const isTeach = checkTeacher(this.props.user.roles);
    const isAdmin = checkAdmin(this.props.user.roles);
    const isEditor = checkEditor(this.props.user.roles)

    let isCore = false;
    if (isAdmin || isEditor) {
      isCore = true;
    }

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

      isCore,
      
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
      }
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

  getFilteredAssignemnts(assignments: AssignmentBrick[], isCore: boolean) {
    return service.filterAssignments(assignments, isCore, this.props.user.id, this.props.generalSubjectId);
  }

  setAssignments(assignments: AssignmentBrick[]) {
    const finalAssignments = this.getFilteredAssignemnts(assignments, this.state.isCore);
    const threeColumns = service.prepareThreeAssignmentRows(finalAssignments);
    this.setState({ ...this.state, finalAssignments: finalAssignments, rawAssignments: assignments, threeColumns });
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
    this.setState({ filters, finalAssignments });
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

  toggleCore() {
    let isCore = !this.state.isCore;
    const {filters} = this.state;
    filters.viewAll = true;
    filters.completed = false;
    filters.checked = false;
    filters.submitted = false;

    const finalAssignments = this.getFilteredAssignemnts(this.state.rawAssignments, isCore);
    const threeColumns = service.prepareThreeAssignmentRows(finalAssignments);
    
    this.setState({
      isCore,
      finalAssignments,
      threeColumns,
      sortedIndex: 0,
      filters
    });
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

  renderPagination = () => {
    let { sortedIndex, pageSize } = this.state;

    if (this.state.filters.viewAll) {
      const longestColumn = getLongestColumn(this.state.threeColumns);

      return (
        <BackPagePaginationV2
          sortedIndex={sortedIndex}
          pageSize={pageSize}
          longestColumn={longestColumn}
          moveNext={() => this.moveThreeColumnsNext()}
          moveBack={() => this.moveThreeColumnsBack()}
        />
      )
    }
    return (
      <BackPagePagination
        sortedIndex={sortedIndex}
        pageSize={pageSize}
        bricksLength={this.state.finalAssignments.length}
        moveNext={() => this.moveNext()}
        moveBack={() => this.moveBack()}
      />
    );
  }
  //#endregion

  render() {
    return (
      <Grid container direction="row" className="sorted-row">
        <PlayFilterSidebar
          filters={this.state.filters}
          assignments={this.state.finalAssignments}
          filterChanged={this.playFilterUpdated.bind(this)}
        />
        <Grid item xs={9} className="brick-row-container">
          <Tab
            isTeach={this.state.isTeach || this.state.isAdmin}
            activeTab={ActiveTab.Play}
            setTab={t => this.props.setTab(t)}
          />
          <div className="tab-content">
            <AssignedBricks
              user={this.props.user}
              shown={true}
              isCore={this.state.isCore}
              filters={this.state.filters}
              pageSize={this.state.pageSize}
              sortedIndex={this.state.sortedIndex}
              assignments={this.state.finalAssignments}
              threeColumns={this.state.threeColumns}
              history={this.props.history}
              handleDeleteOpen={() => {}}
              toggleCore={this.toggleCore.bind(this)}
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
