import './BackToWork.scss';
import React, { Component } from 'react';
import { Box, Grid, FormControlLabel, Radio, RadioGroup, Button } from '@material-ui/core';
import axios from 'axios';
// @ts-ignore
import { connect } from 'react-redux';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Dialog from '@material-ui/core/Dialog';

import authActions from 'redux/actions/auth';
import { Brick, BrickStatus } from 'model/brick';
import { User, UserType } from 'model/user';


const mapState = (state: any) => {
  return {
    user: state.user.user,
  }
}

const mapDispatch = (dispatch: any) => {
  return {
    logout: () => dispatch(authActions.logout()),
  }
}

const connector = connect(mapState, mapDispatch);

interface BackToWorkProps {
  user: User,
  history: any;
  logout(): void;
}

interface BackToWorkState {
  yourBricks: Array<Brick>;
  bricks: Array<Brick>;
  sortBy: SortBy;
  subjects: any[];
  yoursIndex: number;
  yoursReversed: boolean;
  sortedIndex: number;
  sortedReversed: boolean;
  logoutDialogOpen: boolean;

  deleteDialogOpen: boolean;
  deleteBrickId: number;
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
      yourBricks: [],
      bricks: [],
      sortBy: SortBy.None,
      subjects: [
        { checked: false, color: 'color1', name: 'Art & Design'},
        { checked: false, color: 'color2', name: 'Biology'},
        { checked: false, color: 'color3', name: 'Chemistry'},
        { checked: false, color: 'color4', name: 'Chinese'},
        { checked: false, color: 'color5', name: 'Classics'},
        { checked: false, color: 'color6', name: 'Computer Science'},
        { checked: false, color: 'color7', name: 'Ecomonics'},
        { checked: false, color: 'color8', name: 'English Literature'},
        { checked: false, color: 'color9', name: 'French'}
      ],
      yoursIndex: 0,
      yoursReversed: false,
      sortedIndex: 0,
      sortedReversed: false,

