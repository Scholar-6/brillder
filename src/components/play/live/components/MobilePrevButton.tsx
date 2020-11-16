import React from "react";

import { Question } from "model/question";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface ButtonProps {
  activeStep: number;
  onClick(): void;
}

const MobilePrevButton: React.FC<ButtonProps> = ({ activeStep, onClick }) => {
  if (activeStep <= 0) {
    return <div></div>;
  }
  let icon = 'arrow-left';

  return (
    <button
      type="button"
      className="play-preview svgOnHover play-green mobile-prev"
      onClick={onClick}
    >
      <SpriteIcon name={icon} className="w80 h80 active m-0" />
    </button>
  );
};

export default MobilePrevButton;
