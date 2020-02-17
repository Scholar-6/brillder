import React from "react";
import NextButton from '../components/nextButton';
// @ts-ignore
import Device from "react-device-frame";
import { Hidden } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

import './welcome.scss';
import { NewBrickStep } from "../model";


function Welcome() {
  return (
    <div className="tutorial-page">
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid container justify="center" item xs={12} md={7} lg={8}>
          <div className="left-card">
            <Grid container direction="row" justify="center" alignItems="center" style={{ height: "300px" }}>
              <Grid container direction="row" alignItems="center" style={{ height: "100%" }}>
                <Grid container justify="center" item xs={12} style={{ height: "100%" }}>
                  <img src="/images/BrixLogo.png" style={{ height: '100%' }} alt="brix-logo" />
                </Grid>
              </Grid>
            </Grid>
            <h2>Welcome to Brix.</h2>
            <h1>Start Building</h1>
            <NextButton step={NewBrickStep.Welcome} canSubmit={true} />
          </div>
        </Grid>
        <Hidden only={['xs', 'sm']}>
          <Grid container justify="center" item md={5} lg={4}>
            <Device name="iphone-5s" use="iphone-5s" color="grey" url={window.location.origin} />
          </Grid>
        </Hidden>
      </Grid>
    </div>
  );
}

export default Welcome
