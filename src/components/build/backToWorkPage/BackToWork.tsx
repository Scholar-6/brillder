import React, { Component } from "react";
import {
  Box,
  Grid,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import axios from "axios";
// @ts-ignore
import { connect } from "react-redux";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Grow from "@material-ui/core/Grow";

import "./BackToWork.scss";
import brickActions from "redux/actions/brickActions";
import { Brick, BrickStatus } from "model/brick";
import { User, UserType } from "model/user";
import LogoutDialog from "components/baseComponents/logoutDialog/LogoutDialog";
import DeleteBrickDialog from "components/baseComponents/deleteBrickDialog/DeleteBrickDialog";
import FailedRequestDialog from "components/baseComponents/failedRequestDialog/FailedRequestDialog";

import ShortBrickDecsiption from "components/baseComponents/ShortBrickDescription";
import ExpandedBrickDecsiption from "components/baseComponents/ExpandedBrickDescription";
import PageHeader from "components/baseComponents/pageHeader/PageHeader";


const mapState = (state: any) => {
  return { user: state.user.user };
};

const mapDispatch = (dispatch: any) => {
  return { forgetBrick: () => dispatch(brickActions.forgetBrick()) };
};

const connector = connect(mapState, mapDispatch);

interface BackToWorkProps {
  user: User;
  history: any;
  forgetBrick(): void;
}

interface Filters {
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
  failedRequest: boolean;
  shown: boolean;

  	filterExpanded: boolean;
	filterHeight: string;
	isClearFilter: any;
}

enum SortBy {
  None,
  Date,
  Popularity,
  Status,
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
      failedRequest: false,
	  shown: true,

	  	filterExpanded: true,
		filterHeight: "auto",
		isClearFilter: false,
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
        this.setState({...this.state, failedRequest: true})
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
        this.setState({...this.state, failedRequest: true})
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

  handleSortChange = (e: any) => {
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
    if (index >= 18) {
      this.setState({ ...this.state, sortedIndex: index - 18 });
    }
  }

  moveAllNext() {
    let index = this.state.sortedIndex;
    if (index + 18 <= this.state.finalBricks.length) {
      this.setState({ ...this.state, sortedIndex: index + 18 });
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

	//region Hide / Expand / Clear Filter
	clearStatus() {
		const { filters } = this.state;
		this.clearStatusFilters(filters);
		this.setState({ ...this.state, filters, bricks: this.state.rawBricks });
		this.filterClear()
	}
	hideFilter() {
		this.setState({ ...this.state, filterExpanded: false, filterHeight: "0" });
	}
	expendFilter() {
		this.setState({ ...this.state, filterExpanded: true, filterHeight: "auto" });
	}
	filterClear(){
		let {draft, review, build, publish} = this.state.filters
		if(draft || review || build || publish){
			 this.setState({ isClearFilter: true})
		}else{
			this.setState({ isClearFilter: false})
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
        <Grid container item xs={4} justify="center" className="column-brick-container">
          <div className="main-brick-container">
            <Box className={`brick-container ${color}`}>
              <div
                className={`absolute-container brick-row-${row} ${
                  brick.expanded ? "brick-hover" : ""
                }`}
                onMouseEnter={() => this.handleMouseHover(key)}
                onMouseLeave={() => this.handleMouseLeave(key)}
              >
                <Grid
                  container
                  direction="row"
                  style={{ padding: 0, position: "relative" }}
                >
                  <Grid item xs={brick.expanded ? 12 : 11}>
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
                  </Grid>
                </Grid>
              </div>
            </Box>
          </div>
        </Grid>
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

  renderIndexesBox = () => {
    let build = 0;
    let edit = 0;
    for (let b of this.state.rawBricks) {
      if (b.status === BrickStatus.Draft) {
        build += 1;
      }
    }

    for (let b of this.state.rawBricks) {
      if (b.status !== BrickStatus.Draft) {
        edit += 1;
      }
    }
    return (
		<div className="sort-box">
		 	<div className="filter-container sort-by-box">
				<div className="sort-header">INBOX</div>
			</div>
			<div className="filter-container indexes-box">
				<div className={"index-box " + (this.state.filters.viewAll ? "active" : "")}
					onClick={() => this.showAll()}>
					View All
					<div className="right-index">{this.state.rawBricks.length}</div>
				</div>
				<div className={"index-box " + (this.state.filters.buildAll ? "active" : "")}
					onClick={() => this.showBuildAll()}>
					Build
					<div className="right-index">{build}</div>
				</div>
				<div className={ "index-box " + (this.state.filters.editAll ? "active" : "")}
					onClick={() => this.showEditAll()}>
					Edit
					<div className="right-index">{edit}</div>
				</div>
			</div>
		</div>
    );
  };

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
	this.setState({ ...this.state, filters, finalBricks: bricks });
	this.filterClear()
  }

  toggleReviewFilter() {
    const { filters } = this.state;
    this.removeInboxFilters(filters);
    filters.review = !filters.review;
    const bricks = this.filterBricks(filters);
	this.setState({ ...this.state, filters, finalBricks: bricks });
	this.filterClear()
  }

  togglePublishFilter() {
    const { filters } = this.state;
    this.removeInboxFilters(filters);
    filters.publish = !filters.publish;
    const bricks = this.filterBricks(filters);
	this.setState({ ...this.state, filters, finalBricks: bricks });
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
      this.setState({...this.state, failedRequest: true})
    });
  }

  renderSortAndFilterBox = () => {
    let draft = 0;
    let review = 0;
    let build = 0;
    let publish = 0;

    for (let b of this.state.rawBricks) {
      if (b.status === BrickStatus.Draft) {
        draft += 1;
      }
    }

    for (let b of this.state.rawBricks) {
      if (b.status === BrickStatus.Review) {
        review += 1;
      }
    }

    for (let b of this.state.rawBricks) {
      if (b.status === BrickStatus.Build) {
        build += 1;
      }
    }

    for (let b of this.state.rawBricks) {
      if (b.status === BrickStatus.Publish) {
        publish += 1;
      }
    }

    return (
		<div className="sort-box">
		 	<div className="filter-container sort-by-box">
				<div className="sort-header">SORT BY</div>
				<RadioGroup className="sort-group"
					aria-label="SortBy"
					name="SortBy"
					value={this.state.sortBy}
					onChange={this.handleSortChange}>
					<Grid container direction="row">
						<Grid item xs={4}>
							<FormControlLabel
								value={SortBy.Status}
								control={<Radio className="sortBy" />}
								label="Status"/>
						</Grid>
						<Grid item xs={4}>
							<FormControlLabel
								value={SortBy.Popularity}
								control={<Radio className="sortBy" />}
								label="Popularity"/>
						</Grid>
						<Grid item xs={4}>
							<FormControlLabel
								value={SortBy.Date}
								control={<Radio className="sortBy" />}
								label="Last Edit"/>
						</Grid>
					</Grid>
				</RadioGroup>
			</div>
			<div className="filter-header">
				<span>Filter</span>
				<button className={"btn-transparent filter-icon " + (this.state.filterExpanded ? this.state.isClearFilter ? ("arrow-cancel") : ("arrow-down") : ("arrow-up")) }
					onClick={() => {this.state.filterExpanded ? this.state.isClearFilter ? this.clearStatus() : (this.hideFilter()) : (this.expendFilter())}}>
				</button>
			</div>
			{this.state.filterExpanded === true ? (
		   	<div className="filter-container subject-indexes-box">
					<div className="index-box color1">
						<FormControlLabel
							checked={this.state.filters.draft}
							onClick={() => this.toggleDraftFilter()}
							control={<Radio className={"filter-radio custom-color"} />}
							label="Draft"/>
						<div className="right-index">{draft}</div>
					</div>
					<div className="index-box color2">
						<FormControlLabel
							checked={this.state.filters.review}
							onClick={() => this.toggleReviewFilter()}
							control={<Radio className={"filter-radio custom-color"} />}
							label="Submitted for Review"/>
						<div className="right-index">{review}</div>
					</div>
					<div className="index-box color3">
						<FormControlLabel
							checked={this.state.filters.build}
							onClick={() => this.toggleBuildFilter()}
							control={<Radio className={"filter-radio custom-color"} />}
							label="Build in Progress"/>
						<div className="right-index">{build}</div>
					</div>
					<div className="index-box color4">
						<FormControlLabel
							checked={this.state.filters.publish}
							onClick={() => this.togglePublishFilter()}
							control={<Radio className={"filter-radio custom-color"} />}
							label="Published"/>
						<div className="right-index">{publish}</div>
					</div>
				</div>
			) : (
			""
			)}
      </div>
    );
  };

  renderSortedBricks = () => {
    let { sortedIndex } = this.state;
    let BackToWork = [];
    let count = 0;
    for (let i = 0 + sortedIndex; i < 18 + sortedIndex; i++) {
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

  renderTitle = () => {
    const { filters } = this.state;
    if (filters.viewAll) {
      return "ALL PROJECTS";
    } else if (filters.buildAll) {
      return "BUILD";
    } else if (filters.editAll) {
      return "EDIT";
    } else if (
      filters.draft &&
      !filters.build &&
      !filters.review &&
      !filters.publish
    ) {
      return "DRAFT";
    } else if (
      !filters.draft &&
      filters.build &&
      !filters.review &&
      !filters.publish
    ) {
      return "BUILD IN PROGRESS";
    } else if (
      !filters.draft &&
      !filters.build &&
      filters.review &&
      !filters.publish
    ) {
      return "REVIEW";
    } else if (
      !filters.draft &&
      !filters.build &&
      !filters.review &&
      filters.publish
    ) {
      return "PUBLISHED";
    } else {
      return "FILTERED";
    }
  };

  renderPagination() {
    if (this.state.finalBricks.length <= 18) {
      return "";
    }

    const showPrev = this.state.sortedIndex >= 18;
    const showNext =
      this.state.sortedIndex + 18 <= this.state.finalBricks.length;

    return (
      <Grid container direction="row" className="bricks-pagination">
        <Grid item xs={4} className="left-pagination">
          <div className="first-row">
            {this.state.sortedIndex + 1}-
            {this.state.sortedIndex + 18 > this.state.finalBricks.length
              ? this.state.finalBricks.length
              : this.state.sortedIndex + 18}
            <span className="gray">
              {" "}
              &nbsp;|&nbsp; {this.state.finalBricks.length}
            </span>
          </div>
          <div>
            {(this.state.sortedIndex + 18) / 18}
            <span className="gray">
              {" "}
              &nbsp;|&nbsp; {Math.ceil(this.state.finalBricks.length / 18)}
            </span>
          </div>
        </Grid>
        <Grid
          container
          item
          xs={4}
          justify="center"
          className="bottom-next-button"
        >
          <div>
            {showPrev ? (
              <ExpandLessIcon
                className={"prev-button " + (showPrev ? "active" : "")}
                onClick={() => this.moveAllBack()}
              />
            ) : (
              ""
            )}
            {showNext ? (
              <ExpandMoreIcon
                className={"next-button " + (showNext ? "active" : "")}
                onClick={() => this.moveAllNext()}
              />
            ) : (
              ""
            )}
          </div>
        </Grid>
      </Grid>
    );
  }

  render() {
    return (
      <div className="back-to-work-page">
        <div className="upper-part">
          <PageHeader
            searchPlaceholder="Search Ongoing Projects & Published Bricks…"
            search={() => this.search()}
            searching={(v) => this.searching(v)}
            showDropdown={() => this.showDropdown()}
          />
          <Grid container direction="row" className="sorted-row">
            <Grid container item xs={3} className="sort-and-filter-container">
							{this.renderIndexesBox()}
							{this.renderSortAndFilterBox()}
            </Grid>
            <Grid item xs={9} className="brick-row-container">
                <div className="brick-row-title">{this.renderTitle()}</div>
                <div className="bricks-list-container">
                  <Grid container direction="row" className="bricks-list">
                    {this.renderSortedBricks()}
                  </Grid>
                </div>
                {this.renderPagination()}
            </Grid>
          </Grid>
        </div>
        <Menu
          className="back-to-work-redirect-dropdown"
          keepMounted
          open={this.state.dropdownShown}
          onClose={() => this.hideDropdown()}
        >
          <MenuItem
            className="first-item menu-item"
            onClick={() => this.props.history.push("/build/bricks-list")}
          >
            View All Bricks
            <Grid
              container
              className="menu-icon-container"
              justify="center"
              alignContent="center"
            >
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
              alignContent="center"
            >
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
              onClick={() => this.props.history.push("/build/users")}
            >
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
            onClick={() => this.props.history.push("/build/user-profile")}
          >
            View Profile
            <Grid
              container
              className="menu-icon-container"
              justify="center"
              alignContent="center"
            >
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
            onClick={() => this.handleLogoutOpen()}
          >
            Logout
            <Grid
              container
              className="menu-icon-container"
              justify="center"
              alignContent="center"
            >
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
        <DeleteBrickDialog
          isOpen={this.state.deleteDialogOpen}
          brickId={this.state.deleteBrickId}
          onDelete={(brickId) => this.delete(brickId)}
          close={() => this.handleDeleteClose()}
        />
        <FailedRequestDialog
          isOpen={this.state.failedRequest}
          close={() => this.setState({...this.state, failedRequest: false})}
        />
      </div>
    );
  }
}

export default connector(BackToWorkPage);
