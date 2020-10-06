import React from "react";

import SpriteIcon from "components/baseComponents/SpriteIcon";

interface StepProps {
  index: number;
  handleStep(index: number): void;
}

const FailedStep: React.FC<StepProps> = ({ index, handleStep }) => {
  return (
    <div className="step" onClick={() => handleStep(index - 1)}>
      <span className="blue">{index}</span>
      <SpriteIcon name="cancel" className="active text-theme-orange" />
    </div>
  );
};

export default FailedStep;
