import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import axios from "axios";
import { connect } from "react-redux";

import "./BackToWork.scss";
import { User } from "model/user";
import { Brick, BrickStatus, Subject } from "model/brick";
import { checkAdmin, checkEditor } from "components/services/brickService";
import { ReduxCombinedState } from "redux/reducers";
import actions from 'redux/actions/requestFailed';
import { ThreeColumns, SortBy, Filters, TeachFilters, PlayFilters } from './model';
import {
  getThreeColumnName, prepareTreeRows, getThreeColumnBrick, expandThreeColumnBrick, prepareVisibleThreeColumnBricks, getLongestColumn
} from './threeColumnService';
import {
  clearStatusFilters, filterByStatus, filterBricks, removeInboxFilters, removeAllFilters,
  removeBrickFromLists, sortBricks, hideAllBricks, prepareVisibleBricks, expandBrick
} from './service';
import { loadSubjects } from 'components/services/subject';

import DeleteBrickDialog from "components/baseComponents/deleteBrickDialog/DeleteBrickDialog";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import FilterSidebar from './components/FilterSidebar';
import PlayFilterSidebar from './components/PlayFilterSidebar';
import TeachFilterSidebar from './components/TeachFilterSidebar';
import BackPagePagination from './components/BackPagePagination';
import BackPagePaginationV2 from './components/BackPagePaginationV2';
import BrickBlock from './components/BrickBlock';
import PrivateCoreToggle from 'components/baseComponents/PrivateCoreToggle';
import ClassroomList from './components/ClassroomList';
import { TeachClassroom } from "model/classroom";
import { getAllClassrooms } from "components/teach/service";

enum ActiveTab {
  Play,
  Build,
  Teach
}

interface BackToWorkState {
  finalBricks: Brick[]; // bricks to display
  rawBricks: Brick[]; // loaded bricks
  classrooms: TeachClassroom[];

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
  isClearFilter: boolean;
  pageSize: number;
  threeColumns: ThreeColumns;
  generalSubjectId: number;
  activeTab: ActiveTab;

  filters: Filters;
  playFilters: PlayFilters;
  teachFilters: TeachFilters;
}

