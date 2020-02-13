import React from "react";
import { Grid } from "@material-ui/core";

import NextButton from '../components/nextButton'
import { NewBrickStep } from "../model";


function BrickLength() {
  return (
    <div className="tutorial-page">
      <Grid container direction="row" alignItems="flex-start">
        <Grid container justify="center" item xs={8}>
          <div className="left-card">
            <h1>20 minute bricks offer a snapshot of a topic while 60 minute ones are opportunities to really get stuck in.  You can always shorten or extend later.</h1>
            <NextButton step={NewBrickStep.BrickLength} />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default BrickLength
