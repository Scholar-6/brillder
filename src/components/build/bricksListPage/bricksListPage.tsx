import './bricksListPage.scss';
import React, { Component } from 'react';
// @ts-ignore
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Box, Grid } from '@material-ui/core';

import actions from 'redux/actions/bricksActions';
import MainMenu from '../baseComponents/mainMenu/MainMenu';

const mapState = (state: any) => {
  return {
    bricks: state.bricks.bricks
  }
}

const mapDispatch = (dispatch: any) => {
  return {
    fetchBricks: () => dispatch(actions.fetchBricks()),
  }
}

const connector = connect(
  mapState,
  mapDispatch
)

class BricksListPage extends Component<any, any> {
  constructor(props: any) {
    super(props)
    this.props.fetchBricks();
  }

  createBricksList = () => {
    let bricksList = []
    for (let [i, brick] of this.props.bricks.entries()) {
      bricksList.push(
        <Grid container item xs={6} key={i} md={4} lg={3} justify="center">
          <Box className="brick-container">
            <div className="link-description">Title: {brick.title}</div>
            <Link className="update-button" to={`/build/brick/${brick.id}/build/investigation/question`}>Update</Link>
          </Box>
        </Grid>
      )
    }
    return bricksList
  }

  render() {
    return (
      <div className="bricks-list-page">
        <MainMenu></MainMenu>
        <Grid container direction="row">
          <Grid container item xs={12} justify="center">
            List of Bricks
          </Grid>
          {this.createBricksList()}
        </Grid>
      </div>
    )
  }
}

export default connector(BricksListPage);
