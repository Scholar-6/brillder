import React from "react";

import { Brick } from "model/brick";
import { getReviewTime } from "../services/playTimes";

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
          <div>You have <span className="text-orange">{minutes} minutes</span> to review your</div>
          <div>answers and improve your score.</div>
        </div>
        <div className="ss-phone-after-title" />
        <svg className="hourglass s-fade2" viewBox="0 0 162 351.999">
          <g id="Group_519" data-name="Group 519" transform="translate(-0.459 -0.234)">
            <path id="Exclusion_5" data-name="Exclusion 5" d="M146,352H16A16,16,0,0,1,0,336V207.147L30.281,176,0,144.849V16A16,16,0,0,1,16,0H146a16,16,0,0,1,16,16V144.849L131.719,176,162,207.149V336a16,16,0,0,1-16,16Z" transform="translate(0.459 0.234)" fill="#c43c30" />
            <path id="Exclusion_6" data-name="Exclusion 6" d="M120.989,280.139H16.035a16,16,0,0,1-16-16V165.067L0,165.081v-49.8l.033.014v49.775L60.07,140.18.035,115.292V16a16,16,0,0,1,16-16H120.989a16,16,0,0,1,16,16v99.058L77.374,139.743l59.615,25.117v99.279a16,16,0,0,1-16,16Z" transform="translate(12.417 35.796)" fill="#fff" />
            <g id="Group_518" data-name="Group 518">
              <path id="Path_5302" data-name="Path 5302" d="M9393.883,424.531V345.437a544.128,544.128,0,0,1,61.838-4.02,572.281,572.281,0,0,1,62.789,4.02l.289,79.094s-31.052,20.511-62.21,20.511S9393.883,424.531,9393.883,424.531Z" transform="translate(-9375.39 -278.515)" fill="#c43c30" />
              <path id="Path_5303" data-name="Path 5303" d="M9393.283,494.356s2.414,9.518,7.4,14.545,12.555,5.565,12.555,5.565h87.9a16.927,16.927,0,0,0,10.162-5.565c4.426-5.028,7.535-14.545,7.535-14.545s-32.461-17.78-63.852-17.78S9393.283,494.356,9393.283,494.356Z" transform="translate(-9375.723 -203.322)" fill="#c43c30" />
              <rect id="Rectangle_1206" data-name="Rectangle 1206" width="9" height="112" transform="translate(76.459 163.234)" fill="#c43c30" />
            </g>
          </g>
        </svg>
        <div className="ss-after-glasses" />
        <div className="last-text s-fade3">
          <div>Your final score will be an average of</div>
          <div>your provisional and review scores.</div>
          <div>You can replay this brick as many</div>
          <div>times as you like after this.</div>
        </div>
      </div>
    </div>
  );
};

export default CountdownReview;
