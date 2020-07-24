import "./bricksListPage.scss";
import React, { Component } from "react";
import {
  Box, Grid, FormControlLabel, Radio, RadioGroup, Hidden,
} from "@material-ui/core";
import axios from "axios";
// @ts-ignore
import { connect } from "react-redux";
import Grow from "@material-ui/core/Grow";
import sprite from "../../../assets/img/icons-sprite.svg";

import brickActions from "redux/actions/brickActions";
import SubjectsList from "components/baseComponents/subjectsList/SubjectsList";
import { Brick, BrickStatus } from "model/brick";
import { User, UserType } from "model/user";
import LogoutDialog from "components/baseComponents/logoutDialog/LogoutDialog";
import DeleteBrickDialog from "components/baseComponents/deleteBrickDialog/DeleteBrickDialog";
import FailedRequestDialog from "components/baseComponents/failedRequestDialog/FailedRequestDialog";

import ShortBrickDescription from "components/baseComponents/ShortBrickDescription";
import ExpandedBrickDescription from "components/baseComponents/ExpandedBrickDescription";
import PageHeader from "components/baseComponents/pageHeader/PageHeader";
import { ReduxCombinedState } from "redux/reducers";


const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

const mapDispatch = (dispatch: any) => ({
  forgetBrick: () => dispatch(brickActions.forgetBrick()),
});

const connector = connect(mapState, mapDispatch);

interface BricksListProps {
  user: User;
  history: any;
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
  yoursIndex: number;
  yoursReversed: boolean;
  sortedIndex: number;
  logoutDialogOpen: boolean;
  failedRequest: boolean;
  finalBricks: Brick[];

  deleteDialogOpen: boolean;
  deleteBrickId: number;

  dropdownShown: boolean;
  shown: boolean;

  filterExpanded: boolean;
  filterHeight: any;
  isClearFilter: any;
}

enum SortBy {
  None,
  Date,
  Popularity,
}

class BricksListPage extends Component<BricksListProps, BricksListState> {
  constructor(props: BricksListProps) {
    super(props);
    this.state = {
      yourBricks: [],
      bricks: [],
      sortBy: SortBy.None,
      subjects: [],
      yoursIndex: 0,
      yoursReversed: false,
      sortedIndex: 0,
      logoutDialogOpen: false,
      deleteDialogOpen: false,
      failedRequest: false,
      deleteBrickId: -1,
      finalBricks: [],

      searchBricks: [],
      searchString: "",
      isSearching: false,

      dropdownShown: false,
      shown: true,

      filterExpanded: true,
      filterHeight: "auto",
      isClearFilter: false,
    };

    axios.get(process.env.REACT_APP_BACKEND_HOST + "/bricks/currentUser", {
      withCredentials: true,
    }).then((res) => {
      let bricks = res.data as Brick[];
      bricks = bricks.filter((brick) => {
        return brick.status === BrickStatus.Publish;
      });
      this.setState({ ...this.state, yourBricks: bricks });
    }).catch((error) => {
      this.setState({ ...this.state, failedRequest: true });
    });

    axios.get(
      `${process.env.REACT_APP_BACKEND_HOST}/bricks/byStatus/${BrickStatus.Publish}`,
      { withCredentials: true }
    ).then((res) => {
      this.setState({
        ...this.state,
        bricks: res.data,
        finalBricks: res.data as Brick[],
      });
    }).catch((error) => {
      this.setState({ ...this.state, failedRequest: true });
    });

    axios.get(process.env.REACT_APP_BACKEND_HOST + "/subjects", {
      withCredentials: true,
    }).then((res) => {
      this.setState({ ...this.state, subjects: res.data });
    }).catch((error) => {
      this.setState({ ...this.state, failedRequest: true });
    });
  }

  delete(brickId: number) {
    let { bricks, yourBricks } = this.state;
    let brick = bricks.find((brick) => brick.id === brickId);
    if (brick) {
      let index = bricks.indexOf(brick);
      bricks.splice(index, 1);
    }

    brick = yourBricks.find((brick) => brick.id === brickId);
    if (brick) {
      let index = yourBricks.indexOf(brick);
      yourBricks.splice(index, 1);
    }

    this.setState({ ...this.state, deleteDialogOpen: false });
  }

