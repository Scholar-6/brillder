import React, { Component } from "react";
import { Box, Grid } from "@material-ui/core";
import axios from "axios";
// @ts-ignore
import { connect } from "react-redux";
import Grow from "@material-ui/core/Grow";

import "./BackToWork.scss";
import brickActions from "redux/actions/brickActions";
import { Brick, BrickStatus } from "model/brick";
import { User, UserType } from "model/user";
import DeleteBrickDialog from "components/baseComponents/deleteBrickDialog/DeleteBrickDialog";
import FailedRequestDialog from "components/baseComponents/failedRequestDialog/FailedRequestDialog";

import ShortBrickDecsiption from "components/baseComponents/ShortBrickDescription";
import ExpandedBrickDecsiption from "components/baseComponents/ExpandedBrickDescription";
import { ReduxCombinedState } from "redux/reducers";
import FilterSidebar from './FilterSidebar';
import BackPageTitle from './BackPageTitle';
import BackPagePagination from './BackPagePagination';
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import BrickBlock from './BrickBlock';


const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

const mapDispatch = (dispatch: any) => ({
  forgetBrick: () => dispatch(brickActions.forgetBrick())
});

const connector = connect(mapState, mapDispatch);

interface BackToWorkProps {
  user: User;
  history: any;
  forgetBrick(): void;
}

export enum SortBy {
  None,
  Date,
  Popularity,
  Status,
}

export interface Filters {
  viewAll: boolean;
  buildAll: boolean;
  editAll: boolean;

  draft: boolean;
  review: boolean;
  build: boolean;
  publish: boolean;
}

interface BackToWorkState {
  bricks: Brick[];
  finalBricks: Brick[]; // bricks to display
  rawBricks: Brick[]; // loaded bricks

  searchBricks: Array<Brick>;
  searchString: string;
  isSearching: boolean;
  sortBy: SortBy;
  sortedIndex: number;
  sortedReversed: boolean;
  logoutDialogOpen: boolean;
  deleteDialogOpen: boolean;
  deleteBrickId: number;
  filters: Filters;
  dropdownShown: boolean;
  notificationsShown: boolean;
  failedRequest: boolean;
  shown: boolean;
  isClearFilter: boolean;
  pageSize: number;
  threeColumns: any;
}

class BackToWorkPage extends Component<BackToWorkProps, BackToWorkState> {
  constructor(props: BackToWorkProps) {
    super(props);
    this.state = {
      bricks: [],
      finalBricks: [],
      rawBricks: [],
      sortBy: SortBy.None,
      sortedIndex: 0,
      sortedReversed: false,
      logoutDialogOpen: false,
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
      },

      searchBricks: [],
      searchString: "",
      isSearching: false,
      dropdownShown: false,
      notificationsShown: false,
      failedRequest: false,
      shown: true,
      isClearFilter: false,
      pageSize: 18,

      threeColumns: {
        draft: {
          
        },
        review: {

        },
        publish: {

        },
      }
    };

