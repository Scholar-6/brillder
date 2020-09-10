import React from "react";

import sprite from "assets/img/icons-sprite.svg";
import { Question } from "model/question";

interface ButtonProps {
  questions: Question[];
  activeStep: number;
  onClick(status: boolean): void;
}

const MobileNextButton: React.FC<ButtonProps> = ({ questions, activeStep, onClick }) => {
  if (questions.length - 1 > activeStep) {
    return <div></div>;
  }
  return (
    <button
      type="button"
      className="play-preview svgOnHover play-green mobile-next"
      onClick={() => onClick(true)}
    >
      <svg className="svg w80 h80 active" style={{ margin: 0 }}>
        {/*eslint-disable-next-line*/}
        <use href={sprite + "#check-icon-thin"} />
      </svg>
    </button>
  );
};

export default MobileNextButton;
