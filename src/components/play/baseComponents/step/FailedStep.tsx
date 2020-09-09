import React from "react";

import sprite from "assets/img/icons-sprite.svg";

interface StepProps {
  index: number;
  handleStep(index: number): void;
}

const FailedStep: React.FC<StepProps> = ({ index, handleStep }) => {
  return (
    <div className="step" key={index} onClick={() => handleStep(index - 1)}>
      <span className="blue">{index}</span>
      <svg className="svg active">
        {/*eslint-disable-next-line*/}
        <use href={sprite + "#cancel"} className="text-theme-orange" />
      </svg>
    </div>
  );
};

export default FailedStep;