export interface BackToWorkProps {
  user: User;
  history: any;
  forgetBrick(): void;
  requestFailed(e: string): void;

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
      draft: {
        rawBricks: [],
        finalBricks: []
      },
      review: {
        rawBricks: [],
        finalBricks: []
      },
      publish: {
        rawBricks: [],
        finalBricks: []
      },
    } as ThreeColumns;

    let isCore = false;
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
        build: false,
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
      sortBy: SortBy.None,
      sortedIndex: 0,
      sortedReversed: false,
      deleteDialogOpen: false,
      deleteBrickId: -1,
      activeTab: ActiveTab.Play,
      classrooms: [],

      filters: {
        viewAll: true,
        buildAll: false,
        editAll: false,

        draft: false,
        review: false,
        build: false,
        publish: false,
        isCore
      },

      teachFilters: {
        assigned: false,
        submitted: false,
        completed: false
      },

      playFilters: {
        completed: false,
        submitted: false,
        checked: false
      },

      searchString: "",
      isSearching: false,
      dropdownShown: false,
      notificationsShown: false,
      shown: true,
      isClearFilter: false,
      pageSize: 18,

      threeColumns,
      generalSubjectId: -1,
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

  getBricks() {
    const isAdmin = checkAdmin(this.props.user.roles);
    const isEditor = checkEditor(this.props.user.roles);
    if (isAdmin || isEditor) {
      axios.get(process.env.REACT_APP_BACKEND_HOST + "/bricks", {
        withCredentials: true,
      }).then(res => {
        this.setBricks(res.data);
      }).catch(() => {
        this.props.requestFailed('Can`t get bricks');
      });
    } else {
      axios.get(process.env.REACT_APP_BACKEND_HOST + "/bricks/currentUser", {
        withCredentials: true,
      }).then((res) => {
        this.setBricks(res.data);
      }).catch(() => {
        this.props.requestFailed('Can`t get bricks for current user');
      });
    }
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
    hideAllBricks(this.state.rawBricks);
    this.setState({ ...this.state });
    setTimeout(() => {
      expandBrick(this.state.finalBricks, this.state.rawBricks, index);
      this.setState({ ...this.state });
    }, 400);
  }

  handleMouseLeave(key: number) {
    let { finalBricks } = this.state;
    hideAllBricks(this.state.rawBricks);
    finalBricks[key].expandFinished = true;
    this.setState({ ...this.state });
    setTimeout(() => {
      finalBricks[key].expandFinished = false;
      this.setState({ ...this.state });
    }, 400);
  }
  //region hover for normal bricks

  //region hover for three column bricks
  onThreeColumnsMouseHover(index: number, status: BrickStatus) {
    hideAllBricks(this.state.rawBricks);

    let key = Math.floor(index / 3);
    this.setState({ ...this.state });

    setTimeout(() => {
      hideAllBricks(this.state.rawBricks);
      let name = getThreeColumnName(status);
      expandThreeColumnBrick(this.state.threeColumns, name, key + this.state.sortedIndex);
      this.setState({ ...this.state });
    }, 400);
  }

  onThreeColumnsMouseLeave(index: number, status: BrickStatus) {
    hideAllBricks(this.state.rawBricks);

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

  //region Hide / Expand / Clear Filter
  clearStatus() {
    const { filters } = this.state;
    clearStatusFilters(filters);
    this.setState({ ...this.state, sortedIndex: 0, filters });
    this.filterClear();
  }

  filterClear() {
    let { draft, review, build, publish } = this.state.filters
    if (draft || review || build || publish) {
      this.setState({ isClearFilter: true, sortedIndex: 0 })
    } else {
      this.setState({ isClearFilter: false, sortedIndex: 0 })
    }
  }
  //endregion

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

  /* Teach */
  setActiveClassroom(id: number) {
    const { classrooms } = this.state;
    for (let classroom of classrooms) {
      classroom.active = false;
    }
    let classroom = classrooms.find(c => c.id === id);
    if (classroom) {
      classroom.active = true;
      this.setState({ classrooms });
    }
  }
  /* Teach */

  showBuildAll() {
    const { filters } = this.state;
    removeAllFilters(filters);
    filters.buildAll = true;
    let bricks = filterByStatus(this.state.rawBricks, BrickStatus.Draft);
    this.setState({ ...this.state, sortedIndex: 0, filters, finalBricks: bricks });
  }

  toggleDraftFilter() {
    const { filters } = this.state;
    removeInboxFilters(filters);
    filters.draft = !filters.draft;
    const finalBricks = filterBricks(this.state.filters, this.state.rawBricks, this.props.user.id, this.state.generalSubjectId);
    this.setState({ ...this.state, filters, finalBricks });
    this.filterClear()
  }

  toggleReviewFilter() {
    const { filters } = this.state;
    removeInboxFilters(filters);
    filters.review = !filters.review;
    const finalBricks = filterBricks(this.state.filters, this.state.rawBricks, this.props.user.id, this.state.generalSubjectId);
    this.setState({ ...this.state, filters, finalBricks, sortedIndex: 0 });
    this.filterClear()
  }

  togglePublishFilter(e: React.ChangeEvent<any>) {
    e.stopPropagation();
    const { filters } = this.state;
    removeInboxFilters(filters);
    filters.publish = !filters.publish;
    const bricks = filterBricks(this.state.filters, this.state.rawBricks, this.props.user.id, this.state.generalSubjectId);
    this.setState({ ...this.state, filters, finalBricks: bricks, sortedIndex: 0 });
    this.filterClear()
  }

  // region Teach
  teachFilterUpdated(teachFilters: TeachFilters) {
    this.setState({ teachFilters });
  }
  // endregion 

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

  renderSortedBricks = () => {
    const data = prepareVisibleBricks(this.state.sortedIndex, this.state.pageSize, this.state.finalBricks)

    return data.map(item => {
      return <BrickBlock
        brick={item.brick}
        index={item.index}
        row={item.row}
        user={this.props.user}
        key={item.index}
        shown={this.state.shown}
        history={this.props.history}
        handleDeleteOpen={brickId => this.handleDeleteOpen(brickId)}
        handleMouseHover={() => this.handleMouseHover(item.key)}
        handleMouseLeave={() => this.handleMouseLeave(item.key)}
      />
    });
  };

  toggleCore() {
    const { filters } = this.state;
    filters.isCore = !filters.isCore;
    const finalBricks = filterBricks(this.state.filters, this.state.rawBricks, this.props.user.id, this.state.generalSubjectId);
    const threeColumns = prepareTreeRows(this.state.rawBricks, this.state.filters, this.props.user.id, this.state.generalSubjectId);
    this.setState({ ...this.state, threeColumns, filters, finalBricks });
  }

  renderGroupedBricks = () => {
    const data = prepareVisibleThreeColumnBricks(this.state.pageSize, this.state.sortedIndex, this.state.threeColumns);

    return data.map(item => {
      return <BrickBlock
        brick={item.brick}
        index={item.key}
        row={item.row}
        key={item.key}
        user={this.props.user}
        shown={this.state.shown}
        history={this.props.history}
        handleDeleteOpen={brickId => this.handleDeleteOpen(brickId)}
        handleMouseHover={() => this.onThreeColumnsMouseHover(item.key, item.brick.status)}
        handleMouseLeave={() => this.onThreeColumnsMouseLeave(item.key, item.brick.status)}
      />
    });
  }

  renderBricks = () => {
    if (this.state.filters.viewAll) {
      return this.renderGroupedBricks();
    }
    return this.renderSortedBricks();
  }

  renderPagination = () => {
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

  renderFilterSidebar() {
    if (this.state.activeTab === ActiveTab.Play) {
      return <PlayFilterSidebar
        rawBricks={this.state.rawBricks}
        filters={this.state.filters}
        sortBy={this.state.sortBy}
        isClearFilter={this.state.isClearFilter}
        handleSortChange={e => this.handleSortChange(e)}
        clearStatus={() => this.clearStatus()}
        toggleDraftFilter={() => this.toggleDraftFilter()}
        toggleReviewFilter={() => this.toggleReviewFilter()}
        togglePublishFilter={e => this.togglePublishFilter(e)}
        showAll={() => this.showAll()}
        showBuildAll={() => this.showBuildAll()}
        showEditAll={() => this.showEditAll()}
      />
    } else if (this.state.activeTab === ActiveTab.Teach) {
      return <TeachFilterSidebar
        classrooms={this.state.classrooms}
        setActiveClassroom={id => this.setActiveClassroom(id)}
        filterChanged={this.teachFilterUpdated.bind(this)}
      />
    }
    return <FilterSidebar
      rawBricks={this.state.rawBricks}
      filters={this.state.filters}
      sortBy={this.state.sortBy}
      isClearFilter={this.state.isClearFilter}
      handleSortChange={e => this.handleSortChange(e)}
      clearStatus={() => this.clearStatus()}
      toggleDraftFilter={() => this.toggleDraftFilter()}
      toggleReviewFilter={() => this.toggleReviewFilter()}
      togglePublishFilter={e => this.togglePublishFilter(e)}
      showAll={() => this.showAll()}
      showBuildAll={() => this.showBuildAll()}
      showEditAll={() => this.showEditAll()}
    />
  }

  renderBricksList() {
    return (
      <div className="bricks-list-container">
        <PrivateCoreToggle
          isCore={this.state.filters.isCore}
          onSwitch={() => this.toggleCore()}
        />
        <div className="bricks-list">
          {this.renderBricks()}
        </div>
      </div>
    );
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
            <div className="tab-container">
              <div className={activeTab === ActiveTab.Teach ? 'active' : ''} onClick={() => this.setState({ activeTab: ActiveTab.Teach })}>Teach</div>
              <div className={activeTab === ActiveTab.Build ? 'active' : ''} onClick={() => this.setState({ activeTab: ActiveTab.Build })}>Build</div>
              <div className={activeTab === ActiveTab.Play ? 'active' : ''} onClick={() => this.setState({ activeTab: ActiveTab.Play })}>Play</div>
            </div>
            <div className="tab-content">
              {
                activeTab === ActiveTab.Build ? this.renderBricksList() : ""
              }
              {
                activeTab === ActiveTab.Teach ? <ClassroomList classrooms={this.state.classrooms} /> : ""
              }
            </div>
            {this.renderPagination()}
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
  requestFailed: (e: string) => dispatch(actions.requestFailed(e)),
});

export default connect(mapState, mapDispatch)(BackToWorkPage);
