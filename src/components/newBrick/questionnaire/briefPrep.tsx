import React from "react";
import { Grid, Input } from "@material-ui/core";

import NextButton from '../components/nextButton'
import { NewBrickStep } from "../model";


function BriefPrep() {
  return (
    <div className="tutorial-page">
      <Grid container direction="row" alignItems="flex-start">
        <Grid container justify="center" item xs={8}>
          <div className="left-card">
            <h1 style={{margin: '20px 0'}}>What do you want users to think more deeply about?</h1>
            <input style={{width: '90%', border: '2px solid black', height: '70px', textAlign: 'center'}} placeholder="Enter Brief here..."></input>
            <Input style={{margin: '20px 0 0 0', width: '90%'}} placeholder="Insert Link(s) Here..." />

            <Grid container direction="row" alignItems="center" style={{height: "300px"}}>
              <Grid container justify="center" item xs={3}>
                <h1>Video / Text Preview</h1>
              </Grid>
              <Grid container justify="center" item xs={9}>
                <div style={{height: "250px", width: "90%", border: "1px solid black"}}>
                <Grid container direction="row" alignItems="center" style={{height: "100%"}}>
                <Grid container justify="center" item xs={12}>Video</Grid></Grid>
                </div>
              </Grid>
            </Grid>
            <NextButton step={NewBrickStep.BriefPrep} />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default BriefPrep
