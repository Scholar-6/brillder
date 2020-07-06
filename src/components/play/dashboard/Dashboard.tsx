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
} from "@material-ui/core";
import axios from "axios";
// @ts-ignore
import { connect } from "react-redux";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import SubjectsList from "components/baseComponents/subjectsList/SubjectsList";
import LogoutDialog from "components/baseComponents/logoutDialog/LogoutDialog";
import DeleteBrickDialog from "components/baseComponents/deleteBrickDialog/DeleteBrickDialog";
import authActions from "redux/actions/auth";
import { Brick, BrickStatus } from "model/brick";
import { User, UserType } from "model/user";
import ShortBrickDescription from "components/baseComponents/ShortBrickDescription";
import ExpandedBrickDescription from "components/baseComponents/ExpandedBrickDescription";
import PageHeader from "components/baseComponents/pageHeader/PageHeader";
import { ReduxCombinedState } from "redux/reducers";


const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

const mapDispatch = (dispatch: any) => ({
  logout: () => dispatch(authActions.logout()),
});

const connector = connect(mapState, mapDispatch);

interface BricksListProps {
  user: User;
  history: any;
  logout(): void;
}

interface BricksListState {
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
  deleteDialogOpen: boolean;
  deleteBrickId: number;

  filterExpanded: boolean;
  filterHeight: string;
  isClearFilter: any;
}

enum SortBy {
  None,
  Date,
  Popularity,
}

class DashboardPage extends Component<BricksListProps, BricksListState> {
  constructor(props: BricksListProps) {
    super(props);
    this.state = {
      bricks: [],
      sortBy: SortBy.None,
      subjects: [],
      sortedIndex: 0,
      logoutDialogOpen: false,
      deleteDialogOpen: false,
      deleteBrickId: -1,
      finalBricks: [],
      dropdownShown: false,
      searchBricks: [],
      searchString: "",
      isSearching: false,

      filterExpanded: true,
      filterHeight: "auto",
      isClearFilter: false,
    };

    axios.get(
      process.env.REACT_APP_BACKEND_HOST + "/bricks/byStatus/" + BrickStatus.Publish,
      { withCredentials: true }
    ).then((res) => {
      this.setState({
        ...this.state,
        bricks: res.data,
        finalBricks: res.data as Brick[],
      });
    }).catch((error) => {
      alert("Can`t get bricks");
    });

    axios.get(process.env.REACT_APP_BACKEND_HOST + "/subjects", {
      withCredentials: true,
    }).then((res) => {
      this.setState({ ...this.state, subjects: res.data });
    }).catch((error) => {
      alert("Can`t get bricks");
    });
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
    this.setState({ ...this.state, filterExpanded: true, filterHeight: "auto" });
  }
  filterClear() {
    this.setState({ isClearFilter: this.state.subjects.some((r: any) => r.checked) ? true : false })
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
    if (index >= 18) {
      this.setState({ ...this.state, sortedIndex: index - 18 });
    }
  }

  moveAllNext() {
    let index = this.state.sortedIndex;
    if (index + 18 <= this.state.bricks.length) {
      this.setState({ ...this.state, sortedIndex: index + 18 });
    }
  }

  hideBricks() {
    const { finalBricks } = this.state;
    finalBricks.forEach((brick) => {
      brick.expanded = false;
    });
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

  getSortedBrickContainer = (brick: Brick, key: number, row: any = 0) => {
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
            <Grid
              container
              direction="row"
              style={{ padding: 0, position: "relative" }}
            >
              <Grid item xs={brick.expanded ? 12 : 11}>
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
              </Grid>
            </Grid>
          </div>
        </Box>
      </div>
    );
  };

