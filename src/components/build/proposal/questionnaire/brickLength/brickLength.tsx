
import React from "react";
import { Grid, Hidden } from "@material-ui/core";

import './brickLength.scss';
import { ProposalStep, PlayButtonStatus, OpenQuestionRoutePart } from "components/build/proposal/model";
import { BrickLengthEnum } from 'model/brick';

import NavigationButtons from '../../components/navigationButtons/NavigationButtons';
import ProposalPhonePreview from "components/build/baseComponents/phonePreview/proposalPhonePreview/ProposalPhonePreview";
import Navigation from 'components/build/proposal/components/navigation/Navigation';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { getReviewTime } from "components/play/services/playTimes";

interface Props {
  data: BrickLengthEnum;
}

const BrickLengthPreviewComponent: React.FC<Props> = ({ data }) => {
  let prepare = 5;
  let investigation = 8;
  let synthesis = 4;

  const review = getReviewTime(data);

  if (data === 40) {
    prepare = 10;
    investigation = 16;
    synthesis = 8;
  } else if (data === 60) {
    prepare = 15;
    investigation = 24;
    synthesis= 12;
  }

  return (
    <Grid container justify="center" className="phone-preview-component">
      <SpriteIcon name="clock" className={data === 0 ? "big" : ""} />
      <div className="">{data === 0 ? "" : data + ' minutes'}</div>
      {data !== 0 ? 
      <div className="preview-length-list">
        Students will have:
        <ul>
          <li>Around {prepare} minutes to prepare</li>
          <li>{investigation} minutes to answer questions</li>
          <li>{synthesis} minutes to read your Synthesis</li>
          <li>{review} minutes to review their answers</li>
        </ul>
      </div> : ""}
    </Grid>
  )
}

interface BrickLengthProps {
  baseUrl: string;
  length: BrickLengthEnum;
  canEdit: boolean;
  playStatus: PlayButtonStatus;
  saveLength(value: BrickLengthEnum): any;
  saveAndPreview(): void;
}

const BrickLength: React.FC<BrickLengthProps> = (
  { length, ...props }
) => {
  const setBrickLength = (brickLength: BrickLengthEnum) => {
    if (!props.canEdit) { return; }
    props.saveLength(brickLength);
  }

  return (
    <div className="tutorial-page brick-length-page">
      <Navigation
        baseUrl={props.baseUrl}
        step={ProposalStep.BrickLength}
        playStatus={props.playStatus}
        saveAndPreview={props.saveAndPreview}
        onMove={() => { }}
      />
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid className="left-block">
          <h1>20 minutes are a taster,<br />60 minutes are a feast.</h1>
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
            onSubmit={() => {}}
            data={length}
            backLink={props.baseUrl + OpenQuestionRoutePart}
            baseUrl={props.baseUrl}
          />
        </Grid>
        <ProposalPhonePreview Component={BrickLengthPreviewComponent} data={length} />
        <Hidden only={['xs','sm']}>
          <div className="red-right-block"></div>
        </Hidden>
      </Grid>
    </div>
  );
}

export default BrickLength
