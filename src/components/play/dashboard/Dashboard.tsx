/* TODO: KEEP THIS FILE for when clicking 'view all', so copy code from src/build/bricksListPage.tsx
i.e. add back button on menu and row along top of 'my bricks'  6/7/2020 */
import "./Dashboard.scss";
import React, { Component } from "react";
import {
  Box,
  Grid,
  FormControlLabel,
  Radio,
  RadioGroup,
  Hidden,
} from "@material-ui/core";
import { Category } from "./interface";
import axios from "axios";
// @ts-ignore
import { connect } from "react-redux";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import sprite from "../../../assets/img/icons-sprite.svg";

import FailedRequestDialog from "components/baseComponents/failedRequestDialog/FailedRequestDialog";
import SubjectsList from "components/baseComponents/subjectsList/SubjectsList";
import LogoutDialog from "components/baseComponents/logoutDialog/LogoutDialog";
import DeleteBrickDialog from "components/baseComponents/deleteBrickDialog/DeleteBrickDialog";
import authActions from "redux/actions/auth";
import { Brick, BrickStatus } from "model/brick";
import { User, UserType } from "model/user";
import ShortBrickDescription from "components/baseComponents/ShortBrickDescription";
import ExpandedBrickDescription from "components/baseComponents/ExpandedBrickDescription";
import ExpandedMobileBrick from "components/baseComponents/ExpandedMobileBrickDescription";
import PageHeader from "components/baseComponents/pageHeader/PageHeader";
import { ReduxCombinedState } from "redux/reducers";
import brickActions from "redux/actions/brickActions";
import NotificationPanel from "components/baseComponents/notificationPanel/NotificationPanel";
import ReactDOM from "react-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';


const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

const mapDispatch = (dispatch: any) => ({
  logout: () => dispatch(authActions.logout()),
  forgetBrick: () => dispatch(brickActions.forgetBrick()),
});

const connector = connect(mapState, mapDispatch);

interface BricksListProps {
  user: User;
  history: any;
  logout(): void;
  forgetBrick(): void;
}

interface BricksListState {
  yourBricks: Array<Brick>;
  bricks: Array<Brick>;
  searchBricks: Array<Brick>;
  searchString: string;
  isSearching: boolean;
  sortBy: SortBy;
  subjects: any[];
  sortedIndex: number;
  logoutDialogOpen: boolean;
  finalBricks: Brick[];

  dropdownShown: boolean;
  notificationsShown: boolean;
  deleteDialogOpen: boolean;
  deleteBrickId: number;

  filterExpanded: boolean;
  filterHeight: string;
  isClearFilter: any;
  failedRequest: boolean;
  pageSize: number;
}

enum SortBy {
  None,
  Date,
  Popularity,
}

class DashboardPage extends Component<BricksListProps, BricksListState> {
  pageHeader: React.RefObject<any>;

  constructor(props: BricksListProps) {
    super(props);
    this.state = {
      yourBricks: [],
      bricks: [],
      sortBy: SortBy.None,
      subjects: [],
      sortedIndex: 0,
      logoutDialogOpen: false,
      deleteDialogOpen: false,
      deleteBrickId: -1,
      finalBricks: [],
      dropdownShown: false,
      notificationsShown: false,
      searchBricks: [],
      searchString: "",
      isSearching: false,
      pageSize: 15,

      filterExpanded: true,
      filterHeight: "auto",
      isClearFilter: false,
      failedRequest: false,
    };

    axios
      .get(
        process.env.REACT_APP_BACKEND_HOST +
        "/bricks/byStatus/" +
        BrickStatus.Publish,
        { withCredentials: true }
      )
      .then((res) => {
        this.setState({
          ...this.state,
          bricks: res.data,
          finalBricks: res.data as Brick[],
        });
      })
      .catch((error) => {
        alert("Can`t get bricks");
      });

    axios
      .get(process.env.REACT_APP_BACKEND_HOST + "/subjects", {
        withCredentials: true,
      })
      .then((res) => {
        this.setState({ ...this.state, subjects: res.data });
      })
      .catch((error) => {
        alert("Can`t get bricks");
      });

    axios
      .get(process.env.REACT_APP_BACKEND_HOST + "/bricks/currentUser", {
        withCredentials: true,
      })
      .then((res) => {
        let bricks = res.data as Brick[];
        bricks = bricks.filter((brick) => {
          return brick.status === BrickStatus.Publish;
        });
        this.setState({ ...this.state, yourBricks: bricks });
      })
      .catch((error) => {
        this.setState({ ...this.state, failedRequest: true });
      });

    this.pageHeader = React.createRef();
  }

