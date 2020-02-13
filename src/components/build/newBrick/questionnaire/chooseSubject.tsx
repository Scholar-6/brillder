import React from "react";
import { Grid } from "@material-ui/core";

import { NewBrickStep } from "../model";
import NextButton from '../components/nextButton'


function ChooseSubject() {
  return (
    <div className="tutorial-page">
      <Grid container direction="row" alignItems="flex-start">
        <Grid container justify="center" item xs={8}>
          <div className="left-card">
            <h1>What kind of knowledge do you want to share?</h1>
            <NextButton step={NewBrickStep.ChooseSubject} />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default ChooseSubject
