import React from 'react';
import { Grid } from '@material-ui/core';

import Dustbin from '../../DragDustbin'

type CardProps = {
  activeStep: number,
}

const RectFilledNumberIcon = (step: any) => () => (
  <span className={"rect icon-filled-rect-blue-" + step}>
    <span className="path1"></span><span className="path2"></span>
    <span className="path3"></span><span className="path4"></span>
    <span className="path5"></span><span className="path6"></span>
  </span>
);

const HorizontalLinearStepper = ({activeStep}: CardProps) => {
  let currentIcon = RectFilledNumberIcon(activeStep + 1);

  return (
    <Grid container direction="row">
      <Grid xs={1} sm={2} item md={3}></Grid>
      <Grid container justify="center" item xs={10} sm={8} md={6} className="question">
        <Grid container direction="row">
          {currentIcon()}
          <div className="question-title">Geomorfology</div>
        </Grid>
        <Grid container direction="row" className="drop-box">
          <Dustbin allowedDropEffect="any" />
        </Grid>
        <Grid container direction="row" className="drop-box">
          <Dustbin allowedDropEffect="any" />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default HorizontalLinearStepper;
