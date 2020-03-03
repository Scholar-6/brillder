import React from "react";
import NextButton from '../components/nextButton';
// @ts-ignore
import Device from "react-device-frame";
import { Hidden } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

import { NewBrickStep } from "../model";


function Welcome() {
  return (
    <div className="tutorial-page">
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid container justify="center" item xs={12} md={7} lg={8}>
          <Grid container direction="row" style={{ height: '100%' }} justify="center">
            <Grid container justify="center" item xs={12} sm={9} md={10} lg={7}>
              <div className="left-card">
                <Grid className="tutorial-logo-container" container direction="row" justify="center" alignItems="center" style={{ height: "300px" }}>
                  <Grid container direction="row" alignItems="center" style={{ height: "100%" }}>
                    <Grid container justify="center" item xs={12} style={{ height: "100%" }}>
                      <img src="/images/BrixLogo.png" style={{ height: '100%' }} alt="brix-logo" />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} style={{ position: "relative" }}>
                  <h2 className="tutorial-logo-text">A &nbsp; S C H O L A R &nbsp; 6 &nbsp; T E C H &nbsp; P R O D U C T </h2>
                  <h2 className="welcome-upper-text">Welcome to Brix.</h2>
                  <h1 className="welcome-bottom-text">Start Building </h1>
                  <div style={{ position: "absolute", top: '10px', right: 0 }}>
                    <NextButton step={NewBrickStep.Welcome} canSubmit={true} />
                  </div>
                </Grid>
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Hidden only={['xs', 'sm']}>
          <div style={{ right: "5%", position: "fixed", width: '19.3%', paddingTop: '33.3%' }}>
            <Device name="iphone-5s" use="iphone-5s" color="grey" url={window.location.origin + '/logo-page'} />
          </div>
        </Hidden>
      </Grid>
    </div>
  );
}

export default Welcome
