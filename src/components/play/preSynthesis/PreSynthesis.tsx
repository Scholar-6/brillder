import React from "react";

import { Brick } from "model/brick";

import { useEffect } from "react";
import { rightKeyPressed } from "components/services/key";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import DummyProgressbarCountdown from "../baseComponents/timeProgressbar/DummyTimeProgressbar";
import { getSynthesisTime } from "../services/playTimes";
import routes from "../routes";

interface Props {
  brick: Brick;
  history: any;
}

const PreSynthesis: React.FC<Props> = ({ brick, ...props }) => {
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

  const minutes = getSynthesisTime(brick.brickLength);

  return (
    <div className="brick-row-container live-container">
      <div className="fixed-upper-b-title q-brick-title" dangerouslySetInnerHTML={{ __html: brick.title }} />
      <div className="brick-container play-preview-panel live-page after-cover-page pre-synthesis animate-fade">
        <div className="introduction-page">
          <div className="after-cover-main-content">
            <div className="title s-fade1">
              Deepen your understanding.
            </div>
            <div className="like-buttons-container s-fade2">
              <div className="x-center">
                <div className="like-button">Preparation</div>
              </div>
              <div className="x-center">
                <div className="like-button">Investigation</div><div className="like-button orange" onClick={moveNext}>Synthesis</div>
              </div>
              <div className="x-center">
                <div className="like-button">Review</div>
              </div>
            </div>
            <div className="footer s-fade3">
              Spend about<span className="underline-border"> {minutes} minutes </span>on this stage before reviewing your answers to improve your score.
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
                Read Synthesis
                <SpriteIcon name="arrow-right" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreSynthesis;
