import React from "react";

import "./PlayButton.scss";
import { TutorialStep } from "../tutorial/TutorialPanelWorkArea";
import sprite from "../../../../assets/img/icons-sprite.svg";


export interface PlayButtonProps {
  tutorialStep: TutorialStep;
  isTutorialSkipped: boolean;
  isValid: boolean;
  onClick(): void;
}

const PlayButton: React.FC<PlayButtonProps> = ({
  tutorialStep, isTutorialSkipped, isValid, onClick
}) => {
  const renderButtonClass = () => {
    if (tutorialStep === TutorialStep.Play) {
      return 'play-green disabled';
    } else if (isValid) {
      return 'play-green animated pulse iteration-5 duration-1s';
    }
    if (isTutorialSkipped) {
      return 'bg-tab-gray';
    }
    return 'bg-tab-gray disabled';
  }
  const renderButton = () => {
    return (
      <button type="button" className={"play-preview svgOnHover " + renderButtonClass()} onClick={() => onClick()}>
        <svg className="svg w80 h80 svg-default m-l-02">
          <use href={sprite + "#play-thin"} className="text-white" />
        </svg>
        <svg className="svg w80 h80 colored m-l-02">
          <use href={sprite + "#play-thick"} className="text-white" />
        </svg>
        {/* <span className={//isTutorialSkipped ? "hidden" : ""}>Play Preview</span> */}
      </button>
    );
  }
  if (tutorialStep >= TutorialStep.Play || isTutorialSkipped) {
    return renderButton();
  }
  return <div></div>
};

export default PlayButton;
