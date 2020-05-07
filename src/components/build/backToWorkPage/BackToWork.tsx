import React, { Component } from 'react';
import { Box, Grid, FormControlLabel, Radio, RadioGroup, Checkbox } from '@material-ui/core';
import axios from 'axios';
// @ts-ignore
import { connect } from 'react-redux';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ClearIcon from '@material-ui/icons/Clear';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import './BackToWork.scss';
import brickActions from 'redux/actions/brickActions';
import { Brick, BrickStatus } from 'model/brick';
import { User, UserType } from 'model/user';
import HomeButton from 'components/baseComponents/homeButton/HomeButton';
import LogoutDialog from 'components/baseComponents/logoutDialog/LogoutDialog';
import DeleteBrickDialog from 'components/baseComponents/deleteBrickDialog/DeleteBrickDialog';
import {getAuthorRow} from 'components/services/brickService';

const mapState = (state: any) => {
  return { user: state.user.user }
}

const mapDispatch = (dispatch: any) => {
  return { forgetBrick: () => dispatch(brickActions.forgetBrick()) }
}

const connector = connect(mapState, mapDispatch);

interface BackToWorkProps {
  user: User,
  history: any;
  forgetBrick(): void;
}

interface Filters {
  viewAll: boolean
  buildAll: boolean
  editAll: boolean

  draft: boolean
  review: boolean
  build: boolean
  publish: boolean
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
  filterExpanded: boolean;
  filters: Filters;
  dropdownShown: boolean;
}

enum SortBy {
  None,
  Date,
  Popularity,
  Status
}

class BackToWorkPage extends Component<BackToWorkProps, BackToWorkState> {
  constructor(props: BackToWorkProps) {
    super(props)
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

      filterExpanded: true,
      filters: {
        viewAll: true,
        buildAll: false,
        editAll: false,

        draft: false,
        review: false,
        build: false,
        publish: false
      },

      searchBricks: [],
      searchString: '',
      isSearching: false,
      dropdownShown: false,
    };

