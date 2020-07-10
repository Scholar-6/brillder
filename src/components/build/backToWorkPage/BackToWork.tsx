import React, { Component } from "react";
import { Box, Grid } from "@material-ui/core";
import axios from "axios";
// @ts-ignore
import { connect } from "react-redux";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Grow from "@material-ui/core/Grow";
import sprite from "../../../assets/img/icons-sprite.svg";

import "./BackToWork.scss";
import brickActions from "redux/actions/brickActions";
import { Brick, BrickStatus } from "model/brick";
import { User, UserType } from "model/user";
import LogoutDialog from "components/baseComponents/logoutDialog/LogoutDialog";
import DeleteBrickDialog from "components/baseComponents/deleteBrickDialog/DeleteBrickDialog";
import FailedRequestDialog from "components/baseComponents/failedRequestDialog/FailedRequestDialog";

import ShortBrickDecsiption from "components/baseComponents/ShortBrickDescription";
import ExpandedBrickDecsiption from "components/baseComponents/ExpandedBrickDescription";
import { ReduxCombinedState } from "redux/reducers";
import FilterSidebar from './FilterSidebar';
import BackPageTitle from './BackPageTitle';
import BackPagePagination from './BackPagePagination';
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";


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
  finalBricks: Brick[];
  rawBricks: Brick[];
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
      pageSize: 18
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

  move(brickId: number) {
    this.props.history.push(
      `/build/brick/${brickId}/build/investigation/question`
    );
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

  handleLogoutOpen() {
    this.setState({ ...this.state, logoutDialogOpen: true });
  }

  handleLogoutClose() {
    this.setState({ ...this.state, logoutDialogOpen: false });
  }

  handleDeleteOpen(deleteBrickId: number) {
    this.setState({ ...this.state, deleteDialogOpen: true, deleteBrickId });
  }

  handleDeleteClose() {
    this.setState({ ...this.state, deleteDialogOpen: false });
  }

  creatingBrick() {
    this.props.forgetBrick();
    this.props.history.push("/build/new-brick/subject");
  }

  showDropdown() {
    this.setState({ ...this.state, dropdownShown: true });
  }

  hideDropdown() {
    this.setState({ ...this.state, dropdownShown: false });
  }

  showNotifications() {
    this.setState({ ...this.state, notificationsShown: true });
  }

  hideNotifications() {
    this.setState({ ...this.state, notificationsShown: false });
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

  getSortedBrickContainer = (brick: Brick, key: number, index: number, row: any = 0) => {
    let color = "";
    if (brick.status === BrickStatus.Draft) {
      color = "color1";
    } else if (brick.status === BrickStatus.Review) {
      color = "color2";
    } else if (brick.status === BrickStatus.Build) {
      color = "color3";
    } else if (brick.status === BrickStatus.Publish) {
      color = "color4";
    }

    const isAdmin = this.props.user.roles.some(
      (role: any) => role.roleId === UserType.Admin
    );

    return (
      <Grow
        in={this.state.shown}
        key={key}
        style={{ transformOrigin: "0 0 0" }}
        timeout={index * 150}
      >
        <div className="main-brick-container">
          <Box className={`brick-container ${color}`}>
            <div
              className={`absolute-container brick-row-${row} ${
                brick.expanded ? "brick-hover" : ""
                }`}
              onMouseEnter={() => this.handleMouseHover(key)}
              onMouseLeave={() => this.handleMouseLeave(key)}
            >
              {brick.expanded ? (
                <ExpandedBrickDecsiption
                  isAdmin={isAdmin}
                  color={color}
                  brick={brick}
                  move={(brickId) => this.move(brickId)}
                  onDelete={(brickId) => this.handleDeleteOpen(brickId)}
                />
              ) : (
                  <ShortBrickDecsiption color={color} brick={brick} />
                )}
            </div>
          </Box>
        </div>
      </Grow>
    );
  };

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

  filterByStatus(bricks: Brick[], status: BrickStatus): Brick[] {
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

  toggleBuildFilter() {
    const { filters } = this.state;
    this.removeInboxFilters(filters);
    filters.build = !filters.build;
    const bricks = this.filterBricks(filters);
    this.setState({ ...this.state, filters, finalBricks: bricks, sortedIndex: 0 });
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
    console.log(e.target.checked)
    e.stopPropagation();
    const { filters } = this.state;
    this.removeInboxFilters(filters);
    filters.publish = !filters.publish;
    console.log(e, filters.publish);
    const bricks = this.filterBricks(filters);
    this.setState({ ...this.state, filters, finalBricks: bricks, sortedIndex: 0 });
    this.filterClear()
  }

  searching(searchString: string) {
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
          this.getSortedBrickContainer(this.state.finalBricks[i], i, count, row)
        );
        count++;
      }
    }
    return BackToWork;
  };

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
          <Menu
            className="menu-dropdown"
            keepMounted
            open={this.state.dropdownShown}
            onClose={() => this.hideDropdown()}>
            <MenuItem
              className="first-item menu-item"
              onClick={() => this.props.history.push("/play/dashboard")}>
              View All Bricks
            <Grid
                container
                className="menu-icon-container"
                justify="center"
                alignContent="center">
                <div>
                  <img
                    className="menu-icon"
                    alt=""
                    src="/images/main-page/glasses-white.png"
                  />
                </div>
              </Grid>
            </MenuItem>
            <MenuItem className="menu-item" onClick={() => this.creatingBrick()}>
              Start Building
            <Grid
                container
                className="menu-icon-container"
                justify="center"
                alignContent="center">
                <div>
                  <img
                    className="menu-icon"
                    alt=""
                    src="/images/main-page/create-white.png"
                  />
                </div>
              </Grid>
            </MenuItem>
            {this.props.user.roles.some(
              (role) => role.roleId === UserType.Admin
            ) ? (
                <MenuItem
                  className="menu-item"
                  onClick={() => this.props.history.push("/users")}>
                  Manage Users
                  <Grid
                    container
                    className="menu-icon-container"
                    justify="center"
                    alignContent="center"
                  >
                    <div>
                      <img
                        className="manage-users-icon svg-icon"
                        alt=""
                        src="/images/users.svg"
                      />
                    </div>
                  </Grid>
                </MenuItem>
              ) : (
                ""
              )}
            <MenuItem
              className="view-profile menu-item"
              onClick={() => this.props.history.push("/user-profile")}>
              View Profile
            <Grid
                container
                className="menu-icon-container"
                justify="center"
                alignContent="center">
                <div>
                  <img
                    className="menu-icon svg-icon user-icon"
                    alt=""
                    src="/images/user.svg"
                  />
                </div>
              </Grid>
            </MenuItem>
            <MenuItem
              className="menu-item"
              onClick={() => this.handleLogoutOpen()}>
              Logout
            <Grid
                container
                className="menu-icon-container"
                justify="center"
                alignContent="center">
                <div>
                  <img
                    className="menu-icon svg-icon logout-icon"
                    alt=""
                    src="/images/log-out.svg"
                  />
                </div>
              </Grid>
            </MenuItem>
          </Menu>
          <LogoutDialog
            history={this.props.history}
            isOpen={this.state.logoutDialogOpen}
            close={() => this.handleLogoutClose()}
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
            toggleBuildFilter={() => this.toggleBuildFilter()}
            togglePublishFilter={e => this.togglePublishFilter(e)}
            showAll={() => this.showAll()}
            showBuildAll={() => this.showBuildAll()}
            showEditAll={() => this.showEditAll()}
          />
          <Grid item xs={9} className="brick-row-container">
            <div className="brick-row-title"><BackPageTitle filters={this.state.filters} /></div>
            <div className="bricks-list-container">
              <div className="bricks-list">
                {this.renderSortedBricks()}
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
