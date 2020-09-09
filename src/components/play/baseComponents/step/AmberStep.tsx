import React from "react";

import sprite from "assets/img/icons-sprite.svg";

interface StepProps {
  index: number;
  handleStep(index: number): void;
}

const SuccessStep: React.FC<StepProps> = ({ index, handleStep }) => {
  return (
    <div className="step" key={index} onClick={() => handleStep(index - 1)}>
      <span className="blue">{index}</span>
      <svg className="svg active">
        {/*eslint-disable-next-line*/}
        <use href={sprite + "#ok"} style={{color: '#ffb55f'}} />
      </svg>
    </div>
  );
};

export default SuccessStep;
