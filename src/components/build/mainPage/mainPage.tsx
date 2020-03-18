import React, { Component } from 'react';
// @ts-ignore
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';

import './mainPage.scss';
import actions from 'redux/actions/auth';


const mapState = (state: any) => {
  return { }
}

const mapDispatch = (dispatch: any) => {
  return {
    logout: () => dispatch(actions.logout())
  }
}

const connector = connect(
  mapState,
  mapDispatch
)

class MainPage extends Component<any, any> {
  constructor(props:any) {
    super(props);
    this.state = {
      viewHover: false,
      createHober: false,
      backHober: false,
    } as any;
  }

  viewHoverToggle(viewHover: boolean) {
    console.log(viewHover)
    this.setState({viewHover});
  }

  render() {
    const {history} = this.props;
    return (
      <Grid container direction="row" className="mainPage">
        <div className="first-col">
        <div style={{background: "#B44438 0% 0% no-repeat padding-box"}}></div>
          <div className="first-item">
            <Grid container justify="center" style={{width: "100%"}}>
              <div className="zoom-item view-item" onClick={() => history.push('/build/bricks-list')}>
                <img alt="Logo" src="/images/main-page/glasses.png" className="item-image" />
                <div className="item-description">View All Bricks</div>
              </div>
            </Grid>
            <Grid container justify="center" style={{width: "100%"}}>
              <div className="zoom-item create-item" onClick={() => history.push('/build/new-brick/welcome')}>
                <img alt="Logo" src="/images/main-page/create.png" className="item-image" />
                <div className="item-description">Start Building</div>
              </div>
            </Grid>
            <Grid container justify="center" style={{width: "100%"}}>
              <div className="zoom-item back-item" onClick={() => history.push('/build')}>
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
                <span>LOGOUT</span>
              </Grid>
            </div>
          </Grid>
        </div>
      </Grid>
    )
  }
}

export default connector(MainPage)
