
import React from "react";
import { Grid, Hidden } from "@material-ui/core";

import './brickLength.scss';
import { ProposalStep, OpenQuestionRoutePart } from "components/build/proposal/model";
import { BrickLengthEnum } from 'model/brick';

import NavigationButtons from '../../components/navigationButtons/NavigationButtons';
import ProposalPhonePreview from "components/build/baseComponents/phonePreview/proposalPhonePreview/ProposalPhonePreview";
import Navigation from 'components/build/proposal/components/navigation/Navigation';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { getReviewTime } from "components/play/services/playTimes";
import LengthBox from "./LengthBox";

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
    synthesis = 12;
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
  updated: any;
  saveLength(value: BrickLengthEnum): any;
  saveBrick(data: any): void;
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
        onMove={() => { }}
      />
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid className="left-block">
          <h1>20 minutes are a taster,<br />60 minutes are a feast.</h1>
          <h2 className="length-description">Choose Brick Length. &nbsp;You can always shorten or extend later.</h2>
          <Grid container direction="row" className="brick-length-row">
            <LengthBox activeLength={length} boxLength={BrickLengthEnum.S20min} setBrickLength={setBrickLength} />
            <LengthBox activeLength={length} boxLength={BrickLengthEnum.S40min} setBrickLength={setBrickLength} />
            <LengthBox activeLength={length} boxLength={BrickLengthEnum.S60min} setBrickLength={setBrickLength} />
          </Grid>
          <NavigationButtons
            step={ProposalStep.BrickLength}
            canSubmit={length !== BrickLengthEnum.None}
            onSubmit={props.saveBrick}
            data={length}
            backLink={props.baseUrl + OpenQuestionRoutePart}
            baseUrl={props.baseUrl}
          />
        </Grid>
        <ProposalPhonePreview Component={BrickLengthPreviewComponent} data={length} updated={props.updated} />
        <Hidden only={['xs', 'sm']}>
          <div className="red-right-block"></div>
        </Hidden>
      </Grid>
    </div>
  );
}

export default BrickLength
