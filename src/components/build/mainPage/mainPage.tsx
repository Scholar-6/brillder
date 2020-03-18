import React, { Component } from 'react';
// @ts-ignore
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';

import './mainPage.scss';
import MainMenu from '../baseComponents/mainMenu/MainMenu';


const mapState = (state: any) => {
  return { }
}

const mapDispatch = (dispatch: any) => {
  return { }
}

const connector = connect(
  mapState,
  mapDispatch
)

class MainPage extends Component {
  render() {
    return (
      <Grid container direction="row" className="mainPage">
        <div className="first-col">
        <div style={{background: "#B44438 0% 0% no-repeat padding-box"}}></div>
          <div className="first-item">
            <div className="view-item">
              <img alt="Logo" src="/images/main-page/glasses.png" className="item-image" />
              <div className="item-description">View All Bricks</div>
            </div>
            <div className="create-item">
              <img alt="Logo" src="/images/main-page/create.png" className="item-image" />
              <div className="item-description">Start Building</div>
            </div>
            <div className="back-item">
              <img alt="Logo" src="/images/main-page/backToWork.png" className="item-image" />
              <div className="item-description">Back To Work</div>
            </div>
          </div>
          <div className="second-item"></div>
        </div>
        <div className="second-col">
          <div className="first-item"></div>
          <div className="second-item"></div>
        </div>
        <div className="logout-button">
          <Grid container alignContent="center">
            <p>Q</p>
          </Grid>
        </div>
      </Grid>
    )
  }
}

export default connector(MainPage)
