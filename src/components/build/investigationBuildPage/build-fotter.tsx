

import React from 'react'
import { Grid, Slider } from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

const BuildFotter: React.FC<any> = () => {
  return (
    <Grid container direction="row" className="page-fotter">
      <Grid container item xs={4} sm={7} md={8} lg={9}></Grid>
      <Grid container item xs={7} sm={4} md={3} lg={2}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <RemoveIcon className="white" color="inherit" />
          </Grid>
          <Grid item xs>
            <Slider className="white" aria-labelledby="continuous-slider" />
          </Grid>
          <Grid item>
            <AddIcon className="white" color="inherit" />
          </Grid>
          <Grid item className="percentages">
            55 %
            </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default BuildFotter
