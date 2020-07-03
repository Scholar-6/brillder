import React from 'react';
import { Grid } from '@material-ui/core';

import './Synthesis.scss';
import { Brick } from 'model/brick';
import { useHistory } from 'react-router-dom';
import { PlayStatus } from '../model/model';
import MathInHtml from 'components/play/brick/baseComponents/MathInHtml';
import TimerWithClock from "../baseComponents/TimerWithClock";
import sprite from "../../../../assets/img/icons-sprite.svg";
const moment = require('moment');


interface SynthesisProps {
  isPlayPreview?: boolean;
  status: PlayStatus;
  brick: Brick;
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

  return (
    <div className="brick-container synthesis-page">
      <Grid container direction="row">
        <Grid item xs={8}>
          <div className="introduction-page">
            <div className="question-index-container">
              <div className="question-index">S</div>
            </div>
            <h1>Synthesis</h1>
            <div className="question-live-play">
              <div className="synthesis-content">
                <MathInHtml value={brick.synthesis} />
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={4}>
          <div className="introduction-info">
            <TimerWithClock isArrowUp={true} startTime={startTime} brickLength={brick.brickLength} />
            <div className="intro-text-row">
              <p>When you’re ready to move on, you will have</p>
              <p>3 minutes to try to improve your score.</p>
            </div>
            <div className="action-footer">
              <div>&nbsp;</div>
              <div className="direction-info">
                <h2>Review</h2>
              </div>
              <div>
                <button type="button" className="play-preview svgOnHover play-green" onClick={reviewBrick}>
                  <svg className="svg active m-l-02">
                    <use href={sprite + "#arrow-right"} />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default PlaySynthesisPage;
