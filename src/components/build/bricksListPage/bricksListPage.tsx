import './bricksListPage.scss';
import React, { Component } from 'react';
import { Box, Grid } from '@material-ui/core';
// @ts-ignore
import { connect } from 'react-redux';

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
    this.state = {bricks: props.bricks, sortBy: SortBy.None};
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

  createBricksList = () => {
    let bricksList = []
    let i = 0;
    for (let brick of this.state.bricks) {
      bricksList.push(
        <Grid container key={i} item xs={12} sm={6} md={4} lg={3} justify="center">
          <div className="main-brick-container">
            <Box className={brick.expanded ? "expanded brick-container" : "brick-container"}  style={{paddingRight: 0}} onClick={() => this.move(brick.id)}>
              <Grid container direction="row" style={{padding: 0, position: 'relative'}}>
                <Grid item xs={11}>
                  <div className="link-description">Title Appear here</div>
                  <div className="link-info">Sub-Topic | Alternative</div>
                  <div className="link-info">{brick.author?.firstName} {brick.author?.lastName} | DD.MM.YYYY | {brick.brickLength} mins</div>
                </Grid>
                <div className="right-color-column">
                  <Grid container alignContent="flex-end" style={{width: '100%', height: '100%'}} justify="center">
                    {
                      brick.expanded ? " " : " "
                    }
                  </Grid>
                </div>
              </Grid>
            </Box>
          </div>
        </Grid>
      );
      i++;
    }
    return bricksList
  }

  render() {  
    return (
      <div className="bricks-list-page">
        <div className="bricks-upper-part">
          <Grid container direction="row" className="bricks-header">
            <Grid item xs={7}>
              <Grid container direction="row">
                <Grid item>
                  <img
                    alt="home"
                    className="home-button"
                    src="/images/brick-list/home.png"
                    onClick={() => { this.props.history.push('/build') }}
                  />
                </Grid>
                <Grid item>
                  <img
                    alt="home"
                    className="search-button"
                    src="/images/brick-list/search.png"
                  />
                </Grid>
                <input className="search-input" placeholder="Search Subjects, Topics, Titles & more" />
              </Grid>
            </Grid>
            <Grid container  className="logout-container" justify="flex-end" item xs={5}>
            <div className="logout-button"></div>
            <div className="bell-button"><div>3</div></div>
            <div className="user-button"></div>
            </Grid>
          </Grid>
          <h3>Continue Building</h3>
          <div className="bricks-list">
            <Grid container direction="row">
              {this.createBricksList()}
            </Grid>
          </div>
        </div>
        <div className="brick-list-footer">
          fotter
        </div>
      </div>
    )
  }
}

export default connector(BricksListPage);
