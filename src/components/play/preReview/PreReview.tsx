import React from "react";

import { Brick } from "model/brick";

import { useEffect } from "react";
import { rightKeyPressed } from "components/services/key";
import { isPhone } from "services/phone";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import DummyProgressbarCountdown from "../baseComponents/timeProgressbar/DummyTimeProgressbar";
import { getReviewTime } from "../services/playTimes";
import routes from "../routes";
import SecondsCountDown from "../baseComponents/SecondsCountDown";

interface Props {
  brick: Brick;
  history: any;
}

const PreReview: React.FC<Props> = ({ brick, ...props }) => {
  const [isMoving, setMoving] = React.useState(false);
  
  const moveNext = () => props.history.push(routes.playReview(brick.id));

  useEffect(() => {
    function handleMove(e: any) {
      if (rightKeyPressed(e)) {
        setMoving(true);
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

  if (isMoving) {
    return (
      <div className="brick-row-container live-container">
        <div className="fixed-upper-b-title q-brick-title" dangerouslySetInnerHTML={{ __html: brick.title }} />
        <div className="brick-container play-preview-panel live-page after-cover-page">
          <div className="introduction-page">
            <SecondsCountDown onEnd={moveNext} />
          </div>
        </div>
      </div>
    );
  }

  const minutes = getReviewTime(brick.brickLength);

  return (
    <div className="brick-row-container live-container">
      <div className="fixed-upper-b-title q-brick-title" dangerouslySetInnerHTML={{ __html: brick.title }} />
      <div className="brick-container play-preview-panel live-page after-cover-page pre-synthesis animate-fade">
        <div className="introduction-page">
          <div className="after-cover-main-content">
            <div className="title s-fade1">
              Improve your score.
            </div>
            <div className="like-buttons-container s-fade2">
              <div className="x-center">
                <div className="like-button">Preparation</div>
              </div>
              <div className="x-center">
                <div className="like-button">Investigation</div><div className="like-button">Synthesis</div>
              </div>
              <div className="x-center">
                <div className="like-button orange" onClick={() => setMoving(true)}>Review</div>
              </div>
            </div>
            <div className="footer s-fade3">
              You ha<span className="underline-border">ve {minutes} minutes</span> to review your answers. Once time is up, you will get a final score.
            </div>
          </div>
          <div className="new-layout-footer" style={{ display: 'none' }}>
            <div className="title-column">
              <DummyProgressbarCountdown value={100} deadline={true} />
            </div>
            <div className="minutes-footer">
              {minutes}:00
              </div>
            <div className="footer-space" />
            <div className="new-navigation-buttons">
              <div className="n-btn next" onClick={() => setMoving(true)}>
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
