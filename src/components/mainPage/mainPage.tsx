import React, { Component } from 'react';
import './mainPage.scss';
// @ts-ignore
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Box, Grid } from '@material-ui/core';
import actions from '../../redux/actions/mainPageActions';
import MainMenu from '../base-components/main-menu';

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
  constructor(props: any) {
    super(props)
    props.fetchUsername();
  }

  render() {
    const props = this.props as any;
    return (
      <Grid container direction="row" justify="center" className="mainPage" alignItems="center">
        <MainMenu></MainMenu>
        <Grid container item xs={12} justify="center">
          <div className="client-name">Welcome {props.username}</div>
        </Grid>

        <Grid container item xs={12} justify="center">
          <Box bgcolor="primary.main" className="bigButton">
            <Link to="/bricks-list">
              <div className="link-title">VIEW</div>
              <div className="link-description">See what we want...</div>
            </Link>
          </Box>
        </Grid>

        <Grid container item xs={12} justify="center">
          <Box bgcolor="primary.main" className="bigButton">
            <Link to="/brick">
              <div className="link-title">APPLY</div>
              <div className="link-description">Suggest what we want...</div>
            </Link>
          </Box>
        </Grid>


        <Grid container item xs={12} justify="center">
          <Box bgcolor="primary.main" className="bigButton">
            <Link to="/brick-create">
              <div className="link-title">CREATE</div>
              <div className="link-description">Just build a brick...</div>
            </Link>
          </Box>
        </Grid>

        <Grid container item xs={12} justify="center">
          <Box bgcolor="primary.main" className="bigButton">
            <Link to="/brick">
              <div className="link-title">BACK TO WORK</div>
              <div className="link-description">For current projects,</div>
              <div className="link-description">editors and authors...</div>
            </Link>
          </Box>
        </Grid>
      </Grid>
    )
  }
}

export default connector(MainPage)