  logout() {
    this.props.logout();
    this.props.history.push("/choose-login");
  }

  delete(brickId: number) {
    let { bricks } = this.state;
    let brick = bricks.find((brick) => brick.id === brickId);
    if (brick) {
      let index = bricks.indexOf(brick);
      bricks.splice(index, 1);
    }

    this.setState({ ...this.state, deleteDialogOpen: false });
  }

  move(brickId: number) {
    this.props.history.push(`/play/brick/${brickId}/intro`);
  }

  handleSortChange = (e: any) => {
    const { state } = this;
    const sortBy = parseInt(e.target.value) as SortBy;
    let { finalBricks } = this.state;
    if (sortBy === SortBy.Date) {
      finalBricks = finalBricks.sort((a, b) => {
        const createdA = new Date(a.created).getTime();
        const createdB = new Date(b.created).getTime();
        return createdA < createdB ? 1 : -1;
      });
    } else if (sortBy === SortBy.Popularity) {
      finalBricks = finalBricks.sort((a, b) =>
        a.attemptsCount > b.attemptsCount ? 1 : -1
      );
    }
    this.setState({ ...state, finalBricks, sortBy });
  };

  getBricksForFilter() {
    if (this.state.isSearching) {
      return this.state.searchBricks;
    } else {
      return this.state.bricks;
    }
  }

  getCheckedSubjectIds() {
    const filterSubjects = [];
    const { state } = this;
    const { subjects } = state;
    for (let subject of subjects) {
      if (subject.checked) {
        filterSubjects.push(subject.id);
      }
    }
    return filterSubjects;
  }

  filter() {
    const { state } = this;
    let bricks = this.getBricksForFilter();
    let filtered = [];

    let filterSubjects = this.getCheckedSubjectIds();

    if (filterSubjects.length > 0) {
      for (let brick of bricks) {
        let res = filterSubjects.indexOf(brick.subjectId);
        if (res !== -1) {
          filtered.push(brick);
        }
      }
      this.setState({ ...state, finalBricks: filtered });
    } else {
      this.setState({ ...state, finalBricks: bricks });
    }
  }

  //region Hide / Expand / Clear Filter
  hideFilter() {
    this.setState({ ...this.state, filterExpanded: false, filterHeight: "0" });
  }
  expandFilter() {
    this.setState({
      ...this.state,
      filterExpanded: true,
      filterHeight: "auto",
    });
  }
  filterClear() {
    this.setState({
      isClearFilter: this.state.subjects.some((r: any) => r.checked)
        ? true
        : false,
    });
  }
  //endregion

  filterBySubject = (i: number) => {
    const { subjects } = this.state;
    subjects[i].checked = !subjects[i].checked;
    this.filter();
  };

  clearSubjects = () => {
    const { state } = this;
    const { subjects } = state;
    subjects.forEach((r: any) => (r.checked = false));
    this.setState({ ...state });
  };

  moveAllBack() {
    let index = this.state.sortedIndex;
    if (index >= this.state.pageSize) {
      this.setState({ ...this.state, sortedIndex: index - this.state.pageSize });
    }
  }

  moveAllNext() {
    let index = this.state.sortedIndex;
    const { pageSize } = this.state;
    if (index + pageSize <= this.state.bricks.length) {
      this.setState({ ...this.state, sortedIndex: index + this.state.pageSize });
    }
  }

