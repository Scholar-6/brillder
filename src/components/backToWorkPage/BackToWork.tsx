import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import axios from "axios";
import { connect } from "react-redux";

import { ReduxCombinedState } from "redux/reducers";
import actions from 'redux/actions/requestFailed';
import statActions from 'redux/actions/stats';

import "./BackToWork.scss";
import { User } from "model/user";
import { Brick, BrickStatus, Subject } from "model/brick";
import { checkAdmin, checkTeacher, checkEditor } from "components/services/brickService";

import { ThreeColumns, SortBy, Filters, TeachFilters, PlayFilters, ThreeAssignmentColumns } from './model';
import {
  getThreeColumnName, prepareTreeRows, prepareThreeAssignmentRows,
  getThreeColumnBrick, expandThreeColumnBrick, getLongestColumn, expandPlayThreeColumnBrick, getPlayThreeColumnName
} from './threeColumnService';
import {
  filterByStatus, filterBricks, removeInboxFilters, removeAllFilters,
  removeBrickFromLists, sortBricks, hideAllThings, expandBrick
} from './service';
import { loadSubjects } from 'components/services/subject';

import DeleteBrickDialog from "components/baseComponents/deleteBrickDialog/DeleteBrickDialog";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import FilterSidebar from './components/FilterSidebar';
import PlayFilterSidebar from './components/PlayFilterSidebar';
import TeachFilterSidebar from './components/teach/TeachFilterSidebar';
import ClassroomList from './components/teach/ClassroomList';
import BackPagePagination from './components/BackPagePagination';
import BackPagePaginationV2 from './components/BackPagePaginationV2';
import { TeachClassroom } from "model/classroom";
import { getAllClassrooms } from "components/teach/service";
import { getBricks, getCurrentUserBricks, getAssignedBricks } from "components/services/axios/brick";
import AssignedBricks from './components/play/AssignedBricks';
import BuildBricks from './components/build/BuildBricks';

import Tab, { ActiveTab } from './components/Tab';
import { AssignmentBrick, AssignmentBrickStatus } from "model/assignment";

interface BackToWorkState {
  // build
  finalBricks: Brick[]; // bricks to display
  rawBricks: Brick[]; // loaded bricks
  threeColumns: ThreeColumns;

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

  isTeach: boolean;
  isAdmin: boolean;

  filters: Filters;
  playFilters: PlayFilters;

  // teach
  teachFilters: TeachFilters;
  classrooms: TeachClassroom[];
  teachPageSize: number;
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
    let finalBricks: Brick[] = [];
    let rawBricks: Brick[] = [];
    let threeColumns = {
      red: {
        rawBricks: [],
        finalBricks: []
      },
      yellow: {
        rawBricks: [],
        finalBricks: []
      },
      green: {
        rawBricks: [],
        finalBricks: []
      }
    } as ThreeColumns;

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

    let isCore = false;
    const isTeach = checkTeacher(this.props.user.roles);
    const isAdmin = checkAdmin(this.props.user.roles);
    const isEditor = checkEditor(this.props.user.roles)
    if (isAdmin || isEditor) {
      isCore = true;
    }

    // set mocked bricks for tests
    if (this.props.isMocked && this.props.bricks) {
      let testFilters = {
        viewAll: true,
        buildAll: false,
        editAll: false,

        draft: false,
        review: false,
        publish: false,
        isCore
      }
      threeColumns = prepareTreeRows(this.props.bricks, testFilters, this.props.user.id, -1);
      rawBricks = this.props.bricks;
      finalBricks = this.props.bricks;
    }

