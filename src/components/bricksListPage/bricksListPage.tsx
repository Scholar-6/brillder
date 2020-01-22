import './bricksListPage.scss';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Box, Grid } from '@material-ui/core';

const mapState = (state: any) => {
  return {
  }
}

const mapDispatch = (dispatch: any) => {
  return {
  }
}

const connector = connect(
  mapState,
  mapDispatch
)

class BricksListPage extends Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      bricks: [{
        id: '1',
        title: 'brick1'
      }, {
        id: '2',
        title: 'brick2'
      }, {
        id: '2',
        title: 'brick3'
      }, {
        id: '2',
        title: 'brick4'
      }, {
        id: '2',
        title: 'brick2'
      }, {
        id: '2',
        title: 'brick3'
      }, {
        id: '2',
        title: 'brick4'
      }, {
        id: '2',
        title: 'brick2'
      }, {
        id: '2',
        title: 'brick3'
      }, {
        id: '2',
        title: 'brick4'
      }, {
        id: '2',
        title: 'brick2'
      }, {
        id: '2',
        title: 'brick3'
      }, {
        id: '2',
        title: 'brick4'
      }]
    }
  }

  createBricksList = () => {
    let bricksList = []
    for (let [i, brick] of this.state.bricks.entries()) {
      bricksList.push(
        <Grid container item xs={4} lg={2} justify="center">
          <Box className="brick-container">
            <div className="link-description">Title: {brick.title}</div>
            <Link className="update-button" to={"/brick-create/" + brick.id}>Update</Link>
          </Box>
        </Grid>
      )
    }
    return bricksList
  }

  render() {
    return (
      <div className="bricks-list-page">
        <Grid container direction="row" className="mainPage">
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
