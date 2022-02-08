import React from "react";

import { Brick } from "model/brick";
import { getLiveTime } from "../services/playTimes";
import Hourglass from "../baseComponents/hourglass/Hourglass";

interface Props {
  brick: Brick;
  moveNext(): void;
}

const CountInvestigationPage: React.FC<Props> = ({ brick, ...props }) => {
  const minutes = getLiveTime(brick.brickLength);

  return (
    <div className="count-investigation">
      <div
        className="fixed-upper-b-title"
        dangerouslySetInnerHTML={{ __html: brick.title }}
      />
      <div className="count-introduction-page">
        <div className="ss-phone-before-title" />
        <div className="title s-fade1">
          <div>You have <span className="text-orange"> {minutes} minutes </span> to have a first</div>
          <div>crack at the questions</div>
        </div>
        <div className="ss-phone-after-title" />
        <div className="flex-center">
          <Hourglass />
        </div>
        <div className="ss-after-glasses" />
        <div className="last-text s-fade3">
          <div>Don’t worry if you are unable to</div>
          <div>answer everything in time - you can</div>
          <div>have another go after reading the</div>
          <div>Synthesis of this brick.</div>
        </div>
      </div>
    </div>
  );
};

export default CountInvestigationPage;