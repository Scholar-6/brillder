import React from "react";
import { Grid, Input } from "@material-ui/core";
// @ts-ignore
import Device from "react-device-frame";
import { Hidden } from "@material-ui/core";

import NextButton from '../components/nextButton'
import { NewBrickStep } from "../model";


function BrickTitle() {
  return (
    <div className="tutorial-page">
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid container justify="center" item xs={12} md={7} lg={8}>
          <div className="left-card">
            <h1 style={{marginTop: '30px'}}>Define and amplify your audience.</h1>
            <Input style={{display: 'block'}} placeholder="Enter Proposed Title Here..." />
            <Input placeholder="Enter Sub-Topic(s)..." />
            <Input placeholder="Enter Alternative Topic(s)..." />
            <NextButton step={NewBrickStep.BrickTitle} canSubmit={true} />
          </div>
        </Grid>
        <Hidden only={['xs', 'sm']}>
          <Grid container justify="center" item md={5} lg={4}>
            <Device name="iphone-5s" use="iphone-5s" color="grey" url="http://front.scholar6.org/" />
          </Grid>
        </Hidden>
      </Grid>
    </div>
  );
}

export default BrickTitle
