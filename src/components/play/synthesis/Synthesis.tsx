import React, { useEffect } from 'react';
import moment from 'moment';

import './Synthesis.scss';
import { AcademicLevelLabels, Brick } from 'model/brick';
import { useHistory } from 'react-router-dom';
import { PlayStatus } from '../model';
import { PlayMode } from '../model';
import HighlightHtml from '../baseComponents/HighlightHtml';
import { BrickFieldNames } from 'components/build/proposal/model';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { rightKeyPressed } from 'components/services/key';
import { getSynthesisTime } from '../services/playTimes';
import { isPhone } from 'services/phone';
import TimeProgressbarV2 from '../baseComponents/timeProgressbar/TimeProgressbarV2';
import BrickTitle from 'components/baseComponents/BrickTitle';
import routes from '../routes';

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
    if (isPhone()) {
      history.push(routes.phonePrep(brick.id));
    } else {
      // direct access only for work for play preview
      if (!props.isPlayPreview) {
        history.push(routes.playNewPrep(brick.id));
      }
    }
  }

  const reviewBrick = () => props.moveNext();

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

  const renderPhoneButton = () => {
    return (
      <div className="action-footer mobile-footer-fixed-buttons">
        <SpriteIcon name="arrow-right" className="mobile-next-button" onClick={reviewBrick} />
      </div>
    );
  }

  const renderSpendTime = () => {
    return <div>Aim to spend {getSynthesisTime(brick.brickLength)} minutes on this section.</div>;
  }

  const renderBrickCircle = (color: string) => {
    return (
      <div className="left-brick-circle">
        <div className="round-button" style={{ background: `${color}` }}>
          {brick.academicLevel && AcademicLevelLabels[brick.academicLevel]}
        </div>
      </div>
    );
  }

  const renderMobileHeader = (color: string) => {
    return (
      <div className="intro-header expanded-intro-header synthesis-header">
        <div className="vertical-center">
          {renderBrickCircle(color)}
        </div>
        <div className="r-title-container">
          <div className="heading synthesis-title">Synthesis</div>
          {renderSpendTime()}
        </div>
      </div>
    );
  }

  const renderMobile = () => {
    let color = "#B0B0AD";

    if (brick.subject) {
      color = brick.subject.color;
    }

    return (
      <div className="brick-container synthesis-page mobile-synthesis-page">
        <div className="introduction-page">
          {renderMobileHeader(color)}
          <div className="introduction-content">
            {renderSynthesisContent()}
            {isPhone() ? renderPhoneButton() : renderFooter()}
          </div>
          <div className="time-container">
            <TimeProgressbarV2 isSynthesis={true} setEndTime={() => {}} onEnd={() => { }} brickLength={brick.brickLength} />
          </div>
        </div>
      </div>
    );
  }

  const minutes = getSynthesisTime(brick.brickLength);

  return (
    <div className="brick-row-container synthesis-container">
      {isPhone() ? renderMobile() :
        <div className="brick-container play-preview-panel synthesis-page">
          <div className="fixed-upper-b-title">
            <BrickTitle title={brick.title} />
          </div>
          <div className="header">
            Synthesis
          </div>
          <div className="introduction-page">
            {renderSynthesisContent()}
            <div className="new-layout-footer" style={{ display: 'none' }}>
              <div className="time-container">
                <TimeProgressbarV2 isSynthesis={true} minutes={minutes} setEndTime={() => {}} onEnd={() => { }} brickLength={brick.brickLength} />
              </div>
              <div className="footer-space" />
              <div className="new-navigation-buttons">
                <div className="n-btn next" onClick={props.moveNext}>
                  Review
                  <SpriteIcon name="arrow-right" />
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default PlaySynthesisPage;
