import React from "react";

import { Brick } from "model/brick";
import DummyProgressbarCountdown from "../baseComponents/timeProgressbar/DummyTimeProgressbar";
import { getSynthesisTime } from "../services/playTimes";
import SecondsCountDown from "../baseComponents/SecondsCountDown";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface Props {
  brick: Brick;
  moveNext(): void;
}

const PhonePreSynthesisPage: React.FC<Props> = ({ brick, ...props }) => {
  const [isMoving, setMoving] = React.useState(false);

  if (isMoving) {
    return (
      <div className="pre-investigation">
        <div className="fixed-upper-b-title q-brick-title" dangerouslySetInnerHTML={{ __html: brick.title }} />
        <div className="introduction-page">
          <SecondsCountDown onEnd={props.moveNext} />
        </div>
      </div>
    );
  }

  const minutes = getSynthesisTime(brick.brickLength);

  return (
    <div className="pre-investigation">
      <div className="fixed-upper-b-title" dangerouslySetInnerHTML={{ __html: brick.title }} />
      <div className="introduction-page">
        <div className="ss-phone-before-title" />
        <div className="title s-fade1">
          Deepen your understanding.
        </div>
        <div className="ss-phone-after-title" />
        <div className="like-button animate-v1">Preparation</div>
        <div className="ss-phone-between-button" />
        <div className="like-button animate-v1">Investigation</div>
        <div className="ss-phone-between-button" />
        <div className="like-button orange" onClick={() => setMoving(true)}>Synthesis</div>
        <div className="ss-phone-between-button" />
        <div className="like-button animate-v1">Review</div>
        <div className="ss-phone-after-buttons" />
        <div className="footer s-fade3">
          Spend about<span className="underline-border"> {minutes} minutes </span>on this stage before reviewing your answers to improve your score.
        </div>
        <div className="fe-arrow-container">
          <SpriteIcon name="play-red-arrow" />
        </div>
        <div className="new-layout-footer">
          <div className="time-container">
            <DummyProgressbarCountdown value={100} deadline={true} />
          </div>
        </div>
      </div>
      <div className="fixed-bottom-click-area" onClick={(e) => {
          e.stopPropagation();
          setMoving(true);
        }} />
    </div>
  );
};

export default PhonePreSynthesisPage;
