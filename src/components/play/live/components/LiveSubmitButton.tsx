import React from "react";

import sprite from "assets/img/icons-sprite.svg";
import { Question } from "model/question";
import SpriteIcon from "components/baseComponents/SpriteIcon";

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
        <SpriteIcon name="arrow-right" className="w80 h80 active m-l-02" />
      </button>
    );
  }
  return (
    <button
      type="button"
      className="play-preview svgOnHover play-green"
      onClick={() => setSubmitAnswers(true)}
    >
      <SpriteIcon name="check-icon-thin" className="w80 h80 active m-l-02" />
    </button>
  );
};

export default LiveSubmitButton;
