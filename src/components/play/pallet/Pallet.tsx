import React from 'react';
import { Grid } from '@material-ui/core';

import MainMenu from '../../build/baseComponents/mainMenu/MainMenu';


const Pallet: React.FC<any> = (props) => {
  return (
    <Grid container direction="row">
      <MainMenu></MainMenu>
      <Grid item xs={12} justify="center">
        <h1>Demo Pallet</h1>
      </Grid>
    </Grid>
  );
}

export default Pallet;
