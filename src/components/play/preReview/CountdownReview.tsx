import React from "react";

import { Brick } from "model/brick";

import { useEffect } from "react";
import { rightKeyPressed } from "components/services/key";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { getReviewTime } from "../services/playTimes";
import Hourglass from "../baseComponents/hourglass/Hourglass";
import MusicWrapper from "components/baseComponents/MusicWrapper";

interface Props {
  brick: Brick;
  moveNext(): void;
}

const CountdownInvestigationPage: React.FC<Props> = ({ brick, moveNext }) => {
  useEffect(() => {
    function handleMove(e: any) {
      if (rightKeyPressed(e)) {
        moveNext();
      }
    }

    document.addEventListener("keydown", handleMove, false);

    return function cleanup() {
      document.removeEventListener("keydown", handleMove, false);
    };
  });

  const minutes = getReviewTime(brick.brickLength);

  return (
    <div className="brick-row-container live-container static-top-part">
      <div className="fixed-upper-b-title q-brick-title" dangerouslySetInnerHTML={{ __html: brick.title }} />
      <div className="brick-container play-preview-panel live-page after-cover-page pre-investigation animate-fade">
        <div className="introduction-page">
          <div className="after-cover-main-content count-down-content static-top-part-inner">
            <div className="title s-fade1">
              <div>Round 2</div>
              <div className="regular">Review</div>
            </div>
            <div className="flex-center">
              <Hourglass isRed={true} />
            </div>
            <div className="footer s-fade3">
              You have <span className="text-orange">{minutes} minutes</span> to review your answers and improve your score.
            </div>
          </div>
          <div className="new-layout-footer" style={{ display: 'none' }}>
            <div className="time-container" />
            <div className="minutes" />
            <div className="footer-space" />
            <div className="new-navigation-buttons">
              <MusicWrapper startTime={0.15} url="/sounds/mixkit-camera-shutter-click.wav">
                <div className="n-btn next" onClick={moveNext}>
                  Start Timer
                  <SpriteIcon name="arrow-right" />
                </div>
              </MusicWrapper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownInvestigationPage;
