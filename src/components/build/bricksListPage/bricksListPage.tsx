import './bricksListPage.scss';
import React, { Component } from 'react';
import { Box, Grid, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
// @ts-ignore
import { connect } from 'react-redux';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import actions from 'redux/actions/bricksActions';
import authActions from 'redux/actions/auth';
import { Brick } from 'model/brick';


const mapState = (state: any) => {
  return {
    bricks: state.bricks.bricks
  }
}

const mapDispatch = (dispatch: any) => {
  return {
    logout: () => dispatch(authActions.logout()),
    fetchBricks: () => dispatch(actions.fetchBricks()),
  }
}

const connector = connect(mapState, mapDispatch);

interface BricksListProps {
  bricks: Array<Brick>;
  history: any;
  fetchBricks(): void;
  logout(): void;
}

interface BricksListState {
  bricks: Array<Brick>;
  sortBy: SortBy;
  subjects: any[];
  yoursIndex: number;
  yoursReversed: boolean;
  sortedIndex: number;
  sortedReversed: boolean;
}

enum SortBy {
  None,
  Date,
  Subject,
  Popularity,
  Author,
  Length,
}

class BricksListPage extends Component<BricksListProps, BricksListState> {
  constructor(props: BricksListProps) {
    super(props)
    this.props.fetchBricks();
    this.state = {
      bricks: props.bricks,
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
    };
  }

  logout() {
    this.props.logout();
    this.props.history.push('/choose-user');
  }

  componentWillReceiveProps(props:BricksListProps) {
    this.setState({bricks: props.bricks});
  }

  move(brickId:number) {
    this.props.history.push(`/build/brick/${brickId}/build/investigation/question`)
  }

  expend(brick: Brick) {
    brick.expanded = !brick.expanded;
    this.setState({ bricks: this.state.bricks });
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
    if (index + 36 >= this.props.bricks.length) {
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

  getBrickContainer = (brick: Brick, key: number, size: any = 3) => {
    const created = new Date(brick.created);
    const year = this.getYear(created);
    const month = this.getMonth(created);
    return (
      <Grid container key={key} item xs={size} justify="center">
        <div className="main-brick-container">
          <Box className={brick.expanded ? "expanded brick-container" : "brick-container"}  style={{paddingRight: 0}} onClick={() => this.move(brick.id)}>
            <Grid container direction="row" style={{padding: 0, position: 'relative'}}>
              <Grid item xs={11}>
                <div className="link-description">{brick.title}</div>
                <div className="link-info">{brick.subTopic} | {brick.alternativeTopics}</div>
                <div className="link-info">
                  {brick.author?.firstName} {brick.author?.lastName} | {created.getDate()}.{month}.{year} | {brick.brickLength} mins
                </div>
              </Grid>
              <div className="right-color-column">
                <Grid container alignContent="flex-end" style={{width: '100%', height: '100%'}} justify="center"></Grid>
              </div>
            </Grid>
          </Box>
        </div>
      </Grid>
    );
  }

  getEmptyBrickContainer = (key: number, size: any = 3) => {
    return (
      <Grid container key={key} item xs={size} justify="center">
        <div className="main-brick-container">
          <Box className="brick-container empty-container"  style={{paddingRight: 0}}>
            <Grid container direction="row" style={{padding: 0, position: 'relative'}}>
              <Grid item xs={11}></Grid>
              <div className="right-color-column">
                <Grid container alignContent="flex-end" style={{width: '100%', height: '100%'}} justify="center">
                </Grid>
              </div>
            </Grid>
          </Box>
        </div>
      </Grid>
    );
  }


  renderYourBrickRow = () => {
    let bricksList = []
    let index = 0;
    for (let i = index; i < index + 4; i++) {
      if (this.state.bricks[i]) {
        bricksList.push(this.getBrickContainer(this.state.bricks[i], i));
      } else {
        bricksList.push(this.getEmptyBrickContainer(i));
      }
    }
    return bricksList;
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
          <FormControlLabel value={SortBy.Popularity} control={<Radio className="sortBy" />} label="Popularity" />
          <FormControlLabel value={SortBy.Date} control={<Radio className="sortBy" />} label="Date Added" />
        </RadioGroup>
        <div className="filter-header">Filter</div>
        {
          this.state.subjects.map((subject, i) =>
            <FormControlLabel
              className="filter-container"
              key={i}
              checked={subject.checked}
              onClick={() => this.filterBySubject(i)}
              control={<Radio className={"filter-radio " + subject.color}/>}
              label={subject.name} />
          )
        }
      </div>
    );
  }

  renderSortedBricks = () => {
    let {sortedIndex} = this.state;
    let bricksList = [];
    for (let i = 0 + sortedIndex; i < 18 + sortedIndex; i++) {
      if (this.state.bricks[i]) {
        bricksList.push(this.getBrickContainer(this.state.bricks[i], i, 4));
      } else {
        bricksList.push(this.getEmptyBrickContainer(i, 4));
      }
    }
    return bricksList
  }

  render() {  
    return (
      <div className="bricks-list-page">
        <div className="bricks-upper-part">
          <Grid container direction="row" className="bricks-header">
            <Grid item style={{width: '7.65vw'}}>
              <Grid container direction="row">
                <Grid item className="home-button-container">
                  <img
                    alt="home"
                    className="home-button"
                    src="/images/choose-login/logo.png"
                    onClick={() => { this.props.history.push('/build') }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid container className="logout-container" item direction="row" style={{width: '92.35vw'}}>
              <Grid container style={{width: '60vw', height: '7vh'}}>

              <Grid item justify="flex-start">
                <img
                  alt="home"
                  className="search-button"
                  src="/images/brick-list/search.png"
                />
              </Grid>
              <Grid item justify="flex-start">
                <input className="search-input" placeholder="Search Subjects, Topics, Titles & more" />
              </Grid>
              </Grid>
              <Grid item style={{width: '32.35vw'}}>
                <Grid container direction="row" justify="flex-end">
                  <div className="logout-button"></div>
                  <div className="bell-button"><div></div></div>
                  <div className="user-button"></div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <h3>Your Bricks</h3>
          <div className="your-bricks-list">
            <Grid container direction="row">
              {this.renderYourBrickRow()}
            </Grid>
            <div className="next-bricks">
              <NavigateNextIcon className="MuiSvgIcon-root jss415 MuiSvgIcon-fontSizeLarge" />
            </div>
          </div>
          <Grid container direction="row" className="sorted-row">
            <Grid container item xs={3} className="sort-and-filter-container">
              {this.renderSortAndFilterBox()}
            </Grid>
            <Grid item xs={9} style={{position: 'relative'}}>
              <Grid container direction="row">
                {this.renderSortedBricks()}
              </Grid>
              <Grid container justify="center" className="bottom-next-button">
                {
                  this.state.sortedReversed
                    ? <ExpandMoreIcon onClick={() => this.changeSortedBricks()} />
                    : <ExpandMoreIcon onClick={() => this.changeSortedBricks()} />
                }
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    )
  }
}

export default connector(BricksListPage);
