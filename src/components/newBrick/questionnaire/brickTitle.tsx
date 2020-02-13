import React from "react";
import { Grid } from "@material-ui/core";

import NextButton from '../components/nextButton'
import { NewBrickStep } from "../model";


function BrickTitle() {
  return (
    <div className="tutorial-page">
      <Grid container direction="row" alignItems="flex-start">
        <Grid container justify="center" item xs={8}>
          <div className="left-card">
            <h1>Define and amplify your audience.</h1>
            <NextButton step={NewBrickStep.BrickTitle} />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default BrickTitle
