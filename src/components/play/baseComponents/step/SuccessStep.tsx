import React from "react";

import SpriteIcon from "components/baseComponents/SpriteIcon";

interface StepProps {
  index: number;
  handleStep(index: number): void;
}

const SuccessStep: React.FC<StepProps> = ({ index, handleStep }) => {
  return (
    <div className="step" onClick={() => handleStep(index - 1)}>
      <div>
        <span className="blue">{index}</span>
        <SpriteIcon name="ok" className="active text-theme-green" />
      </div>
    </div>
  );
};

export default SuccessStep;
