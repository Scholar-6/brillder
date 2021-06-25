import React from "react";

import { Brick } from "model/brick";

import { useEffect } from "react";
import { rightKeyPressed } from "components/services/key";
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

  const minutes = getLiveTime(brick.brickLength);

  return (
    <div className="pre-investigation">
      <div className="fixed-upper-b-title" dangerouslySetInnerHTML={{ __html: brick.title }} />
      <div className="introduction-page">
        <div className="ss-phone-before-title" />
        <div className="title s-fade1">
          Time for some questions.
        </div>
        <div className="ss-phone-after-title" />
        <div className="like-button">Preparation</div>
        <div className="ss-phone-between-button" />
        <div className="like-button orange" onClick={() => setMoving(true)}>Investigation</div>
        <div className="ss-phone-between-button" />
        <div className="like-button">Synthesis</div>
        <div className="ss-phone-between-button" />
        <div className="like-button">Review</div>
        <div className="ss-phone-after-buttons" />
        <div className="footer s-fade3">
          You have<span className="underline-border"> {minutes} minutes </span>to complete the investigation. Once time is up, you will get a provisional score.
        </div>
        <div className="new-layout-footer">
          <div className="time-container">
            <DummyProgressbarCountdown value={100} deadline={true} />
          </div>
        </div>
      </div>
      <div className="fixed-bottom-click-area" onClick={(e) => {
          console.log('on click');
          e.stopPropagation();
          setMoving(true);
        }} />
    </div>
  );
};

export default PreInvestigationPage;
