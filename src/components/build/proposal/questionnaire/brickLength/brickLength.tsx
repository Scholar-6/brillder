
import React from "react";
import { Grid } from "@material-ui/core";

import NavigationButtons from '../../components/navigationButtons/NavigationButtons';
import './brickLength.scss';
import ProposalPhonePreview from "components/build/baseComponents/phonePreview/proposalPhonePreview/ProposalPhonePreview";
import Navigation from 'components/build/proposal/components/navigation/Navigation';
import { ProposalStep } from "../../model";


export enum BrickLengthEnum {
  None = 0,
  S20min = 20,
  S40min = 40,
  S60min = 60
}

const BrickLengthPreviewComponent:React.FC<any> = ({data}) => {
  return (
    <Grid container justify="center" className="phone-preview-component">
      <img alt="head" src="/images/new-brick/brick-length.png"></img>
      <div>{data === 0 ? "" : data + ' minutes'}</div>
    </Grid>
  )
}

interface BrickLengthProps {
  length: any
  saveLength(value: BrickLengthEnum): any
  saveBrick(data: any): void
}

const BrickLength:React.FC<BrickLengthProps> = ({ length, saveLength, saveBrick }) => {
  const setBrickLength = (brickLength: BrickLengthEnum) => {
    saveLength(brickLength);
  }

  return (
    <div className="tutorial-page brick-length-page">
      <Navigation step={ProposalStep.BrickLength} onMove={() => {}} />
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid className="left-block">
          <h1>20 minutes are a taster,</h1>
          <h1>60 minutes are a feast.</h1>
          <h2 className="length-description">Choose Brick Length. &nbsp;You can always shorten or extend later.</h2>
          <Grid container direction="row" className="brick-length-row">
            <Grid container item xs={4} className="brick-length-image-container brick-length-image-container1">
              <div
                className={"brick-length-image brick-length-20-image " + ((length === BrickLengthEnum.S20min) ? "active" : "")}
                onClick={() => setBrickLength(BrickLengthEnum.S20min)}
              />
              <Grid container direction="row" justify="center" className="bottom-time-description">
                20
              </Grid>
            </Grid>
            <Grid container item xs={4} className="brick-length-image-container brick-length-image-container2">
              <div
                className={"brick-length-image brick-length-40-image " + ((length === BrickLengthEnum.S40min) ? "active" : "")}
                onClick={() => setBrickLength(BrickLengthEnum.S40min)}
              />
              <Grid container direction="row" justify="center" className="bottom-time-description">
                40
              </Grid>
            </Grid>
            <Grid container item xs={4} className="brick-length-image-container brick-length-image-container3">
              <div
                className={"brick-length-image brick-length-60-image " + ((length === BrickLengthEnum.S60min) ? "active" : "")}
                onClick={() => setBrickLength(BrickLengthEnum.S60min)}
              />
              <Grid container direction="row" justify="center" className="bottom-time-description">
                60
              </Grid>
            </Grid>
          </Grid>
          <NavigationButtons
            step={ProposalStep.BrickLength}
            canSubmit={length !== BrickLengthEnum.None}
            onSubmit={saveBrick}
            data={length}
            backLink="/build/new-brick/prep"
          />
        </Grid>
        <ProposalPhonePreview Component={BrickLengthPreviewComponent} data={length} />
        <div className="red-right-block"></div>
        <div className="beta-text">BETA</div>
      </Grid>
    </div>
  );
}

export default BrickLength