    const isAdmin = this.props.user.roles.some(
      (role) => role.roleId === UserType.Admin
    );
    if (isAdmin) {
      axios.get(process.env.REACT_APP_BACKEND_HOST + "/bricks", {
        withCredentials: true,
      }).then((res) => {
        this.setState({
          ...this.state,
          bricks: res.data,
          finalBricks: res.data,
          rawBricks: res.data,
        });
      }).catch(() => {
        this.setState({ ...this.state, failedRequest: true })
      });
    } else {
      axios.get(process.env.REACT_APP_BACKEND_HOST + "/bricks/currentUser", {
        withCredentials: true,
      }).then((res) => {
        this.setState({
          ...this.state,
          bricks: res.data,
          finalBricks: res.data,
          rawBricks: res.data,
        });
      }).catch((error) => {
        this.setState({ ...this.state, failedRequest: true })
      });
    }
  }

  delete(brickId: number) {
    let { finalBricks, searchBricks, bricks } = this.state;
    let brick = finalBricks.find((brick) => brick.id === brickId);
    if (brick) {
      let index = finalBricks.indexOf(brick);
      if (index >= 0) {
        finalBricks.splice(index, 1);
      }

      index = bricks.indexOf(brick);
      if (index >= 0) {
        bricks.splice(index, 1);
      }

      index = searchBricks.indexOf(brick);
      if (index >= 0) {
        this.state.searchBricks.splice(index, 1);
      }
    }
    this.setState({ ...this.state, deleteDialogOpen: false });
  }

  handleSortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let sortBy = parseInt(e.target.value) as SortBy;
    const { state } = this;
    let bricks = Object.assign([], state.finalBricks) as Brick[];
    if (sortBy === SortBy.Date) {
      bricks = bricks.sort((a, b) => {
        const createdA = new Date(a.updated).getTime();
        const createdB = new Date(b.updated).getTime();
        return createdA > createdB ? 1 : -1;
      });
    } else if (sortBy === SortBy.Status) {
      bricks = bricks.sort((a, b) => (a.status > b.status ? 1 : -1));
    } else if (sortBy === SortBy.Popularity) {
      bricks = bricks.sort((a, b) =>
        a.attemptsCount > b.attemptsCount ? 1 : -1
      );
    }
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

  handleMouseHover(index: number) {
    this.state.finalBricks.forEach((brick) => (brick.expanded = false));
    this.setState({ ...this.state });
    setTimeout(() => {
      let { finalBricks } = this.state;
      finalBricks.forEach((brick) => (brick.expanded = false));
      if (!finalBricks[index].expandFinished) {
        finalBricks[index].expanded = true;
      }
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

  handleDeleteOpen(deleteBrickId: number) {
    this.setState({ ...this.state, deleteDialogOpen: true, deleteBrickId });
  }

  handleDeleteClose() {
    this.setState({ ...this.state, deleteDialogOpen: false });
  }

  //region Hide / Expand / Clear Filter
  clearStatus() {
    const { filters } = this.state;
    this.clearStatusFilters(filters);
    this.setState({ ...this.state, filters, bricks: this.state.rawBricks });
    this.filterClear()
  }

  filterClear() {
    let { draft, review, build, publish } = this.state.filters
    if (draft || review || build || publish) {
      this.setState({ isClearFilter: true })
    } else {
      this.setState({ isClearFilter: false })
    }
    // this.setState({ isClearFilter: this.state.bricks.some((r: any) => r.checked) ? true : false})
  }
  //endregion

  clearStatusFilters(filters: Filters) {
    filters.draft = false;
    filters.build = false;
    filters.review = false;
    filters.publish = false;
  }

  removeAllFilters(filters: Filters) {
    filters.viewAll = false;
    filters.buildAll = false;
    filters.editAll = false;
    this.clearStatusFilters(filters);
  }

  showAll() {
    const { filters } = this.state;
    this.removeAllFilters(filters);
    filters.viewAll = true;
    this.setState({
      ...this.state,
      filters,
      finalBricks: this.state.rawBricks,
    });
  }

  showEditAll() {
    const { filters } = this.state;
    this.removeAllFilters(filters);
    filters.editAll = true;
    let bricks = this.filterByStatus(this.state.rawBricks, BrickStatus.Review);
    bricks.push(
      ...this.filterByStatus(this.state.rawBricks, BrickStatus.Publish)
    );
    this.setState({ ...this.state, filters, finalBricks: bricks });
  }

  showBuildAll() {
    const { filters } = this.state;
    this.removeAllFilters(filters);
    filters.buildAll = true;
    let bricks = this.filterByStatus(this.state.rawBricks, BrickStatus.Draft);
    this.setState({ ...this.state, filters, finalBricks: bricks });
  }

  filterByStatus(bricks: Brick[], status: BrickStatus) {
    return bricks.filter((b) => b.status === status);
  }

  filterBricks(filters: Filters): Brick[] {
    let filteredBricks: Brick[] = [];
    let bricks = Object.assign([], this.state.rawBricks) as Brick[];
    if (filters.draft) {
      filteredBricks.push(...this.filterByStatus(bricks, BrickStatus.Draft));
    }
    if (filters.build) {
      filteredBricks.push(...this.filterByStatus(bricks, BrickStatus.Build));
    }
    if (filters.review) {
      filteredBricks.push(...this.filterByStatus(bricks, BrickStatus.Review));
    }
    if (filters.publish) {
      filteredBricks.push(...this.filterByStatus(bricks, BrickStatus.Publish));
    }

    if (
      !filters.draft &&
      !filters.build &&
      !filters.review &&
      !filters.publish
    ) {
      return bricks;
    }
    return filteredBricks;
  }

  removeInboxFilters(filters: Filters) {
    filters.viewAll = false;
    filters.buildAll = false;
    filters.editAll = false;
  }

  toggleDraftFilter() {
    const { filters } = this.state;
    this.removeInboxFilters(filters);
    filters.draft = !filters.draft;
    const bricks = this.filterBricks(filters);
    this.setState({ ...this.state, filters, finalBricks: bricks });
    this.filterClear()
  }

  toggleReviewFilter() {
    const { filters } = this.state;
    this.removeInboxFilters(filters);
    filters.review = !filters.review;
    const bricks = this.filterBricks(filters);
    this.setState({ ...this.state, filters, finalBricks: bricks, sortedIndex: 0 });
    this.filterClear()
  }

  togglePublishFilter(e: React.ChangeEvent<any>) {
    e.stopPropagation();
    const { filters } = this.state;
    this.removeInboxFilters(filters);
    filters.publish = !filters.publish;
    const bricks = this.filterBricks(filters);
    this.setState({ ...this.state, filters, finalBricks: bricks, sortedIndex: 0 });
    this.filterClear()
  }

  searching(searchString: string) {
    console.log(this.state.bricks);
    if (searchString.length === 0) {
      this.setState({
        ...this.state,
        searchString,
        finalBricks: this.state.bricks,
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
      const searchBricks = res.data.map((brick: any) => brick.body);
      setTimeout(() => {
        this.setState({
          ...this.state,
          searchBricks,
          finalBricks: searchBricks,
          isSearching: true,
          shown: true,
        });
      }, 1400);
    }).catch((error) => {
      this.setState({ ...this.state, failedRequest: true })
    });
  }

  renderSortedBricks = () => {
    let { sortedIndex } = this.state;
    let BackToWork = [];
    let count = 0;
    for (let i = 0 + sortedIndex; i < this.state.pageSize + sortedIndex; i++) {
      if (this.state.finalBricks[i]) {
        let row = Math.floor(count / 3);
        BackToWork.push(
          <BrickBlock
            brick={this.state.finalBricks[i]}
            key={i}
            index={count}
            row={row}
            user={this.props.user}
            shown={this.state.shown}
            history={this.props.history}
            handleDeleteOpen={brickId => this.handleDeleteOpen(brickId)}
            handleMouseHover={key => this.handleMouseHover(key)}
            handleMouseLeave={key => this.handleMouseLeave(key)}
          />
        );
        count++;
      }
    }
    return BackToWork;
  };

  renderGroupedBricks = () => {
    return "";
  }

  renderBricks = () => {
    if (this.state.filters.viewAll) {
      return this.renderGroupedBricks();
    }
    return this.renderSortedBricks();
  }

  render() {
    return (
      <div className="back-to-work-page">
        <div className="upper-part">
          <PageHeadWithMenu
            page={PageEnum.BackToWork}
            user={this.props.user}
            placeholder={"Search Ongoing Projects & Published Bricks…"}
            history={this.props.history}
            search={() => this.search()}
            searching={(v: string) => this.searching(v)}
          />
        </div>
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

            <div className="bricks-list-container">
              <div className="bricks-list">
                {this.renderBricks()}
              </div>
            </div>

            <BackPagePagination
              sortedIndex={this.state.sortedIndex}
              pageSize={this.state.pageSize}
              bricksLength={this.state.finalBricks.length}
              moveNext={() => this.moveAllNext()}
              moveBack={() => this.moveAllBack()}
            />
          </Grid>
        </Grid>
        <DeleteBrickDialog
          isOpen={this.state.deleteDialogOpen}
          brickId={this.state.deleteBrickId}
          onDelete={(brickId) => this.delete(brickId)}
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

export default connector(BackToWorkPage);
