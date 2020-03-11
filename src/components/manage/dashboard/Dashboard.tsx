import React from 'react';
import { Grid, GridList, GridListTile } from '@material-ui/core';
// @ts-ignore
import { connect } from "react-redux";

import actions from 'redux/actions/bricksActions';
import MainMenu from '../../build/baseComponents/mainMenu/MainMenu';

import '../../play/colors.scss';
import './Dashboard.scss';


const Dashboard: React.FC<any> = (props) => {
  if (props.bricks.length === 0) {
    props.fetchBricks();
    return <div>...Loading bricks ...</div>
  }
  let pallet = {
    subject: 'English'
  };

  return (
    <Grid container direction="row" justify="center">
      <MainMenu></MainMenu>
      <Grid container item xs={12} justify="center">
        <h1 className="pallet-title">Demo Pallet</h1>
      </Grid>
      <Grid item xs={4} className={'theme-'+ pallet.subject}>
        <GridList cols={3}>
          {
            props.bricks.map((brick:any, key:number) =>
              <GridListTile
                key={key}
                onClick={() => props.history.push(`/play/brick/${brick.id}/intro`)}
                cols={brick.cols}
                className="pallet-tile-container"
              >
                <Grid container alignContent="center" justify="center" className={'pallet-tile pallet-tile-'+brick.type}>{brick.title}</Grid>
              </GridListTile>)
          }
        </GridList>
      </Grid>
    </Grid>
  );
}

const mapState = (state: any) => {
  return {
    bricks: state.bricks.bricks,
  };
};

const mapDispatch = (dispatch: any) => {
  return {
    fetchBricks: () => dispatch(actions.fetchBricks()),
  }
}

const connector = connect(mapState, mapDispatch);

export default connector(Dashboard);