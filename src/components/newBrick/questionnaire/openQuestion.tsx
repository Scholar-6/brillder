import React from "react";
import NextButton from '../components/nextButton'

import { NewBrickStep } from "../model";
import { Grid } from "@material-ui/core";


function OpenQuestion() {
  return (
    <div className="tutorial-page">
      <Grid container direction="row" alignItems="flex-start">
        <Grid container justify="center" item xs={8}>
          <div className="left-card">
            <h1>Every brick should engage and inspire : 'No profit grows where is no ta'en'.  What core question(s) will challenge users?</h1>
            <NextButton step={NewBrickStep.OpenQuestion} />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default OpenQuestion
