import React from "react";

import { Question } from "model/question";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface ButtonProps {
  questions: Question[];
  activeStep: number;
  onClick(): void;
}

const MobileNextButton: React.FC<ButtonProps> = ({ questions, activeStep, onClick }) => {
  let icon = "check-icon-thin";
  if (questions.length - 1 > activeStep) {
    icon = 'arrow-right';
  }
  return (
    <button
      type="button"
      className="play-preview svgOnHover play-green mobile-next"
      onClick={onClick}
    >
      <SpriteIcon name={icon} className="w80 h80 active" />
    </button>
  );
};

export default MobileNextButton;
