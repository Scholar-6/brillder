import React from 'react';
import { Grid, Hidden } from '@material-ui/core';

import './Synthesis.scss';
import { Brick } from 'model/brick';
import { useHistory } from 'react-router-dom';
import { PlayStatus } from '../model/model';
import { BrickLengthEnum } from 'model/brick';
import TimerWithClock from "../baseComponents/TimerWithClock";
import sprite from "../../../../assets/img/icons-sprite.svg";
import { PlayMode } from '../model';
import HighlightHtml from '../baseComponents/HighlightHtml';
import { BrickFieldNames } from 'components/build/proposal/model';
const moment = require('moment');

interface SynthesisProps {
  isPlayPreview?: boolean;
  status: PlayStatus;
  brick: Brick;

  // only for real play
  mode?: PlayMode;
  onHighlight?(name: BrickFieldNames, value: string): void;
}

const PlaySynthesisPage: React.FC<SynthesisProps> = ({ status, brick, ...props }) => {
  const history = useHistory();
  const [startTime] = React.useState(moment());
  if (status === PlayStatus.Live) {
    if (props.isPlayPreview) {
      history.push(`/play-preview/brick/${brick.id}/intro`);
    } else {
      history.push(`/play/brick/${brick.id}/intro`);
    }
  }

  const reviewBrick = () => {
    if (props.isPlayPreview) {
      history.push(`/play-preview/brick/${brick.id}/review`);
    } else {
      history.push(`/play/brick/${brick.id}/review`);
    }
  }

  const getSpendTime = () => {
    let timeMinutes = 4;
    if (brick.brickLength === BrickLengthEnum.S40min) {
      timeMinutes = 8;
    } else if (brick.brickLength === BrickLengthEnum.S60min) {
      timeMinutes = 12;
    }
    return timeMinutes;
  }

  const renderFooter = () => {
    return (
      <div className="action-footer">
        <div>&nbsp;</div>
        <div className="direction-info">
          <h2>Review</h2>
        </div>
        <div>
          <button type="button" className="play-preview svgOnHover play-green" onClick={reviewBrick}>
            <svg className="svg w80 h80 active m-l-02">
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#arrow-right"} />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  const renderSynthesis = () => {
    return (
      <div className="introduction-page">
        <div className="question-index-container">
          <div className="question-index">S</div>
        </div>
        <h1>Synthesis</h1>
        <div className="question-live-play synthesis-content">
          <HighlightHtml mode={props.mode} value={brick.synthesis} onHighlight={
            value => {
              if (props.onHighlight) {
                props.onHighlight(BrickFieldNames.synthesis, value);
              }
            }
          } />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Hidden only={['xs']}>
        <div className="brick-container synthesis-page">
          <Grid container direction="row">
            <Grid item xs={8}>
              {renderSynthesis()}
            </Grid>
            <Grid item xs={4}>
              <div className="introduction-info">
                <TimerWithClock isArrowUp={true} startTime={startTime} brickLength={brick.brickLength} />
                <div className="intro-text-row">
                  <div>Aim to spend {getSpendTime()} minutes on this section.</div>
                  <br />
                  <p>When you’re ready to move on, you will have</p>
                  <p>3 minutes to try to improve your score.</p>
                </div>
                {renderFooter()}
              </div>
            </Grid>
          </Grid>
        </div>
      </Hidden>
      <Hidden only={['sm', 'md', 'lg', 'xl']}>
        <div className="brick-container synthesis-page mobile-synthesis-page">
          {renderSynthesis()}
          {renderFooter()}
        </div>
      </Hidden>
    </div>
  );
}

export default PlaySynthesisPage;
