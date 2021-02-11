import React from "react";

import { Question } from "model/question";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface ButtonProps {
  questions: Question[];
  activeStep: number;
  onClick(): void;
  setSubmitAnswers(value: boolean): void;
}

const MobileNextButton: React.FC<ButtonProps> = ({
  questions, activeStep, onClick, setSubmitAnswers
}) => {
  if (questions.length - 1 > activeStep) {
    return (
      <button
        type="button" onClick={onClick}
        className="play-preview svgOnHover play-green"
      >
        <SpriteIcon name="arrow-right" className="w80 h80 active m-l-02" />
      </button>
    );
  }
  return (
    <button
      type="button" onClick={() => setSubmitAnswers(true)}
      className="play-preview svgOnHover play-green"
    >
      <SpriteIcon name="check-icon-thin" className="w80 h80 active" />
    </button>
  );
};

export default MobileNextButton;
