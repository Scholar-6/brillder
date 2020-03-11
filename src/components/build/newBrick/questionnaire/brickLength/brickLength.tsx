
import React from "react";
import { Grid } from "@material-ui/core";
import './brickLength.scss';
import NextButton from '../../components/nextButton';
import PreviousButton from '../../components/previousButton';
import { NewBrickStep } from "../../model";
import PhonePreview from "components/build/baseComponents/phonePreview/PhonePreview";


export enum BrickLengthEnum {
  None = 0,
  S20min = 20,
  S40min = 40,
  S60min = 60
}

function BrickLength({ length, saveBrick }: any) {
  let presectedLength = 0;
  if (length === 20) {
    presectedLength = BrickLengthEnum.S20min;
  } else if (length === 40) {
    presectedLength = BrickLengthEnum.S40min;
  } else if (length === 60) {
    presectedLength = BrickLengthEnum.S60min;
  }
  const [brickLength, setLength] = React.useState(presectedLength as BrickLengthEnum);

  const setBrickLength = (brickLength: BrickLengthEnum) => {
    setLength(brickLength);
  }

  return (
    <div className="tutorial-page brick-length-page">
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid container justify="center" item xs={12} md={8} lg={8}>
          <Grid justify="center" container item xs={12} sm={9} md={10} lg={7}>
            <div className="left-card">
              <h1 className="only-tutorial-header-length">
                <p>20 minute are a taster. 40 minutes are a meal.</p>
                <p> 60 minutes are a feast.</p>
                <p>You can always shorten or extend later.</p>
              </h1>
              <h2 className="length-description">Choose Brick Length.</h2>
              <Grid container direction="row">
                <Grid container item xs={4} className="brick-length-image-container brick-length-image-container1">
                  <div
                    className={"brick-length-image brick-length-20-image " + ((brickLength === BrickLengthEnum.S20min) ? "active" : "")}
                    onClick={() => setBrickLength(BrickLengthEnum.S20min)}></div>
                  <Grid container direction="row" justify="center" className="bottom-time-description">
                    20mins
                </Grid>
                </Grid>
                <Grid container item xs={4} className="brick-length-image-container brick-length-image-container2">
                  <div
                    className={"brick-length-image brick-length-40-image " + ((brickLength === BrickLengthEnum.S40min) ? "active" : "")}
                    onClick={() => setBrickLength(BrickLengthEnum.S40min)}></div>
                  <Grid container direction="row" justify="center" className="bottom-time-description">
                    40mins
                </Grid>
                </Grid>
                <Grid container item xs={4} className="brick-length-image-container brick-length-image-container3">
                  <div
                    className={"brick-length-image brick-length-60-image " + ((brickLength === BrickLengthEnum.S60min) ? "active" : "")}
                    onClick={() => setBrickLength(BrickLengthEnum.S60min)}></div>
                  <Grid container direction="row" justify="center" className="bottom-time-description">
                    60mins
                </Grid>
                </Grid>
              </Grid>
              <PreviousButton to="/build/new-brick/prep" />
              <NextButton
                step={NewBrickStep.BrickLength}
                canSubmit={brickLength !== BrickLengthEnum.None}
                onSubmit={saveBrick}
                data={brickLength} />
            </div>
          </Grid>
        </Grid>
        <PhonePreview link={window.location.origin + '/logo-page'} />
      </Grid>
    </div>
  );
}

export default BrickLength