    const isAdmin = this.props.user.roles.some(role => role.roleId === UserType.Admin);
    if (isAdmin) {
      axios.get(process.env.REACT_APP_BACKEND_HOST + '/bricks', {withCredentials: true})
        .then(res => {  
          this.setState({...this.state, bricks: res.data, finalBricks: res.data, rawBricks: res.data });
        })
        .catch(error => {
          alert('Can`t get bricks');
        });
    } else {
      axios.get(process.env.REACT_APP_BACKEND_HOST + '/bricks/currentUser', {withCredentials: true})
        .then((res) => { 
          this.setState({...this.state, bricks: res.data, finalBricks: res.data, rawBricks: res.data });
        })
        .catch(error => {
          alert('Can`t get bricks')
        });
    }
  }

  delete(brickId: number) {
    let {finalBricks, searchBricks, bricks} = this.state;
    let brick = finalBricks.find(brick => brick.id === brickId);
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
    this.setState({...this.state, deleteDialogOpen: false});
  }

  move(brickId:number) {
    this.props.history.push(`/build/brick/${brickId}/build/investigation/question`)
  }

  handleSortChange = (e: any) => {
    let sortBy = parseInt(e.target.value) as SortBy;
    const {state} = this;
    let bricks = Object.assign([], state.finalBricks) as Brick[];
    if (sortBy === SortBy.Date) {
      bricks = bricks.sort((a, b) => {
        const createdA = new Date(a.updated).getTime();
        const createdB = new Date(b.updated).getTime();
        return (createdA > createdB) ? 1 : -1;
      });
    } else if (sortBy === SortBy.Status) {
      bricks = bricks.sort((a, b) => ((a.status > b.status) ? 1 : -1));
    } else if (sortBy === SortBy.Popularity) {
      bricks = bricks.sort((a, b) => ((a.attemptsCount > b.attemptsCount) ? 1 : -1));
    }
    this.setState({...state, finalBricks: bricks, sortBy})
  }

  moveAllBack() {
    let index = this.state.sortedIndex;
    if (index >= 18) {
      this.setState({...this.state, sortedIndex: index - 18});
    }
  }

  moveAllNext() {
    let index = this.state.sortedIndex;
    if (index + 18 <= this.state.finalBricks.length) {
      this.setState({...this.state, sortedIndex: index + 18});
    }
  }

  handleMouseHover(index: number) {
    this.state.finalBricks.forEach(brick => brick.expanded = false);
    this.setState({...this.state});
    setTimeout(() => {
      let {finalBricks} = this.state;
      finalBricks.forEach(brick => brick.expanded = false);
      if (!finalBricks[index].expandFinished) {
        finalBricks[index].expanded = true;
      }
      this.setState({...this.state});
    }, 400);
  }

  handleMouseLeave(key: number) {
    let {finalBricks} = this.state;
    finalBricks.forEach(brick => brick.expanded = false);
    finalBricks[key].expandFinished = true;
    this.setState({...this.state});
    setTimeout(() => {
      finalBricks[key].expandFinished = false;
      this.setState({...this.state});
    }, 400);
  }

  handleLogoutOpen() {
    this.setState({...this.state, logoutDialogOpen: true})
  }

  handleLogoutClose() {
    this.setState({...this.state, logoutDialogOpen: false})
  }

  handleDeleteOpen(deleteBrickId: number) {
    this.setState({...this.state, deleteDialogOpen: true, deleteBrickId })
  }

  handleDeleteClose() {
    this.setState({...this.state, deleteDialogOpen: false})
  }

  creatingBrick() {
    this.props.forgetBrick();
    this.props.history.push('/build/new-brick/subject');
  }

  showDropdown() {
    this.setState({...this.state, dropdownShown: true});
  }

  hideDropdown() {
    this.setState({...this.state, dropdownShown: false});
  }

  getSortedBrickContainer = (brick: Brick, key: number, row: any = 0) => {
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
    return (
      <Grid container key={key} item xs={4} justify="center">
        <div className="main-brick-container">
          <Box className={`brick-container ${color}`}>
            <div
              className={`absolute-container brick-row-${row} ${brick.expanded ? 'brick-hover' : ''}`}
              onMouseEnter={() => this.handleMouseHover(key)}
              onMouseLeave={() => this.handleMouseLeave(key)}
            >
              <Grid container direction="row" style={{padding: 0, position: 'relative'}}>
                <Grid item xs={brick.expanded ? 12 : 11}>
                  {
                    brick.expanded ?
                      <div className="expended-brick-info">
                        <div className="hover-text">
                          <div className="link-description">{brick.title}</div>
                          <div className="link-info">{brick.subTopic} | {brick.alternativeTopics}</div>
                          <div className="link-info">
                            {getAuthorRow(brick)}
                          </div>
                          <div className="hovered-open-question link-info">{brick.openQuestion}</div>
                          <div className="link-info">{brick.subject ? brick.subject.name : 'SUBJECT Code'} | No. {brick.attemptsCount} of Plays</div>
                          <div className="link-info">Editor: Name Surname</div>
                        </div>
                      <Grid container direction="row" className="hover-icons-row" alignContent="flex-end">
                        <Grid item xs={4} container justify="flex-start">
                          <div className="round-button"></div>
                        </Grid>
                        <Grid item xs={4} container justify="flex-start">
                          {
                            (this.props.user.roles.some(role => role.roleId === UserType.Admin))
                              ? <img alt="bin" onClick={() => this.handleDeleteOpen(brick.id)} className="bin-button" src="/images/brick-list/bin.png" />
                              : ""
                          }
                        </Grid>
                        <Grid item xs={4} container justify="flex-end">
                          <img
                            alt="play"
                            className="play-button"
                            onClick={() => this.move(brick.id)}
                            src="/images/brick-list/play.png"
                          />
                        </Grid>
                      </Grid>
                    </div>
                    :
                    <div>
                      <div className={`left-brick-circle ${color}`}><div className="round-button"></div></div>
                      <div className="short-brick-info">
                        <div className="link-description">{brick.title}</div>
                        <div className="link-info">{brick.subTopic} | {brick.alternativeTopics}</div>
                        <div className="link-info">
                          {getAuthorRow(brick)}
                        </div>
                      </div>
                    </div>
                  }
              </Grid>
            </Grid>
            </div>
          </Box>
        </div>
      </Grid>
    );
  }

  clearStatusFilters(filters: Filters) {
    filters.draft = false;
    filters.build = false;
    filters.review = false;
    filters.publish = false;
  }

  removeStatusFilters() {
    const {filters} = this.state;
    this.clearStatusFilters(filters);
    this.setState({...this.state, filters, bricks: this.state.rawBricks});
  }

  removeAllFilters(filters: Filters) {
    filters.viewAll = false;
    filters.buildAll = false;
    filters.editAll = false;
    this.clearStatusFilters(filters);
  }

  showAll() {
    const {filters} = this.state;
    this.removeAllFilters(filters);
    filters.viewAll = true;
    this.setState({...this.state, filters, finalBricks: this.state.rawBricks});
  }

  showEditAll() {
    const {filters} = this.state;
    this.removeAllFilters(filters);
    filters.editAll = true;
    let bricks = this.filterByStatus(this.state.rawBricks, BrickStatus.Review)
    bricks.push(...this.filterByStatus(this.state.rawBricks, BrickStatus.Publish))
    this.setState({...this.state, filters, finalBricks: bricks});
  }

  showBuildAll() {
    const {filters} = this.state;
    this.removeAllFilters(filters);
    filters.buildAll = true;
    let bricks = this.filterByStatus(this.state.rawBricks, BrickStatus.Draft)
    this.setState({...this.state, filters, finalBricks: bricks });
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
      <div className="indexes-box">
        <div className="sort-header">INBOX</div>
        <div className={"index-box " + ((this.state.filters.viewAll) ? "active" : "")} onClick={() => this.showAll()}>
          View All
          <div className="right-index">{this.state.rawBricks.length}</div>
        </div>
        <div className={"index-box " + ((this.state.filters.buildAll) ? "active" : "")} onClick={() => this.showBuildAll()}>
          Build
          <div className="right-index">{build}</div>
        </div>
        <div className={"index-box " + ((this.state.filters.editAll) ? "active" : "")} onClick={() => this.showEditAll()}>
          Edit
          <div className="right-index">{edit}</div>
        </div>
      </div>
    );
  }

  filterByStatus(bricks: Brick[], status: BrickStatus): Brick[] {
    return bricks.filter(b => b.status === status);
  }

  filterBricks(filters: Filters): Brick[] {
    let filteredBricks:Brick[] = [];
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

    if (!filters.draft && !filters.build && !filters.review && !filters.publish) {
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
    const {filters} = this.state;
    this.removeInboxFilters(filters);
    filters.draft = !filters.draft;
    const bricks = this.filterBricks(filters);
    this.setState({...this.state, filters, finalBricks: bricks });
  }

  toggleBuildFilter() {
    const {filters} = this.state;
    this.removeInboxFilters(filters);
    filters.build = !filters.build;
    const bricks = this.filterBricks(filters);
    this.setState({...this.state, filters, finalBricks: bricks });
  }

  toggleReviewFilter() {
    const {filters} = this.state;
    this.removeInboxFilters(filters);
    filters.review = !filters.review;
    const bricks = this.filterBricks(filters);
    this.setState({...this.state, filters, finalBricks: bricks });
  }

  togglePublishFilter() {
    const {filters} = this.state;
    this.removeInboxFilters(filters);
    filters.publish = !filters.publish;
    const bricks = this.filterBricks(filters);
    this.setState({...this.state, filters, finalBricks: bricks });
  }

  
  searching(searchString: string) {
    if (searchString.length === 0) {
      this.setState({...this.state, searchString, finalBricks: this.state.bricks, isSearching: false});
    } else {
      this.setState({...this.state, searchString});
    }
  }

  keySearch(e: any) {
    if (e.keyCode === 13) {
      this.search();
    }
  }

  search() {
    const {searchString} = this.state;
    axios.post(
      process.env.REACT_APP_BACKEND_HOST + '/bricks/search',
      {searchString},
      {withCredentials: true}
    ).then(res => {
      const searchBricks = res.data.map((brick: any) => brick.body);
      this.setState({...this.state, searchBricks, finalBricks: searchBricks, isSearching: true});
    }).catch(error => { 
      alert('Can`t get bricks');
    });
  }

  renderSortAndFilterBox = () => {
    const {filters} = this.state;

    let filterPresent = (filters.draft || filters.build || filters.review || filters.publish) ? true : false;

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
      <div className="back-sort-box">
        <div className="sort-header">SORT BY</div>
        <RadioGroup
          className="sort-group"
          aria-label="SortBy"
          name="SortBy"
          value={this.state.sortBy}
          onChange={this.handleSortChange}
        >
          <FormControlLabel value={SortBy.Status} control={<Radio className="sortBy" />} label="Status" />
          <FormControlLabel value={SortBy.Popularity} control={<Radio className="sortBy" />} label="Popularity" />
          <FormControlLabel value={SortBy.Date} control={<Radio className="sortBy" />} label="Last Edit" />
        </RadioGroup>
        <div className="filter-header">
          <div style={{ display: 'inline' }}>
            <span className='filter-control'>FILTER</span>
            {
              this.state.filterExpanded
                ? <ExpandLessIcon className='filter-control' style={{ fontSize: '3vw' }}
                    onClick={() => this.setState({ ...this.state, filterExpanded: false })} />
                : <ExpandMoreIcon className='filter-control' style={{ fontSize: '3vw' }}
                    onClick={() => this.setState({ ...this.state, filterExpanded: true })} />
            }
            {
              filterPresent
              ? <ClearIcon className='filter-control' style={{ fontSize: '2vw' }}
                  onClick={() => this.removeStatusFilters()} />
              : ''
            }
          </div>
        </div>
        { this.state.filterExpanded === true ?
        <div className="filter-items">
        <div className="filter-container color1">
          <FormControlLabel
            className="filter-radio-label"
            value={this.state.filters.draft}
            control={<Checkbox checked={this.state.filters.draft} className={"filter-radio sort-by"} />}
            onChange={() => this.toggleDraftFilter()}
            label="Draft"
            labelPlacement="end"
          />
          <div className="right-index">{draft}</div>
        </div>
        <div className="filter-container color2">
          <FormControlLabel
            className="filter-radio-label"
            value={this.state.filters.review}
            control={<Checkbox checked={this.state.filters.review} className={"filter-radio sort-by"} />}
            onChange={() => this.toggleReviewFilter()}
            label="Submitted for Review"
            labelPlacement="end"
          />
          <div className="right-index">{review}</div>
        </div>
        <div className="filter-container color3">
          <FormControlLabel
            className="filter-radio-label"
            value={this.state.filters.build}
            control={<Checkbox checked={this.state.filters.build} className={"filter-radio sort-by"} />}
            onChange={() => this.toggleBuildFilter()}
            label="Build in Progress"
            labelPlacement="end"
          />
          <div className="right-index">{build}</div>
        </div>
        <div className="filter-container color4">
          <FormControlLabel
            className="filter-radio-label"
            value={this.state.filters.publish}
            control={<Checkbox checked={this.state.filters.publish} className={"filter-radio sort-by"} />}
            onChange={() => this.togglePublishFilter()}
            label="Published"
            labelPlacement="end"
          />
          <div className="right-index">{publish}</div>
        </div>
        </div>
        : ""
  }
      </div>
    );
  }

  renderSortedBricks = () => {
    let {sortedIndex} = this.state;
    let BackToWork = [];
    let count = 0;
    for (let i = 0 + sortedIndex; i < 18 + sortedIndex; i++) {
      if (this.state.finalBricks[i]) {
        let row = Math.floor(count / 3);
        BackToWork.push(this.getSortedBrickContainer(this.state.finalBricks[i], i, row));
        count++;
      }
    }
    return BackToWork
  }

  renderTitle = () => {
    const {filters} = this.state;
    if (filters.viewAll) {
      return "ALL PROJECTS";
    } else if (filters.buildAll) {
      return "BUILD";
    } else if (filters.editAll) {
      return "EDIT";
    } else if (filters.draft && !filters.build && !filters.review && !filters.publish) {
      return "DRAFT";
    } else if (!filters.draft && filters.build && !filters.review && !filters.publish) {
      return "BUILD IN PROGRESS";
    } else if (!filters.draft && !filters.build && filters.review && !filters.publish) {
      return "REVIEW";
    } else if (!filters.draft && !filters.build && !filters.review && filters.publish) {
      return "PUBLISHED";
    } else {
      return "FILTERED";
    }
  }

  renderPagination() {
    if (this.state.finalBricks.length <= 18) { return ""; }

    const showPrev = this.state.sortedIndex >= 18;
    const showNext = this.state.sortedIndex + 18 <= this.state.finalBricks.length;
    
    return (
      <Grid container direction="row" className="bricks-pagination">
        <Grid item xs={4} className="left-pagination">
          <div className="first-row">
            {this.state.sortedIndex + 1}-{  
              this.state.sortedIndex + 18 > this.state.finalBricks.length
                ? this.state.finalBricks.length
                : this.state.sortedIndex + 18
            }
            <span className="grey"> &nbsp;|&nbsp; {this.state.finalBricks.length}</span>
          </div>
          <div>
            {(this.state.sortedIndex + 18) / 18}
            <span className="grey"> &nbsp;|&nbsp; {Math.ceil(this.state.finalBricks.length / 18)}</span>
          </div>
        </Grid>
        <Grid container item xs={4} justify="center" className="bottom-next-button">
          <div>
            {
              showPrev ? (
                <ExpandLessIcon
                  className={"prev-button " + (showPrev ? "active" : "")}
                  onClick={() => this.moveAllBack()}
                />
              ) : ""
            }
            {
              showNext ? (
                <ExpandMoreIcon
                  className={"next-button " + (showNext ? "active" : "")}
                  onClick={() => this.moveAllNext()}
                />
              ) : ""
            }
          </div>
        </Grid>
      </Grid>
    );
  }

  render() {
    return (
      <div className="back-to-work-page">
        <div className="bricks-upper-part">
          <Grid container direction="row" className="bricks-header">
            <HomeButton link='/build' />
            <Grid container className="logout-container" item direction="row" style={{width: '92.35vw'}}>
              <Grid container style={{width: '60vw', height: '7vh'}}>
              <Grid item>
                <div className="search-button" onClick={() => this.search()}></div>
              </Grid>
              <Grid item>
                <input
                  className="search-input"
                  onKeyUp={(e) => this.keySearch(e)}
                  onChange={(e) => this.searching(e.target.value)}
                  placeholder="Search Ongoing Projects & Published Bricks…" />
              </Grid>
              </Grid>
              <Grid item style={{width: '32.35vw'}}>
                <Grid container direction="row" justify="flex-end">
                  <div className="bell-button"><div></div></div>
                  <div className="more-button" onClick={() => this.showDropdown()}></div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container direction="row" className="sorted-row">
            <Grid container item xs={3} className="sort-and-filter-container">
              <div style={{width: '100%'}} className="sort-and-filter-inner-container">
                {this.renderIndexesBox()}
                {this.renderSortAndFilterBox()}
              </div>
            </Grid>
            <Grid item xs={9} style={{position: 'relative'}}>
              <div className="brick-row-container">
                <div className="brick-row-title">
                  {this.renderTitle()}
                </div>
                <Grid container direction="row">
                  {this.renderSortedBricks()}
                </Grid>
                {this.renderPagination()}
              </div>
            </Grid>
          </Grid>
        </div>
        <Menu
          className="back-to-work-redirect-dropdown"
          keepMounted
          open={this.state.dropdownShown}
          onClose={() => this.hideDropdown()}
        >
          <MenuItem className="first-item menu-item" onClick={() => this.props.history.push('/build/bricks-list')}>
            View All Bricks
            <Grid container className="menu-icon-container" justify="center" alignContent="center">
              <div>
                <img className="menu-icon" alt="" src="/images/main-page/glasses-white.png" />
              </div>
            </Grid>
          </MenuItem>
          <MenuItem className="menu-item" onClick={() => this.creatingBrick()}>
            Start Building
            <Grid container className="menu-icon-container" justify="center" alignContent="center">
              <div>
                <img className="menu-icon" alt="" src="/images/main-page/create-white.png" />
              </div>
            </Grid>
          </MenuItem>
          {
            this.props.user.roles.some(role => role.roleId === UserType.Admin) ? (
              <MenuItem className="menu-item" onClick={() => this.props.history.push('/build/users')}>
                Manage Users
                <Grid container className="menu-icon-container" justify="center" alignContent="center">
                  <div>
                    <img className="manage-users-icon svg-icon" alt="" src="/images/users.svg" />
                  </div>
                </Grid>
              </MenuItem>
            ) : ""
          }
          <MenuItem className="view-profile menu-item" onClick={() => this.props.history.push('/build/user-profile')}>
            View Profile
            <Grid container className="menu-icon-container" justify="center" alignContent="center">
              <div>
                <img className="menu-icon svg-icon user-icon" alt="" src="/images/user.svg" />
              </div>
            </Grid>
          </MenuItem>
          <MenuItem className="menu-item" onClick={() => this.handleLogoutOpen()}>
            Logout
            <Grid container className="menu-icon-container" justify="center" alignContent="center">
              <div>
                <img className="menu-icon svg-icon logout-icon" alt="" src="/images/log-out.svg" />
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
      </div>
    )
  }
}

export default connector(BackToWorkPage);