      logoutDialogOpen: false,
      deleteDialogOpen: false,
      deleteBrickId: -1
    };

    axios.get(process.env.REACT_APP_BACKEND_HOST + '/bricks/currentUser', {withCredentials: true})
      .then((res) => { 
        let bricks = res.data as Brick[];
        bricks = bricks.filter(brick => {
          return brick.status === BrickStatus.Publish;
        });
        this.setState({...this.state, yourBricks: bricks });
      })
      .catch(error => {
        alert('Can`t get bricks')
      });

    axios.get(process.env.REACT_APP_BACKEND_HOST + '/bricks/byStatus/' + BrickStatus.Publish, {withCredentials: true})
      .then(res => {  
        this.setState({...this.state, bricks: res.data });
      })
      .catch(error => {
        alert('Can`t get bricks');
      });

    axios.get(process.env.REACT_APP_BACKEND_HOST + '/subjects', {withCredentials: true})
    .then(res => {
    })
    .catch(error => {
      alert('Can`t get bricks');
    });
  }

  logout() {
    this.props.logout();
    this.props.history.push('/choose-user');
  }

  delete() {
    let brickId = this.state.deleteBrickId;
    axios.delete(process.env.REACT_APP_BACKEND_HOST + '/brick/' + brickId, {withCredentials: true})
      .then(res => {
        let {bricks, yourBricks} = this.state;
        let brick = bricks.find(brick => brick.id === brickId);
        if (brick) {
          let index = bricks.indexOf(brick);
          bricks.splice(index, 1);
        }

        brick = yourBricks.find(brick => brick.id === brickId);
        if (brick) {
          let index = yourBricks.indexOf(brick);
          yourBricks.splice(index, 1);
        }

        this.setState({...this.state, deleteDialogOpen: false});
      })
      .catch(error => {
        alert('Can`t delete bricks');
      });
  }

  move(brickId:number) {
    this.props.history.push(`/build/brick/${brickId}/build/investigation/question`)
  }

  getYear(date: Date) {
    var currentYear =  date.getFullYear();   
    var twoLastDigits = currentYear%100;
    var formatedTwoLastDigits = "";
    
    if (twoLastDigits < 10 ) {
      formatedTwoLastDigits = "0" + twoLastDigits;
    } else {
      formatedTwoLastDigits = "" + twoLastDigits;
    }
    return formatedTwoLastDigits;
  }

  getMonth(date: Date) {
    const month = date.getMonth() + 1;
    var twoLastDigits = month%10;
    var formatedTwoLastDigits = "";

    if (twoLastDigits < 10 ) {
      formatedTwoLastDigits = "0" + twoLastDigits;
    } else {
      formatedTwoLastDigits = "" + twoLastDigits;
    }
    return formatedTwoLastDigits;
  }

  handleSortChange = (e: any) => {
    const {state} = this;
    this.setState({...state, sortBy: parseInt(e.target.value)})
  }

  filterBySubject = (i: number) => {
    const {state} = this;
    const {subjects} = state;
    subjects[i].checked = !subjects[i].checked
    this.setState({...state})
  }

  changeSortedBricks = () => {
    let reversed = this.state.sortedReversed;
    let preReversed = reversed;
    let index = this.state.sortedIndex;
    if (index + 36 >= this.state.bricks.length) {
      preReversed = true;
    }
    if (reversed === false) {
      this.setState({...this.state, sortedIndex: index + 18, sortedReversed: preReversed});
    } else {
      if (index <= 18) {
        preReversed = false;
      }
      this.setState({...this.state, sortedIndex: index - 18, sortedReversed: preReversed});
    }
  }

  getBrickContainer = (brick: Brick, key: number) => {
    return (
      <Grid container key={key} item xs={3} justify="center">
        <div className="main-brick-container">
          <Box
            className="brick-container"
            onMouseEnter={() => this.yourBricksMouseHover(key)}
            onMouseLeave={() => this.yourBricksMouseLeave(key)}
          >
            <div className={`sorted-brick absolute-container ${brick.expanded ? "bigger-hover" : ""}`}>
            <Grid container direction="row" style={{padding: 0, position: 'relative'}}>
              <Grid item xs={brick.expanded ? 12 : 11}>
                <div className="link-description">{brick.title}</div>
                <div className="link-info">{brick.subTopic} | {brick.alternativeTopics}</div>
                <div className="link-info">
                  {this.getAuthorRow(brick)}
                </div>
                {
                  brick.expanded ?
                    <div>
                      <div className="hover-text">
                        <div className="hovered-open-question">Open Question Open Question Open Question</div>
                        <div>SUBJECT Code | No. of Plays</div>
                        <div>Editor: Name Surname</div>
                      </div>
                      <Grid container direction="row" className="hover-icons-row" alignContent="flex-end">
                        <Grid item xs={6} container justify="flex-start">
                          {
                            (this.props.user.type === UserType.Admin)
                              ? <img alt="bin" onClick={() => this.handleDeleteOpen(brick.id)} className="bin-button" src="/images/brick-list/bin.png" />
                              : ""
                          }
                        </Grid>
                        <Grid item xs={6} container justify="flex-end">
                          <img
                            alt="play"
                            className="play-button"
                            onClick={() => this.move(brick.id)}
                            src="/images/brick-list/play.png" />
                        </Grid>
                      </Grid>
                    </div>
                    : ""
                }
              </Grid>
              <div className="right-color-column">
                <Grid container alignContent="flex-end" style={{width: '100%', height: '100%'}} justify="center"></Grid>
              </div>
            </Grid>
            </div>
          </Box>
        </div>
      </Grid>
    );
  }

  handleMouseHover(index: number) {
    let {bricks} = this.state;
    bricks.forEach(brick => {
      brick.expanded = false;
    });
    this.setState({...this.state});
    setTimeout(() => {
      let {bricks} = this.state;
      bricks.forEach(brick => {
        brick.expanded = false;
      });
      if (!bricks[index].expandFinished) {
        bricks[index].expanded = true;
      }
      this.setState({...this.state});
    }, 400);
  }

  handleMouseLeave(key: number) {
    let {bricks, yourBricks} = this.state;
    yourBricks.forEach(brick => {
      brick.expanded = false;
    });
    bricks.forEach(brick => {
      brick.expanded = false;
    });
    bricks[key].expandFinished = true;
    this.setState({...this.state});
    setTimeout(() => {
      bricks[key].expandFinished = false;
      this.setState({...this.state});
    }, 400);
  }

  yourBricksMouseHover(index: number) {
    let {yourBricks, bricks} = this.state;
    bricks.forEach(brick => {
      brick.expanded = false;
    });
    yourBricks.forEach(brick => {
      brick.expanded = false;
    });
    this.setState({...this.state});
    setTimeout(() => {
      let {yourBricks} = this.state;
      yourBricks.forEach(brick => {
        brick.expanded = false;
      });
      if (!yourBricks[index].expandFinished) {
        yourBricks[index].expanded = true;
      }
      this.setState({...this.state});
    }, 400);
  }

  yourBricksMouseLeave(key: number) {
    let {yourBricks} = this.state;
    yourBricks.forEach(brick => {
      brick.expanded = false;
    });
    yourBricks[key].expandFinished = true;
    this.setState({...this.state});
    setTimeout(() => {
      yourBricks[key].expandFinished = false;
      this.setState({...this.state});
    }, 400);
  }

  getAuthorRow(brick: Brick) {
    let row = "";
    const created = new Date(brick.created);
    const year = this.getYear(created);
    const month = this.getMonth(created);
    if (brick.author) {
      const {author} = brick;
      if (author.firstName || author.firstName) {
        row += `${author.firstName} ${author.firstName} | `
      }
      row += `${created.getDate()}.${month}.${year} | ${brick.brickLength} mins`;
    }
    return row;
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

  getSortedBrickContainer = (brick: Brick, key: number, row: any = 0) => {
    return (
      <Grid container key={key} item xs={4} justify="center">
        <div className="main-brick-container">
          <Box
            className="brick-container"
            onMouseEnter={() => this.handleMouseHover(key)}
            onMouseLeave={() => this.handleMouseLeave(key)}
          >
            <div className={`sorted-brick absolute-container brick-row-${row} ${brick.expanded ? 'brick-hover' : ''}`}>
            <Grid container direction="row" style={{padding: 0, position: 'relative'}}>
              <Grid item xs={brick.expanded ? 12 : 11}>
                <div className="link-description">{brick.title}</div>
                <div className="link-info">{brick.subTopic} | {brick.alternativeTopics}</div>
                <div className="link-info">
                  {this.getAuthorRow(brick)}
                </div>
                {
                  brick.expanded ?
                    <div>
                      <div className="hover-text">
                        <div className="hovered-open-question">Open Question Open Question Open Question</div>
                        <div>SUBJECT Code | No. of Plays</div>
                        <div>Editor: Name Surname</div>
                      </div>
                      <Grid container direction="row" className="hover-icons-row" alignContent="flex-end">
                        <Grid item xs={6} container justify="flex-start">
                          {
                            (this.props.user.type === UserType.Admin)
                              ? <img alt="bin" onClick={() => this.handleDeleteOpen(brick.id)} className="bin-button" src="/images/brick-list/bin.png" />
                              : ""
                          }
                        </Grid>
                        <Grid item xs={6} container justify="flex-end">
                          <img
                            alt="play"
                            className="play-button"
                            onClick={() => this.move(brick.id)}
                            src="/images/brick-list/play.png" />
                        </Grid>
                      </Grid>
                    </div>
                    : ""
                }
              </Grid>
              <div className="right-color-column">
                <Grid container alignContent="flex-end" style={{width: '100%', height: '100%'}} justify="center"></Grid>
              </div>
            </Grid>
            </div>
          </Box>
        </div>
      </Grid>
    );
  }

  getEmptyBrickContainer = (key: number, size: any = 3) => {
    return (
      <Grid container key={key} item xs={size} justify="center">
        <div className="main-brick-container">
          <Box className="brick-container">
            <div className="absolute-container empty-container">
              <Grid container direction="row" style={{padding: 0, position: 'relative'}}>
                <Grid item xs={11}></Grid>
                <div className="right-color-column">
                  <Grid container alignContent="flex-end" style={{width: '100%', height: '100%'}} justify="center">
                  </Grid>
                </div>
              </Grid>
            </div>
          </Box>
        </div>
      </Grid>
    );
  }

  renderIndexesBox = () => {
    return (
      <div className="indexes-box">
        <div className="sort-header">Inbox</div>
        <div className="index-box active">
          View All
          <div className="right-index">6</div>
        </div>
        <div className="index-box">
          Build
          <div className="right-index">2</div>
        </div>
        <div className="index-box">
          Edit
          <div className="right-index">4</div>
        </div>
      </div>
    );
  }

  renderSortAndFilterBox = () => {
    return (
      <div className="sort-box">
        <div className="sort-header">Sort By</div>
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
        <div className="filter-header">Filter</div>
        <div className="filter-container">
          <FormControlLabel
            className="filter-radio-label color1"
            onClick={() => {}}
            control={<Radio className={"filter-radio sort-by color1"}/>}
            label="Proposal" />
          <div className="right-index">4</div>
        </div>
      </div>
    );
  }

  renderSortedBricks = () => {
    let {sortedIndex} = this.state;
    let BackToWork = [];
    for (let i = 0 + sortedIndex; i < 21 + sortedIndex; i++) {
      if (this.state.bricks[i]) {
        let row = Math.floor(i / 3);
        BackToWork.push(this.getSortedBrickContainer(this.state.bricks[i], i, row));
      } else {
        BackToWork.push(this.getEmptyBrickContainer(i, 4));
      }
    }
    return BackToWork
  }

  render() {  
    return (
      <div className="bricks-list-page">
        <div className="bricks-upper-part">
          <Grid container direction="row" className="bricks-header">
            <Grid item style={{width: '7.65vw'}}>
              <Grid container direction="row">
                <Grid item className="home-button-container">
                  <div className="home-button" onClick={() => { this.props.history.push('/build') }}>
                    <div></div>
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Grid container className="logout-container" item direction="row" style={{width: '92.35vw'}}>
              <Grid container style={{width: '60vw', height: '7vh'}}>
              <Grid item>
                <div className="search-button"></div>
              </Grid>
              <Grid item>
                <input className="search-input" placeholder="Search Ongoing Projects & Published Bricks…" />
              </Grid>
              </Grid>
              <Grid item style={{width: '32.35vw'}}>
                <Grid container direction="row" justify="flex-end">
                  <div className="logout-button" onClick={() => this.handleLogoutOpen()}></div>
                  <div className="bell-button"><div></div></div>
                  <div className="user-button"></div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container direction="row" className="sorted-row">
            <Grid container item xs={3} className="sort-and-filter-container">
              <div style={{width: '100%'}}>
                {this.renderIndexesBox()}
                {this.renderSortAndFilterBox()}
              </div>
            </Grid>
            <Grid item xs={9} style={{position: 'relative'}}>
              <Grid container direction="row">
                {this.renderSortedBricks()}
              </Grid>
              {
                this.state.bricks.length > 18 ?
                <Grid container justify="center" className="bottom-next-button">
                  {
                    this.state.sortedReversed
                      ? <ExpandLessIcon onClick={() => this.changeSortedBricks()} />
                      : <ExpandMoreIcon onClick={() => this.changeSortedBricks()} />
                  }
                </Grid>
                : ""
              }
            </Grid>
          </Grid>
        </div>
        <Dialog
          open={this.state.logoutDialogOpen}
          onClose={() => this.handleLogoutClose()}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="alert-dialog"
        >
          <div className="logout-dialog-header">
            <div>Are you sure you want</div>
            <div>to log out?</div>
          </div>
          <Grid container direction="row" className="logout-buttons" justify="center">
            <Button className="yes-button" onClick={() => this.logout()}>Yes</Button>
            <Button className="no-button" onClick={() => this.handleLogoutClose()}>No</Button>
          </Grid>
        </Dialog>
        <Dialog
          open={this.state.deleteDialogOpen}
          onClose={() => this.handleDeleteClose()}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="delete-brick-dialog"
        >
          <div className="dialog-header">
            <div>Permanently delete</div>
            <div>this brick?</div>
          </div>
          <Grid container direction="row" className="row-buttons" justify="center">
            <Button className="yes-button" onClick={() => this.delete()}>Yes, delete</Button>
            <Button className="no-button" onClick={() => this.handleDeleteClose()}>No, keep</Button>
          </Grid>
        </Dialog>
      </div>
    )
  }
}

export default connector(BackToWorkPage);
