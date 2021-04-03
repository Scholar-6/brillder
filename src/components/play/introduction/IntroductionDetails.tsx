import React from "react";
import { getLiveTime, getPrepareTime, getReviewTime, getSynthesisTime } from "../services/playTimes";


interface IntroductionProps {
  brickLength: number;
}

const IntroductionDetails: React.FC<IntroductionProps> = ({ brickLength }) => {
  const prepare = getPrepareTime(brickLength);
  const investigation = getLiveTime(brickLength);
  const synthesis = getSynthesisTime(brickLength);
  const review = getReviewTime(brickLength);

  return (
    <div className="intro-text-row">
      <p>The Brick is divided into four sections:</p>
      <ul>
        <li>{prepare} minutes Preparation</li>
        <li>{investigation} minutes Investigation</li>
        <li>{synthesis} minutes to absorb the Synthesis</li>
        <li>{review} minutes Review to maximise your score</li>
      </ul>
    </div>
  );
};

export default IntroductionDetails;