  renderSortAndFilterBox = () => {
    return (
      <div className="sort-box">
        <div className="filter-container sort-by-box">
          <div className="sort-header">Sort By</div>
          <RadioGroup className="sort-group"
            aria-label="SortBy"
            name="SortBy"
            value={this.state.sortBy}
            onChange={this.handleSortChange}>
            <Grid container direction="row">
              <Grid item xs={6}>
                <FormControlLabel
                  value={SortBy.Popularity}
                  style={{ marginRight: 0, width: "50%" }}
                  control={<Radio className="sortBy" />}
                  label="Popularity" />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  value={SortBy.Date}
                  style={{ marginRight: 0 }}
                  control={<Radio className="sortBy" />}
                  label="Date Added" />
              </Grid>
            </Grid>
          </RadioGroup>
        </div>
        <div className="filter-header">
          <span>Filter</span>
          <button className={"btn-transparent filter-icon " + (this.state.filterExpanded ? this.state.isClearFilter ? ("arrow-cancel") : ("arrow-down") : ("arrow-up"))}
            onClick={() => { this.state.filterExpanded ? this.state.isClearFilter ? this.clearSubjects() : (this.hideFilter()) : (this.expandFilter()) }}>
          </button>
        </div>
        <SubjectsList
          subjects={this.state.subjects}
          filterHeight={this.state.filterHeight}
          filterBySubject={this.filterBySubject}
        />
      </div>
    );
  };

  renderTitle = () => {
    return "ALL BRICKS";
  };

  renderSortedBricks = () => {
    let { sortedIndex } = this.state;
    let bricksList = [];
    for (let i = 0 + sortedIndex; i < 18 + sortedIndex; i++) {
      if (this.state.finalBricks[i]) {
        let row = Math.floor(i / 3);
        bricksList.push(
          this.getSortedBrickContainer(this.state.finalBricks[i], i, row)
        );
      }
    }
    return bricksList;
  };

  renderPagination() {
    if (this.state.bricks.length <= 18) {
      return "";
    }

    const showPrev = this.state.sortedIndex >= 18;
    const showNext = this.state.sortedIndex + 18 <= this.state.bricks.length;

    return (
      <Grid container direction="row" className="bricks-pagination">
        <Grid item sm={4} className="left-pagination">
          <div className="first-row">
            {this.state.sortedIndex + 1}-
            {this.state.sortedIndex + 18 > this.state.bricks.length
              ? this.state.bricks.length
              : this.state.sortedIndex + 18}
            <span className="gray">
              {" "}
              &nbsp;|&nbsp; {this.state.bricks.length}
            </span>
          </div>
          <div>
            {(this.state.sortedIndex + 18) / 18}
            <span className="gray">
              {" "}
              &nbsp;|&nbsp; {Math.ceil(this.state.bricks.length / 18)}
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
      <div className="dashboard-page bricks-list-page">
        <div className="upper-part">
          <PageHeader
            searchPlaceholder="Search Subjects, Topics, Titles &amp; more"
            search={() => this.search()}
            searching={(v: string) => this.searching(v)}
            showDropdown={() => this.showDropdown()}
          />
          <Grid container direction="row" className="sorted-row">
            <Grid container item xs={3} className="sort-and-filter-container">
              {this.renderSortAndFilterBox()}
            </Grid>
            <Grid item xs={9} className="brick-row-container">
              <div className="brick-row-title">{this.renderTitle()}</div>
              <div className="bricks-list-container">
                <Grid container direction="row">
                  {this.renderSortedBricks()}
                </Grid>
              </div>
              {this.renderPagination()}
            </Grid>
          </Grid>
        </div>
        <Menu
          className="menu-dropdown"
          keepMounted
          open={this.state.dropdownShown}
          onClose={() => this.hideDropdown()}
        >
          <MenuItem
            className="view-profile menu-item"
            onClick={() => this.props.history.push("/user-profile")}
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
          close={() => this.handleDeleteClose()}
          onDelete={(brickId) => this.delete(brickId)}
        />
      </div>
    );
  }
}

export default connector(DashboardPage);
