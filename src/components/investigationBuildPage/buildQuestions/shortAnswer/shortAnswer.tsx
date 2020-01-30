import React from 'react';
import { Grid } from '@material-ui/core';

import './shortAnswer.scss';
import Dustbin from '../components/DragDustbin';

type CardProps = {
  activeStep: number,
}

const HorizontalLinearStepper = ({ activeStep }: CardProps) => {
  return (
    <div className="short-answer">
      <Grid container direction="row" className="drop-box">
        <Dustbin index={0} />
      </Grid>
      <Grid container direction="row" className="drop-box">
        <div className="input-box">
          <input placeholder="Enter correct answer" />
        </div>
      </Grid>
      <Grid container direction="row" className="drop-box">
        <Dustbin index={2} />
      </Grid>
    </div>
  );
}

export default HorizontalLinearStepper;
