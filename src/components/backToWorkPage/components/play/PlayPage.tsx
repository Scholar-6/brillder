import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";

import { ReduxCombinedState } from "redux/reducers";
import { PlayFilters, ThreeAssignmentColumns } from '../../model';
import { TeachClassroom } from "model/classroom";
import { AssignmentBrick, AssignmentBrickStatus } from "model/assignment";
import actions from 'redux/actions/requestFailed';
import { getAssignedBricks } from "components/services/axios/brick";
import { hideAssignments } from '../../service';
import { checkAdmin, checkTeacher } from "components/services/brickService";

import {
  prepareThreeAssignmentRows, expandPlayThreeColumnBrick, getPlayThreeColumnName, getPlayThreeColumnBrick
} from '../../threeColumnService';
import { User } from "model/user";

import Tab, { ActiveTab } from '../Tab';
import AssignedBricks from "./AssignedBricks";
import PlayFilterSidebar from "./PlayFilterSidebar";


interface PlayProps {
  history: any;
  classrooms: TeachClassroom[];
  setTab(t: ActiveTab): void;

  // redux
  user: User;
  requestFailed(value: string): void;
}

interface PlayState {
  activeClassroom: TeachClassroom | null;
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
      
      filterExpanded: true,
      isClearFilter: false,
      activeClassroom: null,
      sortedIndex: 0,
      pageSize: 18,

      isAdmin, isTeach,

      filters: {
        completed: false,
        submitted: false,
        checked: false
      }
    }

    this.setAssignments();
  }

  async setAssignments() {
    const assignments = await getAssignedBricks();
    if (assignments) {
      const threeColumns = prepareThreeAssignmentRows(assignments);
      this.setState({ ...this.state, finalAssignments: assignments, rawAssignments: assignments, threeColumns });
    } else {
      this.props.requestFailed('Can`t get bricks for current user');
    }
  }

  onPlayThreeColumnsMouseHover(index: number, status: AssignmentBrickStatus) {
    hideAssignments(this.state.rawAssignments);

    const key = Math.floor(index / 3);
    this.setState({ ...this.state });

    setTimeout(() => {
      hideAssignments(this.state.rawAssignments);
      const name = getPlayThreeColumnName(status);
      expandPlayThreeColumnBrick(this.state.threeColumns, name, key + this.state.sortedIndex);
      this.setState({ ...this.state });
    }, 400);
  }

  onPlayThreeColumnsMouseLeave(index: number, status: AssignmentBrickStatus) {
    hideAssignments(this.state.rawAssignments);

    const key = Math.ceil(index / 3);
    const name = getPlayThreeColumnName(status);

    const assignment = getPlayThreeColumnBrick(this.state.threeColumns, name, key + this.state.sortedIndex);

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

  handlePlayMouseHover(index: number) {
    hideAssignments(this.state.rawAssignments);
    this.setState({ ...this.state });
    setTimeout(() => {
      //expandBrick(this.state.rawAssignments, this.state.rawAssignments, index);
      this.setState({ ...this.state });
    }, 400);
  }

  handlePlayMouseLeave(key: number) {
    let { finalAssignments } = this.state;
    hideAssignments(this.state.rawAssignments);
    finalAssignments[key].brick.expandFinished = true;
    this.setState({ ...this.state });
    setTimeout(() => {
      finalAssignments[key].brick.expandFinished = false;
      this.setState({ ...this.state });
    }, 400);
  }

  render() {
    return (
      <Grid container direction="row" className="sorted-row">
        <PlayFilterSidebar
          classrooms={this.props.classrooms}
          rawAssignments={this.state.rawAssignments}
          setActiveClassroom={() => {}}
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
              filters={this.state.filters}
              pageSize={this.state.pageSize}
              sortedIndex={this.state.sortedIndex}
              assignments={this.state.finalAssignments}
              threeColumns={this.state.threeColumns}
              history={this.props.history}
              handleDeleteOpen={() => {}}
              onMouseHover={()=>{}}
              onMouseLeave={()=>{}}
              onThreeColumnsMouseHover={this.onPlayThreeColumnsMouseHover.bind(this)}
              onThreeColumnsMouseLeave={this.onPlayThreeColumnsMouseLeave.bind(this)}
            />
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
