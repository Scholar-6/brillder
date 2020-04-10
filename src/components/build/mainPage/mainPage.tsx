import React, { Component } from 'react';
// @ts-ignore
import { connect } from 'react-redux';
import { Grid, Hidden } from '@material-ui/core';

import './mainPage.scss';
import actions from 'redux/actions/auth';
import brickActions from 'redux/actions/brickActions';
import { User } from 'model/user';


const mapState = (state: any) => {
  return { 
    user: state.user.user
  }
}

const mapDispatch = (dispatch: any) => {
  return {
    forgetBrick: () => dispatch(brickActions.forgetBrick()),
    logout: () => dispatch(actions.logout())
  }
}

const connector = connect(
  mapState,
  mapDispatch
)

interface MainPageProps {
  history: any
  user: User
  forgetBrick(): void
  logout(): void
}

interface MainPageState {
  viewHover: boolean,
  createHober: boolean,
  backHober: boolean,
}

class MainPage extends Component<MainPageProps, MainPageState> {
  constructor(props:any) {
    super(props);
    this.state = {
      viewHover: false,
      createHober: false,
      backHober: false,
    } as any;
  }

  viewHoverToggle(viewHover: boolean) {
    this.setState({viewHover});
  }

  creatingBrick() {
    this.props.forgetBrick();
    this.props.history.push('/build/new-brick/brick-title');
  }

  render() {
    console.log(this.props);
    const {history} = this.props;
    return (
      <Grid container direction="row" className="mainPage">
        <Hidden only={['xs']}>
          <div className="welcome-col">
            <div className="welcome-box">
              <div>WELCOME</div>
              <div>TO BRIX,</div>
              <div className="welcome-name">
                {
                  this.props.user.firstName ? this.props.user.firstName : 'USER X'
                }
              </div>
            </div>
          </div>
          <div className="first-col">
            <div className="first-item">
              <Grid container justify="center" className="view-item-container">
                <div className="zoom-item view-item" onClick={() => history.push('/build/bricks-list')}>
                  <img alt="Logo" src="/images/main-page/glasses.png" className="item-image" />
                  <div className="item-description">View All Bricks</div>
                </div>
              </Grid>
              <Grid container justify="center" className="create-item-container">
                <div className="zoom-item create-item" onClick={() => this.creatingBrick()}>
                  <img alt="Logo" src="/images/main-page/create.png" className="item-image" />
                  <div className="item-description">Start Building</div>
                </div>
              </Grid>
              <Grid container justify="center" className="back-item-container">
                <div className="zoom-item back-item" onClick={() => history.push('/build/back-to-work')}>
                  <img alt="Logo" src="/images/main-page/backToWork.png" className="item-image" />
                  <div className="item-description">Back To Work</div>
                </div>
              </Grid>
            </div>
            <div className="second-item"></div>
          </div>
          <div className="second-col">
            <div className="first-item"></div>
            <div className="second-item"></div>
          </div>
          <div className="logout-button" onClick={this.props.logout}>
            <Grid container alignContent="center">
              <div style={{position: 'relative'}}>
                <img className="logout-image image-bottom" alt="logout" src="/images/main-page/logout.png" />
                <img className="logout-image image-top" alt="logout" src="/images/main-page/logout-hover.png" />
              </div>
              <div>
                <Grid container alignContent="center" style={{height: '100%'}}>
                  <span className="logout-text">LOGOUT</span>
                </Grid>
              </div>
            </Grid>
          </div>
        </Hidden>
        <Hidden only={['sm', 'md', 'lg', 'xl']}>
          <div className="mobile-main-page-background">
            <Grid container direction="row" className="first-mobile-row">
              <div className="first-col"></div>
              <div className="second-col"></div>
            </Grid>
            <Grid container direction="row" className="second-mobile-row">
            <div className="first-col"></div>
              <div className="second-col"></div>
            </Grid>
            <Grid container direction="row" className="third-mobile-row">
              <div className="first-col"></div>
              <div className="second-col"></div>
            </Grid>
          </div>
          <div className="mobile-main-page">
            <div className="mobile-logout-button" onClick={this.props.logout}>
              <Grid container alignContent="center" justify="flex-end">
                <div>
                  <img className="logout-image image-bottom" alt="logout" src="/images/main-page/logout.png" />
                </div>
                <div>
                  <Grid container alignContent="center" style={{height: '100%'}}>
                    <span>LOGOUT</span>
                  </Grid>
                </div>
              </Grid>
            </div>
            <Grid container justify="center" style={{width: "100%"}}>
              <div className="zoom-item view-item" onClick={() => history.push('/build/bricks-list')}>
                <img alt="Logo" src="/images/main-page/glasses.png" className="item-image" />
                <div className="item-description">View All Bricks</div>
              </div>
            </Grid>
            <Grid container justify="center" style={{width: "100%"}}>
              <div className="zoom-item create-item" onClick={() => history.push('/build/new-brick/brick-title')}>
                <img alt="Logo" src="/images/main-page/create.png" className="item-image" />
                <div className="item-description">Start Building</div>
              </div>
            </Grid>
            <Grid container justify="center" style={{width: "100%"}}>
              <div className="zoom-item back-item" onClick={() => history.push('/build/back-to-work')}>
                <img alt="Logo" src="/images/main-page/backToWork.png" className="item-image" />
                <div className="item-description">Back To Work</div>
              </div>
            </Grid>
          </div>
        </Hidden>
      </Grid>
    )
  }
}

export default connector(MainPage)
