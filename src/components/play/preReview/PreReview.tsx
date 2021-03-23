import React from "react";

import { Brick } from "model/brick";

import { useEffect } from "react";
import { rightKeyPressed } from "components/services/key";
import { isPhone } from "services/phone";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import DummyProgressbarCountdown from "../baseComponents/timeProgressbar/DummyTimeProgressbar";
import { getReviewTime, getSynthesisTime } from "../services/playTimes";
import routes from "../routes";

interface Props {
  brick: Brick;
  history: any;
}

const PreReview: React.FC<Props> = ({ brick, ...props }) => {
  const moveNext = () => props.history.push(routes.playSynthesis(brick.id));

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

  if (isPhone()) {
    return <div />;
  }

  const minutes = getReviewTime(brick.brickLength);

  return (
    <div className="brick-row-container live-container">
      <div className="brick-container play-preview-panel live-page after-cover-page pre-synthesis">
        <div className="introduction-page">
          <div className="after-cover-main-content">
            <div className="title">
              Improve your score.
            </div>
            <div className="like-buttons-container">
              <div className="x-center">
                <div className="like-button">Preparation</div>
              </div>
              <div className="x-center">
                <div className="like-button">Investigation</div><div className="like-button">Synthesis</div>
              </div>
              <div className="x-center">
                <div className="like-button orange">Review</div>
              </div>
            </div>
            <div className="footer">
              You ha<span className="underline-border">ve 3 minutes</span> to review your answers. Once time is up, you will get a final score.
            </div>
          </div>
          <div className="new-layout-footer" style={{ display: 'none' }}>
            <div className="title-column">
              <DummyProgressbarCountdown value={23} />
            </div>
            <div className="minutes-footer">
              {minutes}:00
              </div>
            <div className="footer-space" />
            <div className="new-navigation-buttons">
              <div className="n-btn next" onClick={moveNext}>
                Start Review
                <SpriteIcon name="arrow-right" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreReview;
