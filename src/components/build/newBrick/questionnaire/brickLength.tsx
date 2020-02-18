
import React from "react";
import { Grid } from "@material-ui/core";
// @ts-ignore
import Device from "react-device-frame";
import { Hidden } from "@material-ui/core";

import NextButton from '../components/nextButton'
import { NewBrickStep } from "../model";

enum BrickLengthEnum {
  None = 0,
  S20min,
  S40min,
  S60min
}

function BrickLength() {
  const [brickLength, setLength] = React.useState(0);

  const setBrickLength = (brickLength: BrickLengthEnum) => {
    setLength(brickLength);
  }
  
  return (
    <div className="tutorial-page">
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid container justify="center" item xs={12} md={7} lg={8}>
          <div className="left-card">
            <h1 className="only-tutorial-header">20 minute bricks offer a snapshot of a topic while 60 minute ones are opportunities to really get stuck in.  You can always shorten or extend later.</h1>
            <h2 className="length-description">Choose Brick Length.</h2>
            <Grid container direction="row">
            <Grid container item xs={4}>
              <div
                className={"brick-length-image " + ((brickLength === BrickLengthEnum.S20min) ? "active" : "")}
                onClick={() => setBrickLength(BrickLengthEnum.S20min)}></div>
              <Grid container direction="row" justify="center" className="bottom-time-description">
                20mins
              </Grid>
            </Grid>
            <Grid container item xs={4}>
              <div
                className={"brick-length-image " + ((brickLength === BrickLengthEnum.S40min) ? "active" : "")}
                onClick={() => setBrickLength(BrickLengthEnum.S40min)}></div>
              <Grid container direction="row" justify="center" className="bottom-time-description">
                40mins
              </Grid>
            </Grid>
            <Grid container item xs={4}>
              <div
                className={"brick-length-image " + ((brickLength === BrickLengthEnum.S60min) ? "active" : "")}
                onClick={() => setBrickLength(BrickLengthEnum.S60min)}></div>
              <Grid container direction="row" justify="center" className="bottom-time-description">
                60mins
              </Grid>
            </Grid>
            </Grid>
            <NextButton step={NewBrickStep.BrickLength} canSubmit={true} />
          </div>
        </Grid>
        <Hidden only={['xs', 'sm']}>
          <Grid container justify="center" item md={5} lg={4}>
            <Device name="iphone-5s" use="iphone-5s" color="grey" url={window.location.origin + '/logo-page'} />
          </Grid>
        </Hidden>
      </Grid>
    </div>
  );
}

export default BrickLength
