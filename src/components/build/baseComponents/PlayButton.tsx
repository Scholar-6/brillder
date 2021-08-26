import React from "react";

import "./PlayButton.scss";
import { TutorialStep } from "../tutorial/TutorialPanelWorkArea";
import sprite from "assets/img/icons-sprite.svg";


export interface PlayButtonProps {
  tutorialStep: TutorialStep;
  isTutorialSkipped: boolean;
  isValid: boolean;
  onClick(): void;
}

const PlayButton: React.FC<PlayButtonProps> = ({
  tutorialStep, isTutorialSkipped, isValid, onClick
}) => {
  const getButtonClass = () => {
    if (isValid) {
      return 'play-green animated pulse-green iteration-5 duration-1s';
    } else if (isTutorialSkipped) {
      return 'bg-tab-gray';
    }
    return 'bg-tab-gray disabled';
  }

  if (tutorialStep >= TutorialStep.Play || isTutorialSkipped) {
    return (
      <button type="button" className={"play-preview preview-tooltip svgOnHover " + getButtonClass()} onClick={onClick}>
        <svg className="svg w80 h80 svg-default m-l-02">
          <use href={sprite + "#play-thin"} className="text-white" />
        </svg>
        <svg className="svg w80 h80 colored m-l-02">
          <use href={sprite + "#play-thick"} className="text-white" />
        </svg>
        <div className="css-custom-tooltip">Play Preview</div>
      </button>
    );
  }
  return <div></div>
};

export default PlayButton;
