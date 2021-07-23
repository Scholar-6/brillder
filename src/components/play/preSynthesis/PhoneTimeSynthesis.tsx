import React from "react";

import { Brick } from "model/brick";
import DummyProgressbarCountdown from "../baseComponents/timeProgressbar/DummyTimeProgressbar";
import { getSynthesisTime } from "../services/playTimes";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import BrainAnimated from "./BrainAnimated";

interface Props {
  brick: Brick;
}

const PhoneTimeSynthesisPage: React.FC<Props> = ({ brick }) => {
  const minutes = getSynthesisTime(brick.brickLength);

  return (
    <div className="time-synthesis">
      <div className="fixed-upper-b-title" dangerouslySetInnerHTML={{ __html: brick.title }} />
      <div className="introduction-page">
        <div className="ss-phone-before-brain" />
        <div className="brain-container ss-fade1">
          <BrainAnimated />
        </div>
        <div className="ss-phone-before-title" />
        <div className="title">
          <div>Spend about {minutes} minutes</div>
          <div>on this stage.</div>
        </div>
        <div className="ss-phone-after-title" />
        <div className="last-text">
          <div>The progress bar will show you how much</div>
          <div>time you have spent on the synthesis.</div>
        </div>
        <div className="fe-arrow-container">
          <SpriteIcon name="play-red-arrow" />
        </div>
        <div className="new-layout-footer">
          <div className="time-container">
            <DummyProgressbarCountdown value={50} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneTimeSynthesisPage;
