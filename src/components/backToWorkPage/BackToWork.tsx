import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";

import { ReduxCombinedState } from "redux/reducers";
import actions from 'redux/actions/requestFailed';
import statActions from 'redux/actions/stats';

import "./BackToWork.scss";
import { User } from "model/user";
import { Brick, Subject } from "model/brick";
import { checkAdmin, checkTeacher } from "components/services/brickService";

import { SortBy, PlayFilters, ThreeAssignmentColumns } from './model';
import {
  prepareThreeAssignmentRows, expandPlayThreeColumnBrick, getPlayThreeColumnName, getPlayThreeColumnBrick
} from './threeColumnService';
import { hideAssignments } from './service';
import { loadSubjects, getGeneralSubject } from 'components/services/subject';

import DeleteBrickDialog from "components/baseComponents/deleteBrickDialog/DeleteBrickDialog";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import PlayFilterSidebar from './components/play/PlayFilterSidebar';
//import BackPagePagination from './components/BackPagePagination';
//import BackPagePaginationV2 from './components/BackPagePaginationV2';
import { TeachClassroom } from "model/classroom";
import { getAllClassrooms } from "components/teach/service";
import { getAssignedBricks } from "components/services/axios/brick";
import AssignedBricks from './components/play/AssignedBricks';
import BuildPage from './components/build/BuildPage';
import TeachPage from './components/teach/TeachPage';

import Tab, { ActiveTab } from './components/Tab';
import { AssignmentBrick, AssignmentBrickStatus } from "model/assignment";

interface BackToWorkState {
  searchString: string;
  isSearching: boolean;
  sortBy: SortBy;
  sortedIndex: number;
  sortedReversed: boolean;
  deleteDialogOpen: boolean;
  deleteBrickId: number;
  dropdownShown: boolean;
  notificationsShown: boolean;
  shown: boolean;
  pageSize: number;
  generalSubjectId: number;
  activeTab: ActiveTab;
  subjects: Subject[];

  isTeach: boolean;
  isAdmin: boolean;

  playFilters: PlayFilters;

  // teach
  classrooms: TeachClassroom[];
  activeClassroom: TeachClassroom | null;

  // play
  rawAssignments: AssignmentBrick[];
  finalAssignments: AssignmentBrick[];
  playThreeColumns: ThreeAssignmentColumns;
}

export interface BackToWorkProps {
  user: User;
  history: any;
  stats: any;
  forgetBrick(): void;
  requestFailed(e: string): void;
  getClassStats(id: number): void;

  //test data
  isMocked?: boolean;
  bricks?: Brick[];
}


