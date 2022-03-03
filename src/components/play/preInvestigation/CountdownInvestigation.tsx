import React from "react";

import { Brick } from "model/brick";

import { useEffect } from "react";
import { rightKeyPressed } from "components/services/key";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { getLiveTime } from "../services/playTimes";
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

  const minutes = getLiveTime(brick.brickLength);

  return (
    <div className="brick-row-container live-container static-top-part">
      <div className="fixed-upper-b-title q-brick-title" dangerouslySetInnerHTML={{ __html: brick.title }} />
      <div className="brick-container play-preview-panel live-page after-cover-page pre-investigation animate-fade">
        <div className="introduction-page">
          <div className="after-cover-main-content static-top-part-inner count-down-content">
            <div className="title s-fade1">
              <div className="bold">Round 1</div>
              <div className="regular">Investigation</div>
            </div>
            <div className="flex-center hourglass-container s-fade2">
              <Hourglass />
            </div>
            <div className="footer s-fade3">
              <div>You have <span className="text-orange">{minutes} minutes</span> to have a first crack at the questions.</div>
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
