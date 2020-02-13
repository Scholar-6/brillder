import React from "react";
import NextButton from '../components/nextButton';

import { NewBrickStep } from "../model";
import Grid from "@material-ui/core/Grid";


function Welcome() {
  return (
    <div className="tutorial-page">
      <Grid container direction="row" alignItems="flex-start">
        <Grid container justify="center" item xs={8}>
          <div className="left-card">
          <Grid container direction="row" justify="center" alignItems="center" style={{height: "300px"}}>
              <Grid container  item xs={6}>
                <div style={{height: "250px", width: "90%", border: "1px solid black"}}>
                <Grid container direction="row" alignItems="center" style={{height: "100%"}}>
                <Grid container justify="center" item xs={12}>Video</Grid></Grid>
                </div>
              </Grid>
            </Grid>
            <h2>Welcome to Brix.</h2>
            <h1>Start Building</h1>
            <NextButton step={NewBrickStep.Welcome} />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default Welcome