class BackToWorkPage extends Component<BackToWorkProps, BackToWorkState> {
  constructor(props: BackToWorkProps) {
    super(props);
    let threeAssignmentColumns = {
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

    const isTeach = checkTeacher(this.props.user.roles);
    const isAdmin = checkAdmin(this.props.user.roles);

    let activeTab = ActiveTab.Play;
    if (isTeach) {
      activeTab = ActiveTab.Teach;
    }

    this.state = {
      sortBy: SortBy.None,
      sortedIndex: 0,
      sortedReversed: false,
      deleteDialogOpen: false,
      deleteBrickId: -1,
      activeTab,
      subjects: [],

      isTeach, isAdmin,

      searchString: "",
      isSearching: false,
      dropdownShown: false,
      notificationsShown: false,
      shown: true,
      pageSize: 18,

      generalSubjectId: -1,

      // Play
      classrooms: [],
      activeClassroom: null,
      rawAssignments: [],
      finalAssignments: [],
      playThreeColumns: threeAssignmentColumns,

      playFilters: {
        completed: false,
        submitted: false,
        checked: false
      },
    };

    // load real bricks
    if (!this.props.isMocked) {
      loadSubjects().then((subjects: Subject[] | null) => {
        if (!subjects) { return; }
        let generalSubjectId = - 1;
        let generalSubject = getGeneralSubject(subjects);
        if (generalSubject) {
          generalSubjectId = generalSubject.id;
        }
        this.setState({ generalSubjectId, subjects });
        if (!this.props.isMocked) {
          this.getBricks();
        }
      });
    }

    getAllClassrooms().then((classrooms: any) => {
      if (classrooms) {
        this.setState({ classrooms: classrooms as TeachClassroom[] });
      } else {
        // get failed
      }
    });
  }

  //region loading and setting bricks
  setPlayBricks(rawBricks: AssignmentBrick[]) {
    const threeColumns = prepareThreeAssignmentRows(rawBricks);
    this.setState({ ...this.state, finalAssignments: rawBricks, rawAssignments: rawBricks, playThreeColumns: threeColumns });
  }

  getBricks() {
    getAssignedBricks().then(assignments => {
      if (assignments) {
        this.setPlayBricks(assignments);
      } else {
        this.props.requestFailed('Can`t get bricks for current user');
      }
    })
  }
  //region loading and setting bricks

  delete(brickId: number) {
    //let { rawBricks, finalBricks, threeColumns } = this.state;
    //removeBrickFromLists(rawBricks, finalBricks, threeColumns, brickId);
    //this.setState({ ...this.state, deleteDialogOpen: false });
  }

  setTab(activeTab: ActiveTab) {
    this.deactivateClassrooms();
    this.setState({ activeTab });
  }

  handleDeleteOpen(deleteBrickId: number) {
    this.setState({ ...this.state, deleteDialogOpen: true, deleteBrickId });
  }

  handleDeleteClose() {
    this.setState({ ...this.state, deleteDialogOpen: false });
  }

  //#region Teach

  deactivateClassrooms() {
    for (let classroom of this.state.classrooms) {
      classroom.active = false;
    }
  }

  setActiveClassroom(id: number | null) {
    this.deactivateClassrooms();
    const { classrooms } = this.state;
    let classroom = classrooms.find(c => c.id === id);
    if (classroom) {
      this.props.getClassStats(classroom.id);
      classroom.active = true;
      this.setState({ classrooms, activeClassroom: classroom });
    } else {
      this.setState({ activeClassroom: null });
    }
  }
  //#endregion

  //#region Play
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

  onPlayThreeColumnsMouseHover(index: number, status: AssignmentBrickStatus) {
    hideAssignments(this.state.rawAssignments);

    let key = Math.floor(index / 3);
    this.setState({ ...this.state });

    setTimeout(() => {
      hideAssignments(this.state.rawAssignments);
      let name = getPlayThreeColumnName(status);
      expandPlayThreeColumnBrick(this.state.playThreeColumns, name, key + this.state.sortedIndex);
      this.setState({ ...this.state });
    }, 400);
  }

  onPlayThreeColumnsMouseLeave(index: number, status: AssignmentBrickStatus) {
    hideAssignments(this.state.rawAssignments);

    let key = Math.ceil(index / 3);
    let name = getPlayThreeColumnName(status);

    let assignment = getPlayThreeColumnBrick(this.state.playThreeColumns, name, key + this.state.sortedIndex);

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

  playFilterUpdated(playFilters: PlayFilters) {
    const { checked, submitted, completed } = playFilters;
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
    this.setState({ playFilters, finalAssignments });
  }
  //#endregion

  searching(searchString: string) {
    if (searchString.length === 0) {
      this.setState({
        ...this.state,
        searchString,
        //finalBricks: this.state.rawBricks,
        isSearching: false,
      });
    } else {
      this.setState({ ...this.state, searchString });
    }
  }

  search() {
    this.setState({ ...this.state, shown: false, isSearching: true });
  }

  renderBuild() {
    const { activeTab } = this.state;
    if (activeTab !== ActiveTab.Build) {
      return "";
    }
    if (this.state.generalSubjectId === - 1) {
      return "";
    }
    return (
      <BuildPage
        isSearching={this.state.isSearching}
        searchString={this.state.searchString}
        generalSubjectId={this.state.generalSubjectId}
        history={this.props.history}
        activeTab={activeTab}
        setTab={this.setTab.bind(this)}
      />
    );
  }

  renderTeach() {
    const { activeTab } = this.state;
    if (activeTab !== ActiveTab.Teach) {
      return "";
    }
    return <TeachPage
      searchString={this.state.searchString}
      isSearching={this.state.isSearching}
      subjects={this.state.subjects}
      activeTab={this.state.activeTab}
      setTab={this.setTab.bind(this)}
    />;
  }

  renderPlay() {
    const {activeTab} = this.state;
    if (this.state.activeTab !== ActiveTab.Play) {
      return "";
    }
    return (
      <Grid container direction="row" className="sorted-row">
        <PlayFilterSidebar
          classrooms={this.state.classrooms}
          rawAssignments={this.state.rawAssignments}
          setActiveClassroom={this.setActiveClassroom.bind(this)}
          filterChanged={this.playFilterUpdated.bind(this)}
        />
        <Grid item xs={9} className="brick-row-container">
          <Tab isTeach={this.state.isTeach || this.state.isAdmin} activeTab={activeTab} setTab={t => this.setTab(t)} />
          <div className="tab-content">
            <AssignedBricks
              user={this.props.user}
              shown={true}
              filters={this.state.playFilters}
              pageSize={this.state.pageSize}
              sortedIndex={this.state.sortedIndex}
              assignments={this.state.finalAssignments}
              threeColumns={this.state.playThreeColumns}
              history={this.props.history}
              handleDeleteOpen={brickId => this.handleDeleteOpen(brickId)}
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

  render() {
    return (
      <div className="main-listing back-to-work-page">
        <PageHeadWithMenu
          page={PageEnum.BackToWork}
          user={this.props.user}
          placeholder="Search Ongoing Projects & Published Bricks…"
          history={this.props.history}
          search={() => this.search()}
          searching={(v: string) => this.searching(v)}
        />
        {this.renderBuild()}
        {this.renderTeach()}
        {this.renderPlay()}
        <DeleteBrickDialog
          isOpen={this.state.deleteDialogOpen}
          brickId={this.state.deleteBrickId}
          onDelete={(brickId: number) => this.delete(brickId)}
          close={() => this.handleDeleteClose()}
        />
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

const mapDispatch = (dispatch: any) => ({
  getClassStats: (id: number) => dispatch(statActions.getClassStats(id)),
  requestFailed: (e: string) => dispatch(actions.requestFailed(e))
});

export default connect(mapState, mapDispatch)(BackToWorkPage);
