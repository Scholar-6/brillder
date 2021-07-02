import React, { useEffect } from "react";

import "./Synthesis.scss";
import { Brick } from "model/brick";
import { useHistory } from "react-router-dom";
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
import routes from "../routes";

interface SynthesisProps {
  isPlayPreview?: boolean;
  status: PlayStatus;
  brick: Brick;

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
              setEndTime={() => {}}
              onEnd={() => {}}
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
                <TimeProgressbarV2
                  isSynthesis={true}
                  minutes={minutes}
                  setEndTime={() => {}}
                  onEnd={() => {}}
                  brickLength={brick.brickLength}
                />
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
      )}
    </div>
  );
};

export default PlaySynthesisPage;