  move(brickId: number) {
    this.props.history.push(
      `/build/brick/${brickId}/build/investigation/question`
    );
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
    this.filterClear()
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
      this.setState({ finalBricks: filtered });
    } else {
      this.setState({ finalBricks: bricks });
    }


  }

  getSubjectRow(brick: Brick) {
    return `${brick.subject ? brick.subject.name : "SUBJECT Code"} | No. ${
      brick.attemptsCount
      } of Plays`;
  }

  filterBySubject = (i: number) => {
    let { subjects } = this.state;
    subjects[i].checked = !subjects[i].checked;
    this.filter();
  };

  clearSubjects = () => {
    const { state } = this;
    const { subjects } = state;
    subjects.forEach((r: any) => (r.checked = false));
    this.filter();
  };

  moveAllBack() {
    let index = this.state.sortedIndex;
    if (index >= 15) {
      this.setState({ ...this.state, sortedIndex: index - 15 });
    }
  }

  moveAllNext() {
    let index = this.state.sortedIndex;
    if (index + 15 <= this.state.bricks.length) {
      this.setState({ ...this.state, sortedIndex: index + 15 });
    }
  }

  getBrickContainer = (brick: Brick, key: number) => {
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

  handleMouseHover(index: number) {
    let { finalBricks } = this.state;
    finalBricks.forEach((brick) => {
      brick.expanded = false;
    });
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
    let { bricks, yourBricks } = this.state;
    yourBricks.forEach((brick) => {
      brick.expanded = false;
    });
    bricks.forEach((brick) => {
      brick.expanded = false;
    });
    bricks[key].expandFinished = true;
    this.setState({ ...this.state });
    setTimeout(() => {
      bricks[key].expandFinished = false;
      this.setState({ ...this.state });
    }, 400);
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

  keySearch(e: any) {
    if (e.keyCode === 13) {
      this.search();
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
      this.setState({ ...this.state, failedRequest: true });
    });
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

  getSortedBrickContainer = (brick: Brick, key: number, index: number, row: any = 0) => {
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
      <Grow
        in={this.state.shown}
        key={key}
        style={{ transformOrigin: "0 0 0" }}
        timeout={index * 150}
      >
        <div className="main-brick-container">
          <Box className="brick-container">
            <div
              className={`absolute-container brick-row-${row + 1} ${
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
      </Grow>
    );
  };

  renderYourBrickRow = () => {
    let bricksList = [];
    let index = 0;
    for (let i = index; i < index + 3; i++) {
      if (this.state.yourBricks[i]) {
        bricksList.push(this.getBrickContainer(this.state.yourBricks[i], i));
      }
    }
    return bricksList;
  };

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
            onChange={this.handleSortChange}>
            <Grid container direction="row">
              <Grid item xs={6}>
                <FormControlLabel
                  value={SortBy.Popularity}
                  style={{ marginRight: 0, width: "47.5%" }}
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
    let count = 0;
    for (let i = 0 + sortedIndex; i < 15 + sortedIndex; i++) {
      if (this.state.finalBricks[i]) {
        let row = Math.floor(count / 3);
        bricksList.push(
          this.getSortedBrickContainer(this.state.finalBricks[i], i, count, row)
        );
        count++;
      }
    }
    return bricksList;
  };

  renderPagination() {
    if (this.state.bricks.length <= 15) {
      return "";
    }

    const showPrev = this.state.sortedIndex >= 15;
    const showNext = this.state.sortedIndex + 15 <= this.state.bricks.length;

    return (
      <Grid container direction="row" className="bricks-pagination">
        <Grid item xs={4} className="left-pagination">
          <div className="first-row">
            {this.state.sortedIndex + 1}-
            {this.state.sortedIndex + 15 > this.state.bricks.length
              ? this.state.bricks.length
              : this.state.sortedIndex + 15}
            <span className="gray">
              {" "}
              &nbsp;|&nbsp; {this.state.bricks.length}
            </span>
          </div>
          <div>
            {(this.state.sortedIndex + 15) / 15}
            <span className="gray">
              {" "}
              &nbsp;|&nbsp; {Math.ceil(this.state.bricks.length / 15)}
            </span>
          </div>
        </Grid>
        <Grid container item xs={4} justify="center">
          <div className="bottom-next-button">
            {showPrev ? (
              <button className={"btn btn-transparent prev-button svgOnHover " + (showPrev ? "active" : "")}
                onClick={() => this.moveAllBack()}>
                <svg className="svg w100 h100 active">
                  {/*eslint-disable-next-line*/}
                  <use href={sprite + "#arrow-up"} />
                </svg>
              </button>
            ) : (
                ""
              )}
            {showNext ? (
              <button
                className={"btn btn-transparent next-button svgOnHover " + (showNext ? "active" : "")}
                onClick={() => this.moveAllNext()}>
                <svg className="svg w100 h100 active">
                  {/*eslint-disable-next-line*/}
                  <use href={sprite + "#arrow-down"} />
                </svg>
              </button>
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
      <div className="bricks-list-page">
        <PageHeader
          searchPlaceholder="Search Subjects, Topics, Titles & more"
          search={() => this.search()}
          searching={(v: string) => this.searching(v)}
          showDropdown={() => this.showDropdown()}
        />
        <LogoutDialog
          history={this.props.history}
          isOpen={this.state.logoutDialogOpen}
          close={() => this.handleLogoutClose()}
        />
        <Grid container direction="row" className="sorted-row">
          <Hidden only={['xs']}>
            <Grid container item sm={3} className="sort-and-filter-container">
              {this.renderSortAndFilterBox()}
            </Grid>
          </Hidden>
          <Grid item sm={9} xs={12} className="brick-row-container">
            <div className="brick-row-title">{this.renderTitle()}</div>
            <div className="bricks-list-container">
              <div className="bricks-list">
                {this.renderYourBrickRow()}
                {this.renderSortedBricks()}
              </div>
            </div>
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

export default connector(BricksListPage);