    this.state = {
      finalBricks,
      rawBricks,
      threeColumns,

      sortBy: SortBy.None,
      sortedIndex: 0,
      sortedReversed: false,
      deleteDialogOpen: false,
      deleteBrickId: -1,
      activeTab: ActiveTab.Play,

      filters: {
        viewAll: true,
        buildAll: false,
        editAll: false,

        draft: false,
        review: false,
        publish: false,
        isCore
      },

      isTeach,
      isAdmin,

      searchString: "",
      isSearching: false,
      dropdownShown: false,
      notificationsShown: false,
      shown: true,
      pageSize: 18,

      generalSubjectId: -1,

      // Teach
      classrooms: [],
      activeClassroom: null,

      teachFilters: {
        assigned: false,
        submitted: false,
        completed: false
      },
      teachPageSize: 4,

      // Play
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
        const generalSubject = subjects.find(s => s.name === "General");
        if (generalSubject) {
          generalSubjectId = generalSubject.id;
        }
        this.setState({ generalSubjectId });
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
  setBricks(rawBricks: Brick[]) {
    const threeColumns = prepareTreeRows(rawBricks, this.state.filters, this.props.user.id, this.state.generalSubjectId);
    this.setState({ ...this.state, finalBricks: rawBricks, rawBricks, threeColumns });
  }

  setPlayBricks(rawBricks: AssignmentBrick[]) {
    const threeColumns = prepareThreeAssignmentRows(rawBricks);
    this.setState({ ...this.state, finalAssignments: rawBricks, rawAssignments: rawBricks, playThreeColumns: threeColumns });
  }

  getBricks() {
    const isAdmin = checkAdmin(this.props.user.roles);
    const isEditor = checkEditor(this.props.user.roles);
    if (isAdmin || isEditor) {
      getBricks().then(bricks => {
        if (bricks) {
          this.setBricks(bricks);
        } else {
          this.props.requestFailed('Can`t get bricks');
        }
      });
    } else {
      getCurrentUserBricks().then(bricks => {
        if (bricks) {
          this.setBricks(bricks);
        } else {
          this.props.requestFailed('Can`t get bricks for current user');
        }
      });
    }
    // get play tab bricks
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
    let { rawBricks, finalBricks, threeColumns } = this.state;
    removeBrickFromLists(rawBricks, finalBricks, threeColumns, brickId);
    this.setState({ ...this.state, deleteDialogOpen: false });
  }

  handleSortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let sortBy = parseInt(e.target.value) as SortBy;
    const { state } = this;
    let bricks = sortBricks(state.finalBricks, sortBy);
    this.setState({ ...state, finalBricks: bricks, sortBy });
  };

  moveAllBack() {
    let index = this.state.sortedIndex;
    if (index >= this.state.pageSize) {
      this.setState({ ...this.state, sortedIndex: index - this.state.pageSize });
    }
  }

  moveAllNext() {
    let index = this.state.sortedIndex;
    if (index + this.state.pageSize <= this.state.finalBricks.length) {
      this.setState({ ...this.state, sortedIndex: index + this.state.pageSize });
    }
  }

  moveThreeColumnsBack() {
    let index = this.state.sortedIndex;
    if (index >= this.state.pageSize / 3) {
      this.setState({ ...this.state, sortedIndex: index - (this.state.pageSize / 3) });
    }
  }

  moveThreeColumnsNext() {
    const { threeColumns } = this.state;
    const longest = getLongestColumn(threeColumns);
    const { pageSize } = this.state;

    let index = this.state.sortedIndex;
    if (index + pageSize / 3 <= longest) {
      this.setState({ ...this.state, sortedIndex: index + (pageSize / 3) });
    }
  }

  //region hover for normal bricks
  handleMouseHover(index: number) {
    hideAllThings(this.state.rawBricks);
    this.setState({ ...this.state });
    setTimeout(() => {
      expandBrick(this.state.finalBricks, this.state.rawBricks, index);
      this.setState({ ...this.state });
    }, 400);
  }

  handleMouseLeave(key: number) {
    let { finalBricks } = this.state;
    hideAllThings(this.state.rawBricks);
    finalBricks[key].expandFinished = true;
    this.setState({ ...this.state });
    setTimeout(() => {
      finalBricks[key].expandFinished = false;
      this.setState({ ...this.state });
    }, 400);
  }
  //region hover for normal bricks

  // region tabs
  setTab(activeTab: ActiveTab) {
    this.deactivateClassrooms();
    this.setState({ activeTab });
  }
  // endregion

  //region hover for three column bricks
  onThreeColumnsMouseHover(index: number, status: BrickStatus) {
    hideAllThings(this.state.rawBricks);

    let key = Math.floor(index / 3);
    this.setState({ ...this.state });

    setTimeout(() => {
      hideAllThings(this.state.rawBricks);
      let name = getThreeColumnName(status);
      expandThreeColumnBrick(this.state.threeColumns, name, key + this.state.sortedIndex);
      this.setState({ ...this.state });
    }, 400);
  }

  onThreeColumnsMouseLeave(index: number, status: BrickStatus) {
    hideAllThings(this.state.rawBricks);

    let key = Math.ceil(index / 3);
    let name = getThreeColumnName(status);
    let brick = getThreeColumnBrick(this.state.threeColumns, name, key + this.state.sortedIndex);

    if (brick) {
      brick.expandFinished = true;
      this.setState({ ...this.state });
      setTimeout(() => {
        if (brick) {
          brick.expandFinished = false;
          this.setState({ ...this.state });
        }
      }, 400);
    }
  }
  //region hover for three column bricks

  handleDeleteOpen(deleteBrickId: number) {
    this.setState({ ...this.state, deleteDialogOpen: true, deleteBrickId });
  }

  handleDeleteClose() {
    this.setState({ ...this.state, deleteDialogOpen: false });
  }

  showAll() {
    const { filters } = this.state;
    removeAllFilters(filters);
    filters.viewAll = true;
    this.setState({ ...this.state, filters, sortedIndex: 0, finalBricks: this.state.rawBricks });
  }

