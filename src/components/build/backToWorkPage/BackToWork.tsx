import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import axios from "axios";
import { connect } from "react-redux";

import "./BackToWork.scss";
import { User } from "model/user";
import { Brick, BrickStatus } from "model/brick";
import { checkAdmin, checkEditor } from "components/services/brickService";

import DeleteBrickDialog from "components/baseComponents/deleteBrickDialog/DeleteBrickDialog";
import FailedRequestDialog from "components/baseComponents/failedRequestDialog/FailedRequestDialog";
import PrivateCoreToggle from "components/baseComponents/PrivateCoreToggle";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";

import { ReduxCombinedState } from "redux/reducers";
import FilterSidebar from './components/FilterSidebar';
import BackPageTitle from './components/BackPageTitle';
import BackPagePagination from './components/BackPagePagination';
import BackPagePaginationV2 from './components/BackPagePaginationV2';
import BrickBlock from './components/BrickBlock';
import {ThreeColumns, SortBy, Filters } from './model';
import {
  getThreeColumnName, prepareTreeRows, getThreeColumnBrick, expandThreeColumnBrick, prepareVisibleThreeColumnBricks,
} from './threeColumnService';
import {
  clearStatusFilters, filterByStatus, filterBricks, removeInboxFilters, removeAllFilters,
  removeBrickFromList, sortBricks, hideAllBricks, prepareVisibleBricks, expandBrick
} from './service';

interface BackToWorkState {
  finalBricks: Brick[]; // bricks to display
  rawBricks: Brick[]; // loaded bricks

  searchString: string;
  isSearching: boolean;
  sortBy: SortBy;
  sortedIndex: number;
  sortedReversed: boolean;
  deleteDialogOpen: boolean;
  deleteBrickId: number;
  filters: Filters;
  dropdownShown: boolean;
  notificationsShown: boolean;
  failedRequest: boolean;
  shown: boolean;
  isClearFilter: boolean;
  pageSize: number;
  threeColumns: ThreeColumns;
}

export interface BackToWorkProps {
  user: User;
  history: any;
  forgetBrick(): void;

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

    // set mocked bricks for tests
    if (this.props.isMocked && this.props.bricks) {
      threeColumns = prepareTreeRows(this.props.bricks, this.state.filters, this.props.user.id);
      rawBricks = this.props.bricks;
      finalBricks = this.props.bricks;
    }

    let isCore = false;
    const isAdmin = checkAdmin(this.props.user.roles);
    const isEditor = checkEditor(this.props.user.roles)
    if (isAdmin || isEditor) {
      isCore = true;
    }

    this.state = {
      finalBricks,
      rawBricks,
      sortBy: SortBy.None,
      sortedIndex: 0,
      sortedReversed: false,
      deleteDialogOpen: false,
      deleteBrickId: -1,

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

      searchString: "",
      isSearching: false,
      dropdownShown: false,
      notificationsShown: false,
      failedRequest: false,
      shown: true,
      isClearFilter: false,
      pageSize: 18,

      threeColumns,
    };

