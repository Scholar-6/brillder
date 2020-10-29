import React from "react";


interface IntroductionProps {
  brickLength: number;
}

const IntroductionDetails: React.FC<IntroductionProps> = ({ brickLength }) => {
  let prepare = 5;
  let investigation = 8;
  let synthesis = 4;
  let review = 3;

  if (brickLength === 40) {
    prepare = 10;
    investigation = 16;
    synthesis = 8;
    review = 6;
  } else if (brickLength === 60) {
    prepare = 15;
    investigation = 24;
    synthesis = 12;
    review = 9;
  }

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
