import React from "react";

import { Brick } from "model/brick";
import { getReviewTime } from "../services/playTimes";
import Hourglass from "../baseComponents/hourglass/Hourglass";

interface Props {
  brick: Brick;
  moveNext(): void;
}

const CountdownReview: React.FC<Props> = ({ brick, ...props }) => {
  const minutes = getReviewTime(brick.brickLength);

  return (
    <div className="count-investigation">
      <div
        className="fixed-upper-b-title"
        dangerouslySetInnerHTML={{ __html: brick.title }}
      />
      <div className="count-introduction-page">
        <div className="ss-phone-before-title" />
        <div className="title s-fade1">
          <div>Round 2</div>
          <div className="regular">Review</div>
        </div>
        <div className="ss-phone-after-title" />
        <div className="flex-center">
          <Hourglass isRed={true} />
        </div>
        <div className="ss-after-glasses" />
        <div className="last-text s-fade3">
          <div>You have <span className="text-orange">{minutes} minutes</span> to review your</div>
          <div>answers and improve your score.</div>
        </div>
      </div>
    </div>
  );
};

export default CountdownReview;
