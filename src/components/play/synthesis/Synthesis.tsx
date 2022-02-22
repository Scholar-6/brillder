import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";

import "./Synthesis.scss";
import map from "components/map";

import { Brick } from "model/brick";
import { PlayStatus } from "../model";
import { PlayMode } from "../model";
import HighlightHtml from "../baseComponents/HighlightHtml";
import { BrickFieldNames } from "components/build/proposal/model";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { rightKeyPressed } from "components/services/key";
import { getSynthesisTime } from "../services/playTimes";
import { isPhone } from "services/phone";
import TimeProgressbarV2 from "../baseComponents/timeProgressbar/TimeProgressbarV2";
import BrickTitle from "components/baseComponents/BrickTitle";
import TimeProgressbar from "../baseComponents/timeProgressbar/TimeProgressbar";

import routes from "../routes";
import { isMobile } from "react-device-detect";

interface SynthesisProps {
  isPlayPreview?: boolean;
  status: PlayStatus;
  brick: Brick;

  attempts: any[];
  history: any;
  endTime: any;
  setEndTime(t: any): void;

  // only for real play
  mode?: PlayMode;
  moveNext(): void;
  onHighlight?(name: BrickFieldNames, value: string): void;
}

const PlaySynthesisPage: React.FC<SynthesisProps> = ({
  status,
  brick,
  ...props
}) => {
  const { attempts } = props;

  const [percentageScore, setScore] = React.useState(-1);
  const [timerHidden, hideTimer] = React.useState(false);
  const [popupOpen, setPopup] = React.useState(false);
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

  useEffect(() => {
    const score = attempts.reduce((acc, answer) => {
      if (!answer || !answer.marks) {
        return acc + 0;
      }
      return acc + answer.marks;
    }, 0);
    const maxScore = attempts.reduce((acc, answer) => {
      if (!answer) {
        return acc;
      }
      if (!answer.maxMarks) {
        return acc + 5;
      }
      return acc + answer.maxMarks;
    }, 0);

    setScore(Math.round((score * 100) / maxScore));
  }, [attempts])

  if (status === PlayStatus.Live) {
    if (isPhone()) {
      history.push(routes.phonePrep(brick));
    } else {
      // direct access only for work for play preview
      if (!props.isPlayPreview) {
        history.push(routes.playNewPrep(brick));
      }
    }
  }

  const reviewBrick = () => props.moveNext();

  const renderSynthesisContent = () => {
    return (
      <div className="synthesis-content">
        <HighlightHtml
          mode={props.mode}
          value={brick.synthesis}
          isSynthesis={true}
          onHighlight={(value) => {
            if (props.onHighlight) {
              props.onHighlight(BrickFieldNames.synthesis, value);
            }
          }}
        />
      </div>
    );
  };

  const renderMobile = () => {
    return (
      <div className="brick-container synthesis-page mobile-synthesis-page">
        <div className="introduction-page">
          <div className="fixed-upper-b-title">Synthesis</div>
          <div className="introduction-content">
            {renderSynthesisContent()}
          </div>
          <div className="time-container">
            <TimeProgressbarV2
              isSynthesis={true}
              setEndTime={() => { }}
              onEnd={() => { }}
              brickLength={brick.brickLength}
            />
          </div>
        </div>
      </div>
    );
  };

  const minutes = getSynthesisTime(brick.brickLength);

  return (
    <div className="brick-row-container synthesis-container">
      {isPhone() ? (
        renderMobile()
      ) : (
        <div className="brick-container play-preview-panel synthesis-page">
          <div className="fixed-upper-b-title">
            <BrickTitle title={brick.title} />
          </div>
          <div className="header">Synthesis</div>
          <div className="introduction-page">
            {renderSynthesisContent()}
            <div className="new-layout-footer" style={{ display: "none" }}>
              <div className="time-container">
                {!timerHidden &&
                  <TimeProgressbar
                    minutes={minutes}
                    setEndTime={props.setEndTime}
                    onEnd={() => { }}
                    endTime={props.endTime}
                    brickLength={brick.brickLength}
                  />}
              </div>
              <div className="footer-space">
                {!isMobile &&
                  <div className="btn toggle-timer" onClick={() => hideTimer(!timerHidden)}>
                    {timerHidden ? 'Show Timer' : 'Hide Timer'}
                  </div>}
              </div>
              <div className="new-navigation-buttons">
                <div className="n-btn next" onClick={() => {
                  if (percentageScore === 100) {
                    setPopup(true);
                  } else {
                    props.moveNext();
                  }
                }}>
                  Review
                  <SpriteIcon name="arrow-right" />
                </div>
              </div>
            </div>
          </div>
          {popupOpen &&
          <Dialog open={popupOpen} onClose={() => setPopup(false)} className="dialog-box">
            <div className="dialog-header">
              <div className="bold" style={{ textAlign: 'center' }}>Do you want to review your answers?</div>
            </div>
            <div className="dialog-footer">
              <button className="btn btn-md bg-theme-orange yes-button" onClick={props.moveNext}>
                <span>Yes</span>
              </button>
              <button className="btn btn-md bg-gray no-button" onClick={() => props.history.push(map.MyLibrarySubject(brick.subjectId))}>
                <span>No</span>
              </button>
            </div>
          </Dialog>}
        </div>
      )}
    </div>
  );
};

export default PlaySynthesisPage;