  hideBricks() {
    const { finalBricks } = this.state;
    finalBricks.forEach((brick) => {
      brick.expanded = false;
    });
  }

  yourBricksMouseHover(index: number) {
    let { yourBricks, finalBricks } = this.state;
    finalBricks.forEach((brick) => {
      brick.expanded = false;
    });
    yourBricks.forEach((brick) => {
      brick.expanded = false;
    });
    this.setState({ ...this.state });
    setTimeout(() => {
      let { yourBricks } = this.state;
      yourBricks.forEach((brick) => {
        brick.expanded = false;
      });
      if (!yourBricks[index].expandFinished) {
        yourBricks[index].expanded = true;
      }
      this.setState({ ...this.state });
    }, 400);
  }

  yourBricksMouseLeave(key: number) {
    let { yourBricks } = this.state;
    yourBricks.forEach((brick) => {
      brick.expanded = false;
    });
    yourBricks[key].expandFinished = true;
    this.setState({ ...this.state });
    setTimeout(() => {
      yourBricks[key].expandFinished = false;
      this.setState({ ...this.state });
    }, 400);
  }

  handleMouseHover(index: number) {
    this.hideBricks();
    this.setState({ ...this.state });
    setTimeout(() => {
      let { finalBricks } = this.state;
      finalBricks.forEach((brick) => {
        brick.expanded = false;
      });
      if (!finalBricks[index].expandFinished) {
        finalBricks[index].expanded = true;
      }
      this.setState({ ...this.state });
    }, 400);
  }

  handleMobileClick(index: number) {
    let { finalBricks } = this.state;
    if (finalBricks[index].expanded === true) {
      this.hideBricks();
      this.setState({ ...this.state });
      return;
    }
    this.hideBricks();
    finalBricks[index].expanded = true;
    this.setState({ ...this.state });
  }