  showEditAll() {
    const { filters } = this.state;
    removeAllFilters(filters);
    filters.editAll = true;
    let bricks = filterByStatus(this.state.rawBricks, BrickStatus.Review);
    bricks.push(...filterByStatus(this.state.rawBricks, BrickStatus.Publish));
    this.setState({ ...this.state, sortedIndex: 0, filters, finalBricks: bricks });
  }

  showBuildAll() {
    const { filters } = this.state;
    removeAllFilters(filters);
    filters.buildAll = true;
    let bricks = filterByStatus(this.state.rawBricks, BrickStatus.Draft);
    this.setState({ ...this.state, sortedIndex: 0, filters, finalBricks: bricks });
  }

  filterUpdated(newFilters: Filters) {
    const { filters } = this.state;
    filters.publish = newFilters.publish;
    filters.review = newFilters.review;
    filters.draft = newFilters.draft;
    removeInboxFilters(filters);
    const finalBricks = filterBricks(this.state.filters, this.state.rawBricks, this.props.user.id, this.state.generalSubjectId);
    this.setState({ ...this.state, filters, finalBricks, sortedIndex: 0 });
  }

  //#region Teach
  teachFilterUpdated(teachFilters: TeachFilters) {
    this.setState({ teachFilters });
  }

  moveTeachNext() {
    let index = this.state.sortedIndex;
    if (index + this.state.teachPageSize < this.state.classrooms.length) {
      this.setState({ ...this.state, sortedIndex: index + this.state.teachPageSize });
    }
  }

