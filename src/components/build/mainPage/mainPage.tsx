import React, { Component } from 'react';
// @ts-ignore
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';

import './mainPage.scss';
import actions from 'redux/actions/mainPageActions';
import MainMenu from '../base-components/main-menu/main-menu';


const mapState = (state: any) => {
  return {
    username: state.mainPage.username as string
  }
}

const mapDispatch = (dispatch: any) => {
  return {
    fetchUsername: () => dispatch(actions.fetchUsername())
  }
}

const connector = connect(
  mapState,
  mapDispatch
)

class MainPage extends Component {
  render() {
    return (
      <div className="mainPage">
        <MainMenu></MainMenu>

        <Grid container direction="row" justify="center" style={{ height: "100%" }} alignItems="center">
          <div className="main-page-center-container">
            <Grid container direction="row" justify="center" alignItems="center">
              <Grid container item xs={6} sm={5} md={4} lg={3} justify="center">
                <Link to="/build/bricks-list" className="bigButton">
                  <div className="link-title">V I E W</div>
                  <div className="link-description">S e e &nbsp; w h a t &nbsp; w e &nbsp; w a n t</div>
                </Link>
              </Grid>
            </Grid>
            <Grid container direction="row" justify="center" alignItems="center">
              <Grid container item xs={6} sm={5} md={4} lg={3} justify="center">
                <Link to="/build" className="bigButton">
                  <div className="link-title">A P P L Y</div>
                  <div className="link-description">S u g g e s t &nbsp; a &nbsp; b r i c k</div>
                </Link>
              </Grid>
              <Grid container item xs={6} sm={5} md={4} lg={3} justify="center">
                <Link to="/build/new-brick/welcome" className="bigButton">
                  <div className="link-title">C R E A T E</div>
                  <div className="link-description">S t a r t &nbsp; b u i l d i n g</div>
                </Link>
              </Grid>
            </Grid>
            <Grid container direction="row" justify="center" alignItems="center">
              <Grid container item xs={6} sm={5} md={4} lg={3} justify="center">
                <Link to="/build" className="bigButton">
                  <div className="link-title">B A C K &nbsp; T O &nbsp; W O R K</div>
                  <div className="link-description">O n g o i n g &nbsp; p r o j e c t s</div>
                </Link>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </div>
    )
  }
}

export default connector(MainPage)
