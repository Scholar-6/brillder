import React from "react";

import sprite from "assets/img/icons-sprite.svg";
import { Question } from "model/question";

interface ButtonProps {
  activeStep: number;
  questions: Question[];
  next(): void;
  setSubmitAnswers(submit: boolean): void;
}

const LiveSubmitButton: React.FC<ButtonProps> = ({
  questions, activeStep, next, setSubmitAnswers
}) => {
  if (questions.length - 1 > activeStep) {
    return (
      <button
        type="button"
        className="play-preview svgOnHover play-green"
        onClick={next}
      >
        <svg className="svg w80 h80 active m-l-02">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#arrow-right"} />
        </svg>
      </button>
    );
  }
  return (
    <button
      type="button"
      className="play-preview svgOnHover play-green"
      onClick={() => setSubmitAnswers(true)}
    >
      <svg className="svg w80 h80 active" style={{ margin: 0 }}>
        {/*eslint-disable-next-line*/}
        <use href={sprite + "#check-icon-thin"} />
      </svg>
    </button>
  );
};

export default LiveSubmitButton;
