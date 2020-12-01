import { Grid } from '@material-ui/core';
import React from 'react';

import './EmptyQP1.scss';

const EmptyQP1: React.FC<any> = () => {
  return (
    <div className="empty-QP1">
      <h2>Drag and Drop!</h2>
      <p>
        Add to your questions by dragging in
        the following components from the
        left side of the tab window (in red)
      </p>
      <Grid container className="qp1-row first">
        <Grid item xs={6} className="icon">
          T
        </Grid>
        <Grid item xs={6} className="text">
          Text
        </Grid>
      </Grid>
      <Grid container className="qp1-row second">
        <Grid item xs={6} className="icon">
          “ ”
        </Grid>
        <Grid item xs={6} className="text">
          Quote
        </Grid>
      </Grid>
      <Grid container className="qp1-row third">
        <Grid item xs={6} className="icon">
          jpg.
        </Grid>
        <Grid item xs={6} className="text">
          Image
        </Grid>
      </Grid>
      <Grid container className="qp1-row forth">
        <Grid item xs={6} className="icon">
          <img alt="" className="sound-image" src="/images/soundicon-dark-blue.png" />
        </Grid>
        <Grid item xs={6} className="text">
          Sound
        </Grid>
      </Grid>
      <Grid container className="qp1-row fifth">
        <Grid item xs={6} className="icon graph-box">
          f(x)
        </Grid>
        <Grid item xs={6} className="text">
          Graph
        </Grid>
      </Grid>
    </div>
  );
}

export default EmptyQP1;