  handleMouseLeave(key: number) {
    let { finalBricks } = this.state;
    finalBricks.forEach((brick) => {
      brick.expanded = false;
    });
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

  showDropdown() {
    this.setState({ ...this.state, dropdownShown: true });
  }

  hideDropdown() {
    this.setState({ ...this.state, dropdownShown: false });
  }

  showNotifications(event: any) {
    this.setState({ ...this.state, notificationsShown: true });
  }

  hideNotifications() {
    this.setState({ ...this.state, notificationsShown: false });
  }

  keySearch(e: any) {
    if (e.keyCode === 13) {
      this.search();
    }
  }

  search() {
    const { searchString } = this.state;
    axios
      .post(
        process.env.REACT_APP_BACKEND_HOST + "/bricks/search",
        { searchString },
        { withCredentials: true }
      )
      .then((res) => {
        this.hideBricks();
        const searchBricks = res.data.map((brick: any) => brick.body);
        this.setState({
          ...this.state,
          searchBricks,
          finalBricks: searchBricks,
          isSearching: true,
        });
      })
      .catch((error) => {
        alert("Can`t get bricks");
      });
  }

  creatingBrick() {
    this.props.forgetBrick();
    this.props.history.push("/build/new-brick/subject");
  }

  getBrickColor(brick: Brick) {
    let color = "";

    if (!brick.subject) {
      color = "#B0B0AD";
    } else {
      color = brick.subject.color;
    }
    return color;
  }

  renderBrickContainer = (brick: Brick, key: number) => {
    let color = this.getBrickColor(brick);

    const isAdmin = this.props.user.roles.some(
      (role: any) => role.roleId === UserType.Admin
    );

    return (
      <div className="main-brick-container">
        <Box className="brick-container">
          <div
            className={`absolute-container brick-row-0 ${
              brick.expanded ? "brick-hover" : ""
              }`}
            onMouseEnter={() => this.yourBricksMouseHover(key)}
            onMouseLeave={() => this.yourBricksMouseLeave(key)}
          >
            {brick.expanded ? (
              <ExpandedBrickDescription
                isAdmin={isAdmin}
                color={color}
                brick={brick}
                move={(brickId) => this.move(brickId)}
                onDelete={(brickId) => this.handleDeleteOpen(brickId)}
              />
            ) : (
                <ShortBrickDescription brick={brick} />
              )}
          </div>
        </Box>
      </div>
    );
  };

  renderSortedBrickContainer = (brick: Brick, key: number, row: any = 0) => {
    let color = "";

    if (!brick.subject) {
      color = "#B0B0AD";
    } else {
      color = brick.subject.color;
    }

    const isAdmin = this.props.user.roles.some(
      (role: any) => role.roleId === UserType.Admin
    );

    return (
      <div className="main-brick-container">
        <Box className="brick-container">
          <div
            className={`sorted-brick absolute-container brick-row-${row} ${
              brick.expanded ? "brick-hover" : ""
              }`}
            onMouseEnter={() => this.handleMouseHover(key)}
            onMouseLeave={() => this.handleMouseLeave(key)}
          >
            {brick.expanded ? (
              <ExpandedBrickDescription
                isAdmin={isAdmin}
                color={color}
                brick={brick}
                move={(brickId) => this.move(brickId)}
                onDelete={(brickId) => this.handleDeleteOpen(brickId)}
              />
            ) : (
                <ShortBrickDescription brick={brick} color={color} />
              )}
          </div>
        </Box>
      </div>
    );
  };

  renderSortedBricks = () => {
    let { sortedIndex } = this.state;
    let bricksList = [];
    for (let i = 0 + sortedIndex; i < this.state.pageSize + sortedIndex; i++) {
      const { finalBricks } = this.state;
      if (finalBricks[i]) {
        let row = Math.floor(i / 3);
        bricksList.push(this.renderSortedBrickContainer(finalBricks[i], i, row + 1));
      }
    }
    return bricksList;
  };

  //region Mobile
  renderMobileExpandedBrick(brick: Brick) {
    let color = this.getBrickColor(brick);

    return (
      <ExpandedMobileBrick
        brick={brick}
        color={color}
        move={brickId => this.move(brickId)}
      />
    );
  }

  renderSortedMobileBrickContainer = (brick: Brick, key: number, row: any = 0) => {
    let color = this.getBrickColor(brick);

    return (
      <div className="main-brick-container">
        <Box className="brick-container">
          <div
            className={`sorted-brick absolute-container brick-row-${row} ${
              brick.expanded ? "brick-hover" : ""
              }`}
            onClick={() => this.handleMobileClick(key)}
          >
            <ShortBrickDescription
              brick={brick}
              color={color}
              isMobile={true}
              isExpanded={brick.expanded}
              move={() => this.move(brick.id)}
            />
          </div>
        </Box>
      </div>
    );
  };

  renderSortedMobileBricks = () => {
    let { sortedIndex } = this.state;
    let bricksList = [];
    for (let i = 0 + sortedIndex; i < this.state.pageSize + sortedIndex; i++) {
      const { finalBricks } = this.state;
      if (finalBricks[i]) {
        let row = Math.floor(i / 3);
        bricksList.push(this.renderSortedMobileBrickContainer(finalBricks[i], i, row + 1));
      }
    }
    return (
      <Swiper>
        {bricksList.map(b => <SwiperSlide style={{ width: '90vw' }}>{b}</SwiperSlide>)}
      </Swiper>
    );
  }

  renderMobileBricks() {
    let expandedBrick = this.state.finalBricks.find(b => b.expanded === true);

    if (expandedBrick) {
      return this.renderMobileExpandedBrick(expandedBrick);
    }

    let bricksList = [];
    for (const brick of this.state.yourBricks) {
      bricksList.push(<ShortBrickDescription brick={brick} />);
    }
    return (
      <Swiper slidesPerView={2}>
        {bricksList.map(b => <SwiperSlide style={{ width: '50vw' }}>{b}</SwiperSlide>)}
      </Swiper>
    );
  }
  //region Mobile

  renderSortAndFilterBox = () => {
    return (
      <div className="sort-box">
        <div className="filter-container sort-by-box">
          <div className="sort-header">Sort By</div>
          <RadioGroup
            className="sort-group"
            aria-label="SortBy"
            name="SortBy"
            value={this.state.sortBy}
            onChange={this.handleSortChange}
          >
            <Grid container direction="row">
              <Grid item xs={6}>
                <FormControlLabel
                  value={SortBy.Popularity}
                  style={{ marginRight: 0, width: "50%" }}
                  control={<Radio className="sortBy" />}
                  label="Popularity"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  value={SortBy.Date}
                  style={{ marginRight: 0 }}
                  control={<Radio className="sortBy" />}
                  label="Date Added"
                />
              </Grid>
            </Grid>
          </RadioGroup>
        </div>
        <div className="filter-header">
          <span>Filter</span>
          <button
            className={
              "btn-transparent filter-icon " +
              (this.state.filterExpanded
                ? this.state.isClearFilter
                  ? "arrow-cancel"
                  : "arrow-down"
                : "arrow-up")
            }
            onClick={() => {
              this.state.filterExpanded
                ? this.state.isClearFilter
                  ? this.clearSubjects()
                  : this.hideFilter()
                : this.expandFilter();
            }}
          ></button>
        </div>
        <SubjectsList
          subjects={this.state.subjects}
          filterHeight={this.state.filterHeight}
          filterBySubject={this.filterBySubject}
        />
      </div>
    );
  };

  renderYourBrickRow = () => {
    let bricksList = [];
    let index = 0;
    for (let i = index; i < index + 3; i++) {
      const { yourBricks } = this.state;
      if (yourBricks[i]) {
        bricksList.push(this.renderBrickContainer(yourBricks[i], i));
      }
    }
    return bricksList;
  };

  renderPagination() {
    if (this.state.bricks.length <= this.state.pageSize) {
      return "";
    }

    const { pageSize, sortedIndex } = this.state;

    const showPrev = sortedIndex >= pageSize;
    const showNext = sortedIndex + pageSize <= this.state.bricks.length;

    return (
      <Grid container direction="row" className="bricks-pagination">
        <Grid item sm={4} className="left-pagination">
          <div className="first-row">
            {this.state.sortedIndex + 1}-
            {this.state.sortedIndex + pageSize > this.state.bricks.length
              ? this.state.bricks.length
              : this.state.sortedIndex + pageSize}
            <span className="gray"> | {this.state.bricks.length}
            </span>
          </div>
          <div>
            {(this.state.sortedIndex + pageSize) / pageSize}
            <span className="gray"> | {Math.ceil(this.state.bricks.length / pageSize)}
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
    const { history } = this.props;
    return (
      <div className="dashboard-page">
        <div className="page-navigation">
          <div className="btn btn-transparent glasses svgOnHover">
            <svg className="svg w100 h100 active">
              <use href={sprite + "#glasses"} className="text-theme-dark-blue" />
            </svg>
          </div>
        </div>
        <div className="upper-part">
          <PageHeader
            ref={this.pageHeader}
            searchPlaceholder="Search Subjects, Topics, Titles &amp; more"
            search={() => this.search()}
            searching={(v: string) => this.searching(v)}
            showDropdown={() => this.showDropdown()}
            showNotifications={(evt: any) => this.showNotifications(evt)}
          />
          <Menu
            className="menu-dropdown"
            keepMounted
            open={this.state.dropdownShown}
            onClose={() => this.hideDropdown()}
          >
            <MenuItem
              className="first-item menu-item"
              onClick={() => this.creatingBrick()}
            >
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
            <MenuItem
              className="menu-item"
              onClick={() => history.push("/back-to-work")}
            >
              Back To Work
              <Grid
                container
                className="menu-icon-container"
                justify="center"
                alignContent="center"
              >
                <div>
                  <img
                    className="back-to-work-icon"
                    alt=""
                    src="/images/main-page/backToWork-white.png"
                  />
                </div>
              </Grid>
            </MenuItem>
            {this.props.user.roles.some(
              (role) => role.roleId === UserType.Admin
            ) ? (
                <MenuItem
                  className="menu-item"
                  onClick={() => history.push("/users")}
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
              onClick={() => history.push("/user-profile")}
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
          <NotificationPanel
            shown={this.state.notificationsShown}
            handleClose={() => this.hideNotifications()}
            anchorElement={() => ReactDOM.findDOMNode(this.pageHeader.current)}
          />
          <LogoutDialog
            history={this.props.history}
            isOpen={this.state.logoutDialogOpen}
            close={() => this.handleLogoutClose()}
          />
        </div>
        <Hidden only={["sm", "md", "lg", "xl"]}>
          <div className="mobile-scroll-bricks">
            {this.renderMobileBricks()}
          </div>
        </Hidden>
        <Grid container direction="row" className="sorted-row">
          <Grid container item xs={3} className="sort-and-filter-container">
            {this.renderSortAndFilterBox()}
          </Grid>
          <Grid item xs={9} className="brick-row-container">
            <Hidden only={['xs']}>
              <div className="brick-row-title">
                ALL BRICKS
              </div>
              <div className="core-public-toggle">
                <a className="btn btn btn-transparent ">
                  <span>Core</span>
                  <div className="svgOnHover">
                    <svg className="svg active selected">
                      <use href={sprite + "#box"} className="text-theme-dark-blue" />
                    </svg>
                    <svg className="svg active">
                      <use href={sprite + "#globe"} className="text-theme-dark-blue" />
                    </svg>
                  </div>
                  <span>Public</span>
                </a>
              </div>
            </Hidden>
            <Hidden only={["sm", "md", "lg", "xl"]}>
              <div className="brick-row-title" onClick={() => history.push(`/play/dashboard/${Category.New}`)}>
                <a className="btn btn-transparent svgOnHover">
                  <span>New</span>
                  <svg className="svg active">
                    <use href={sprite + "#arrow-down"} className="text-theme-dark-blue" />
                  </svg>
                </a>
              </div>
            </Hidden>
            <div className="bricks-list-container bricks-container-mobile">
              <div className="bricks-list">
                <Hidden only={["xs"]}>
                  {this.renderYourBrickRow()}
                  {this.renderSortedBricks()}
                </Hidden>
                <Hidden only={['sm', 'md', 'lg', 'xl']}>
                  {this.renderSortedMobileBricks()}
                </Hidden>
              </div>
            </div>
            <Hidden only={["sm", "md", "lg", "xl"]}>
              <div className="brick-row-title">
                <a className="btn btn-transparent svgOnHover">
                  <span>Suggest</span>
                  <svg className="svg active">
                    <use href={sprite + "#arrow-right"} className="text-theme-dark-blue" />
                  </svg>
                </a>
              </div>
              <div className="brick-row-title">
                <a className="btn btn-transparent svgOnHover">
                  <span>Top in Humanities</span>
                  <svg className="svg active">
                    <use href={sprite + "#arrow-right"} className="text-theme-dark-blue" />
                  </svg>
                </a>
              </div>
              <div className="brick-row-title">
                <a className="btn btn-transparent svgOnHover">
                  <span>Top in Stem</span>
                  <svg className="svg active">
                    <use href={sprite + "#arrow-right"} className="text-theme-dark-blue" />
                  </svg>
                </a>
              </div>
            </Hidden>
            {this.renderPagination()}
          </Grid>
        </Grid>
        <DeleteBrickDialog
          isOpen={this.state.deleteDialogOpen}
          brickId={this.state.deleteBrickId}
          close={() => this.handleDeleteClose()}
          onDelete={(brickId) => this.delete(brickId)}
        />
        <FailedRequestDialog
          isOpen={this.state.failedRequest}
          close={() => this.setState({ ...this.state, failedRequest: false })}
        />
      </div>
    );
  }
}

export default connector(DashboardPage);
