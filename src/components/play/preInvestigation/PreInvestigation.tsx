import React from "react";

import { Brick } from "model/brick";

import { useEffect } from "react";
import { rightKeyPressed } from "components/services/key";
import { isPhone } from "services/phone";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import DummyProgressbarCountdown from "../baseComponents/timeProgressbar/DummyTimeProgressbar";
import { getLiveTime } from "../services/playTimes";
import SecondsCountDown from "../baseComponents/SecondsCountDown";
import { User } from "model/user";

interface Props {
  user: User;
  brick: Brick;
  moveNext(): void;
}

const PreInvestigationPage: React.FC<Props> = ({ brick, ...props }) => {
  const [isMoving, setMoving] = React.useState(false);

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
            <SecondsCountDown onEnd={props.moveNext} />
          </div>
        </div>
      </div>
    );
  }

  const minutes = getLiveTime(brick.brickLength);

  return (
    <div className="brick-row-container live-container">
      <div className="fixed-upper-b-title q-brick-title" dangerouslySetInnerHTML={{ __html: brick.title }} />
      <div className="brick-container play-preview-panel live-page after-cover-page pre-investigation animate-fade">
        <div className="introduction-page">
          <div className="after-cover-main-content">
            <div className="title s-fade1">
              Time for some questions.
            </div>
            <div className="like-buttons-container s-fade2">
              <div className="x-center">
                <div className="like-button">Preparation</div>
              </div>
              <div className="x-center">
                <div className="like-button orange" onClick={() => setMoving(true)}>Investigation</div><div className="like-button">Synthesis</div>
              </div>
              <div className="x-center">
                <div className="like-button">Review</div>
              </div>
            </div>
            <div className="footer s-fade3">
              You have<span className="underline-border"> {minutes} minutes </span>to complete the investigation. Once time is up, you will get a provisional score.
            </div>
          </div>
          <div className="new-layout-footer" style={{ display: 'none' }}>
            <div className="time-container">
              <DummyProgressbarCountdown value={100} deadline={true} />
            </div>
            <div className="minutes">{minutes}:00</div>
            <div className="footer-space" />
            <div className="new-navigation-buttons">
              <div className="n-btn next" onClick={() => setMoving(true)}>
                Play Brick
                <SpriteIcon name="arrow-right" />
              </div>
            </div>
          </div>
        </div>
        {props.user &&
        <div className="fixed-helpers-container">
          <div className="circles">
            <img alt="prep-border-circle" className="prep-circle dashed-circle" src="/images/borders/big-prep-dash-circle.svg" />
          </div>
          <div className="prep">
            <span>Click here to go back to Prep tasks</span>
          </div>
        </div>}
      </div>
    </div>
  );
};

export default PreInvestigationPage;
