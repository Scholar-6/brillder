import React from 'react';
import { Grid, GridList, GridListTile } from '@material-ui/core';

import MainMenu from '../../build/baseComponents/mainMenu/MainMenu';

import '../colors.scss';
import './Pallet.scss';


const Pallet: React.FC<any> = (props) => {
  let pallet = {
    subject: 'English'
  };

  let bricks = [
    { title: 'Chemistry', cols: 2, type: 1 },
    { title: 'Computer science', cols: 2, type: 1 },
    { title: 'Latin', cols: 2, type: 1 },
    { title: 'History of Art', cols: 3, type: 2 },
    { title: 'Mathematics', cols: 3, type: 2 },
    { title: 'English Literature', cols: 6, type: 3 },
  ];

  return (
    <Grid container direction="row" justify="center">
      <MainMenu></MainMenu>
      <Grid item xs={12} justify="center">
        <h1 className="pallet-title">Demo Pallet</h1>
      </Grid>
      <Grid item xs={4} className={'theme-'+ pallet.subject}>
        <GridList cols={6}>
          {
            bricks.map(brick =>
              <GridListTile cols={brick.cols} className="pallet-tile-container">
                <Grid container alignContent="center" justify="center" className={'pallet-tile pallet-tile-'+brick.type}>{brick.title}</Grid>
              </GridListTile>)
          }
        </GridList>
      </Grid>
    </Grid>
  );
}

export default Pallet;