  moveTeachBack() {
    let index = this.state.sortedIndex;
    if (index >= this.state.teachPageSize) {
      this.setState({ ...this.state, sortedIndex: index - this.state.teachPageSize });
    }
  }

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
    hideAllThings(this.state.rawAssignments);
    this.setState({ ...this.state });
    setTimeout(() => {
      expandBrick(this.state.finalBricks, this.state.rawBricks, index);
      this.setState({ ...this.state });
    }, 400);
  }

  handlePlayMouseLeave(key: number) {
    let { finalAssignments } = this.state;
    hideAllThings(this.state.rawAssignments);
    finalAssignments[key].brick.expandFinished = true;
    this.setState({ ...this.state });
    setTimeout(() => {
      finalAssignments[key].brick.expandFinished = false;
      this.setState({ ...this.state });
    }, 400);
  }

  onPlayThreeColumnsMouseHover(index: number, status: AssignmentBrickStatus) {
    hideAllThings(this.state.rawAssignments);

    let key = Math.floor(index / 3);
    this.setState({ ...this.state });

    setTimeout(() => {
      hideAllThings(this.state.rawAssignments);
      let name = getPlayThreeColumnName(status);
      expandPlayThreeColumnBrick(this.state.playThreeColumns, name, key + this.state.sortedIndex);
      this.setState({ ...this.state });
    }, 400);
  }

  onPlayThreeColumnsMouseLeave(index: number, status: AssignmentBrickStatus) {
    hideAllThings(this.state.rawAssignments);

    let key = Math.ceil(index / 3);
    let name = getPlayThreeColumnName(status);
    /*
    let brick = getThreeColumnBrick(this.state.threeColumns, name, key + this.state.sortedIndex);

    if (brick) {
      brick.expandFinished = true;
      this.setState({ ...this.state });
      setTimeout(() => {
        if (brick) {
          brick.expandFinished = false;
          this.setState({ ...this.state });
        }
      }, 400);
    }
    */
  }

  playFilterUpdated(playFilters: PlayFilters) {
    this.setState({ playFilters });
  }
  //#endregion

  searching(searchString: string) {
    if (searchString.length === 0) {
      this.setState({
        ...this.state,
        searchString,
        finalBricks: this.state.rawBricks,
        isSearching: false,
      });
    } else {
      this.setState({ ...this.state, searchString });
    }
  }

  search() {
    const { searchString } = this.state;
    this.setState({ ...this.state, shown: false });

    axios.post(
      process.env.REACT_APP_BACKEND_HOST + "/bricks/search",
      { searchString },
      { withCredentials: true }
    ).then((res) => {
      const threeColumns = prepareTreeRows(res.data, this.state.filters, this.props.user.id, this.state.generalSubjectId);
      setTimeout(() => {
        this.setState({ ...this.state, finalBricks: res.data, isSearching: true, shown: true, threeColumns });
      }, 1400);
    }).catch(() => {
      this.props.requestFailed('Can`t get bricks by search');
    });
  }

  toggleCore() {
    const { filters } = this.state;
    filters.isCore = !filters.isCore;
    const finalBricks = filterBricks(this.state.filters, this.state.rawBricks, this.props.user.id, this.state.generalSubjectId);
    const threeColumns = prepareTreeRows(this.state.rawBricks, this.state.filters, this.props.user.id, this.state.generalSubjectId);
    this.setState({ ...this.state, threeColumns, filters, finalBricks });
  }

  renderTeachPagination = () => {
    let itemsCount = this.state.classrooms.length;
    if (this.state.activeClassroom) {
      itemsCount = this.state.activeClassroom.assignments.length;
    }
    return <BackPagePagination
      sortedIndex={this.state.sortedIndex}
      pageSize={this.state.teachPageSize}
      bricksLength={itemsCount}
      moveNext={() => this.moveTeachNext()}
      moveBack={() => this.moveTeachBack()}
    />
  }

  renderBuildPagination = () => {
    let { sortedIndex, pageSize, finalBricks } = this.state;

    if (this.state.filters.viewAll) {
      return (
        <BackPagePaginationV2
          sortedIndex={sortedIndex}
          pageSize={pageSize}
          threeColumns={this.state.threeColumns}
          moveNext={() => this.moveThreeColumnsNext()}
          moveBack={() => this.moveThreeColumnsBack()}
        />
      )
    }
    return (
      <BackPagePagination
        sortedIndex={sortedIndex}
        pageSize={pageSize}
        bricksLength={finalBricks.length}
        moveNext={() => this.moveAllNext()}
        moveBack={() => this.moveAllBack()}
      />
    );
  }

  renderPagination = () => {
    if (this.state.activeTab === ActiveTab.Teach) {
      return this.renderTeachPagination();
    }
    return this.renderBuildPagination();
  }

  renderFilterSidebar() {
    if (this.state.activeTab === ActiveTab.Play) {
      return <PlayFilterSidebar
        classrooms={this.state.classrooms}
        rawBricks={this.state.rawBricks}
        setActiveClassroom={this.setActiveClassroom.bind(this)}
        filterChanged={this.playFilterUpdated.bind(this)}
      />
    } else if (this.state.activeTab === ActiveTab.Teach) {
      return <TeachFilterSidebar
        classrooms={this.state.classrooms}
        setActiveClassroom={this.setActiveClassroom.bind(this)}
        filterChanged={this.teachFilterUpdated.bind(this)}
      />
    }
    return <FilterSidebar
      rawBricks={this.state.rawBricks}
      filters={this.state.filters}
      sortBy={this.state.sortBy}
      handleSortChange={e => this.handleSortChange(e)}
      showAll={() => this.showAll()}
      showBuildAll={() => this.showBuildAll()}
      showEditAll={() => this.showEditAll()}
      filterChanged={this.filterUpdated.bind(this)}
    />
  }

  render() {
    const { activeTab } = this.state;
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
        <Grid container direction="row" className="sorted-row">
          {this.renderFilterSidebar()}
          <Grid item xs={9} className="brick-row-container">
            <Tab isTeach={this.state.isTeach || this.state.isAdmin} activeTab={activeTab} setTab={t => this.setTab(t)} />
            <div className="tab-content">
              {
                activeTab === ActiveTab.Build ? <BuildBricks
                  user={this.props.user}
                  finalBricks={this.state.finalBricks}
                  threeColumns={this.state.threeColumns}
                  shown={this.state.shown}
                  pageSize={this.state.pageSize}
                  sortedIndex={this.state.sortedIndex}
                  history={this.props.history}
                  filters={this.state.filters}
                  toggleCore={() => this.toggleCore()}
                  handleDeleteOpen={this.handleDeleteOpen.bind(this)}
                  handleMouseHover={this.handleMouseHover.bind(this)}
                  handleMouseLeave={this.handleMouseLeave.bind(this)}
                  onThreeColumnsMouseHover={this.onThreeColumnsMouseHover.bind(this)}
                  onThreeColumnsMouseLeave={this.onThreeColumnsMouseLeave.bind(this)}
                /> : ""
              }
              {
                activeTab === ActiveTab.Teach ? <ClassroomList
                  startIndex={this.state.sortedIndex}
                  activeClassroom={this.state.activeClassroom}
                  pageSize={this.state.teachPageSize}
                  classrooms={this.state.classrooms}
                /> : ""
              }
              {
                activeTab === ActiveTab.Play ? <AssignedBricks
                  user={this.props.user}
                  shown={true}
                  pageSize={this.state.pageSize}
                  sortedIndex={this.state.sortedIndex}
                  threeColumns={this.state.playThreeColumns}
                  history={this.props.history}
                  handleDeleteOpen={brickId => this.handleDeleteOpen(brickId)}
                  onThreeColumnsMouseHover={this.onPlayThreeColumnsMouseHover.bind(this)}
                  onThreeColumnsMouseLeave={this.onPlayThreeColumnsMouseLeave.bind(this)}
                /> : ""
              }
              {this.renderPagination()}
            </div>
          </Grid>
        </Grid>
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
