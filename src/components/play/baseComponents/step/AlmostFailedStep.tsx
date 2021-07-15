import React from "react";

import SpriteIcon from "components/baseComponents/SpriteIcon";

interface StepProps {
  index: number;
  handleStep(index: number): void;
}

const AlmostFailedStep: React.FC<StepProps> = ({ index, handleStep }) => {
  return (
    <div className="step" onClick={() => handleStep(index - 1)}>
      <div>
        <span className="blue">{index}</span>
        <SpriteIcon name="cancel-custom" className="active text-yellow" />
      </div>
    </div>
  );
};

export default AlmostFailedStep;
