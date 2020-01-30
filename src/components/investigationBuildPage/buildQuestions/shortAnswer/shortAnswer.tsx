import React from 'react';
import { Grid } from '@material-ui/core';

import './shortAnswer.scss';
import Dustbin from '../components/DragDustbin';

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

const HorizontalLinearStepper = ({ activeStep }: CardProps) => {
  let currentIcon = RectFilledNumberIcon(activeStep + 1);

  return (
    <div className="short-answer">
      <Grid container direction="row" className="drop-box">
        <Dustbin allowedDropEffect="any" />
      </Grid>
      <Grid container direction="row" className="drop-box">
        <div className="input-box">
          <input placeholder="Enter correct answer" />
        </div>
      </Grid>
      <Grid container direction="row" className="drop-box">
        <Dustbin allowedDropEffect="any" />
      </Grid>
    </div>
  );
}

export default HorizontalLinearStepper;
