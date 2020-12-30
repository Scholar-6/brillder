import React, { useEffect } from 'react';
import { Grid, Hidden } from '@material-ui/core';
import moment from 'moment';

import './Synthesis.scss';
import { Brick } from 'model/brick';
import { useHistory, useLocation } from 'react-router-dom';
import { PlayStatus } from '../model';
import { BrickLengthEnum } from 'model/brick';
import TimerWithClock from "../baseComponents/TimerWithClock";
import { PlayMode } from '../model';
import HighlightHtml from '../baseComponents/HighlightHtml';
import { BrickFieldNames } from 'components/build/proposal/model';
import { getPlayPath, getAssignQueryString } from '../service';
import BrickCounter from '../baseComponents/BrickCounter';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { rightKeyPressed } from 'components/services/key';

interface SynthesisProps {
  isPlayPreview?: boolean;
  status: PlayStatus;
  brick: Brick;

  // only for real play
  mode?: PlayMode;
  moveNext(): void;
  onHighlight?(name: BrickFieldNames, value: string): void;
}

const PlaySynthesisPage: React.FC<SynthesisProps> = ({ status, brick, ...props }) => {
  const history = useHistory();
  const location = useLocation();
  const [startTime] = React.useState(moment());
  const playPath = getPlayPath(props.isPlayPreview, brick.id);

  useEffect(() => {
    function handleMove(e: any) {
      if (rightKeyPressed(e)) {
        reviewBrick();
      }
    }

    document.addEventListener("keydown", handleMove, false);
    
    return function cleanup() {
      document.removeEventListener("keydown", handleMove, false);
    };
  });

  if (status === PlayStatus.Live) {
    history.push(`${playPath}/intro${getAssignQueryString(location)}`);
  }

  const reviewBrick = () => {
    props.moveNext();
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

  const renderSynthesisContent = () => {
    return (
      <div className="synthesis-content">
        <HighlightHtml mode={props.mode} value={brick.synthesis} isSynthesis={true} onHighlight={
          value => {
            if (props.onHighlight) {
              props.onHighlight(BrickFieldNames.synthesis, value);
            }
          }
        } />
      </div>
    );
  }

  const renderFooter = () => {
    return (
      <div className="action-footer">
        <div></div>
        <div className="direction-info text-center">
          <h2>Review</h2>
        </div>
        <div>
          <button type="button" className="play-preview svgOnHover play-green" onClick={reviewBrick}>
            <SpriteIcon name="arrow-right" className="w80 h80 active m-l-02" />
          </button>
        </div>
      </div>
    );
  }

  const renderSpendTime = () => {
    return <p><span>Aim to spend {getSpendTime()} minutes on this section.</span></p>;
  }

  const renderMobile = () => {
    let color = "#B0B0AD";

    if (brick.subject) {
      color = brick.subject.color;
    }

    return (
      <div className="brick-container synthesis-page mobile-synthesis-page">
        <div className="introduction-page">
          <div className="intro-header expanded-intro-header">
            <div className="intro-header">
              <BrickCounter isArrowUp={true} startTime={startTime} />
            </div>
            <div className="flex f-align-center">
              <div className="left-brick-circle">
                <div className="round-button" style={{ background: `${color}` }}></div>
              </div>
              <span className="heading">Synthesis</span>
            </div>
            <span>{renderSpendTime()}</span>
          </div>
          {renderSynthesisContent()}
        </div>
        {renderFooter()}
      </div>
    );
  }

  return (
    <div style={{ height: '100%' }}>
      <Hidden only={['xs']}>
        <div className="brick-container play-preview-panel synthesis-page">
          <Grid container direction="row">
            <Grid item xs={8}>
              <div className="introduction-page">
                <h1 className="title">Synthesis</h1>
                <hr className="cuting-line"></hr>
                {renderSynthesisContent()}
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="introduction-info">
                <TimerWithClock isArrowUp={true} startTime={startTime} brickLength={brick.brickLength} />
                <div className="intro-text-row">
                  {renderSpendTime()}
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
        {renderMobile()}
      </Hidden>
    </div>
  );
}

export default PlaySynthesisPage;