    // load real bricks
    if (!this.props.isMocked) {
      this.getBricks();
    }
  }

  //region loading and setting bricks

  setBricks(bricks: Brick[]) {
    const threeColumns = prepareTreeRows(bricks, this.state.filters, this.props.user.id);
    this.setState({ ...this.state, finalBricks: bricks, rawBricks: bricks, threeColumns });
  }

  getBricks() {
    const isAdmin = checkAdmin(this.props.user.roles);
    const isEditor = checkEditor(this.props.user.roles);
    if (isAdmin || isEditor) {
      axios.get(process.env.REACT_APP_BACKEND_HOST + "/bricks", {
        withCredentials: true,
      }).then(res => {
        this.setBricks(res.data);
      }).catch(() => this.setState({ ...this.state, failedRequest: true }));
    } else {
      axios.get(process.env.REACT_APP_BACKEND_HOST + "/bricks/currentUser", {
        withCredentials: true,
      }).then((res) => {
        this.setBricks(res.data);
      }).catch(() => {
        this.setState({ ...this.state, failedRequest: true })
      });
    }
  }
  //region loading and setting bricks

  delete(brickId: number) {
    let { rawBricks, finalBricks } = this.state;
    removeBrickFromList(finalBricks, brickId);
    removeBrickFromList(rawBricks, brickId);

    const { publish, draft, review } = this.state.threeColumns;
    removeBrickFromList(publish.finalBricks, brickId);
    removeBrickFromList(publish.rawBricks, brickId);
    removeBrickFromList(draft.finalBricks, brickId);
    removeBrickFromList(draft.rawBricks, brickId);
    removeBrickFromList(review.finalBricks, brickId);
    removeBrickFromList(review.rawBricks, brickId);

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
    const getLongestColumn = () => {
      let draftLength = threeColumns.draft.finalBricks.length;
      let reviewLength = threeColumns.review.finalBricks.length;
      let publishLenght = threeColumns.publish.finalBricks.length;
      return Math.max(draftLength, reviewLength, publishLenght);
    }

    const longest = getLongestColumn();
    const { pageSize } = this.state;

    let index = this.state.sortedIndex;
    if (index + pageSize / 3 <= longest) {
      this.setState({ ...this.state, sortedIndex: index + (pageSize / 3) });
    }
  }

  //region hover for normal bricks
  handleMouseHover(index: number) {
    this.state.finalBricks.forEach(brick => brick.expanded = false);
    this.setState({ ...this.state });
    setTimeout(() => {
      expandBrick(this.state.finalBricks, index);
      this.setState({ ...this.state });
    }, 400);
  }

  handleMouseLeave(key: number) {
    let { finalBricks } = this.state;
    finalBricks.forEach((brick) => (brick.expanded = false));
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
    hideAllBricks(this.state.finalBricks);

    let key = Math.floor(index / 3);
    this.setState({ ...this.state });

    setTimeout(() => {
      hideAllBricks(this.state.finalBricks);
      let name = getThreeColumnName(status);
      expandThreeColumnBrick(this.state.threeColumns, name, key + this.state.sortedIndex);
      this.setState({ ...this.state });
    }, 400);
  }

  onThreeColumnsMouseLeave(index: number, status: BrickStatus) {
    hideAllBricks(this.state.finalBricks);

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
    const finalBricks = filterBricks(this.state.filters, this.state.rawBricks, this.props.user.id);
    this.setState({ ...this.state, filters, finalBricks });
    this.filterClear()
  }

  toggleReviewFilter() {
    const { filters } = this.state;
    removeInboxFilters(filters);
    filters.review = !filters.review;
    const finalBricks = filterBricks(this.state.filters, this.state.rawBricks, this.props.user.id);
    this.setState({ ...this.state, filters, finalBricks, sortedIndex: 0 });
    this.filterClear()
  }

  togglePublishFilter(e: React.ChangeEvent<any>) {
    e.stopPropagation();
    const { filters } = this.state;
    removeInboxFilters(filters);
    filters.publish = !filters.publish;
    const bricks = filterBricks(this.state.filters, this.state.rawBricks, this.props.user.id);
    this.setState({ ...this.state, filters, finalBricks: bricks, sortedIndex: 0 });
    this.filterClear()
  }

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
      const threeColumns = prepareTreeRows(res.data, this.state.filters, this.props.user.id);
      setTimeout(() => {
        this.setState({ ...this.state, finalBricks: res.data, isSearching: true, shown: true, threeColumns });
      }, 1400);
    }).catch(error => {
      this.setState({ ...this.state, failedRequest: true })
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
    const finalBricks = filterBricks(this.state.filters, this.state.rawBricks, this.props.user.id);
    const threeColumns = prepareTreeRows(this.state.rawBricks, this.state.filters, this.props.user.id);
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
        <Grid container direction="row" className="sorted-row">
          <FilterSidebar
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
          <Grid item xs={9} className="brick-row-container">
            <BackPageTitle filters={this.state.filters} />
            <PrivateCoreToggle isCore={this.state.filters.isCore} onSwitch={() => this.toggleCore()} />
            <div className="bricks-list-container">
              <div className="bricks-list">
                {this.renderBricks()}
              </div>
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
        <FailedRequestDialog
          isOpen={this.state.failedRequest}
          close={() => this.setState({ ...this.state, failedRequest: false })}
        />
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

export default connect(mapState)(BackToWorkPage);
