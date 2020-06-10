import React from "react";

import "./PlayButton.scss";
import { TutorialStep } from "../tutorial/TutorialPanelWorkArea";
import { Grid } from "@material-ui/core";
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
      return 'play-green animated pulse';
    }
    if (isTutorialSkipped) {
      return 'play-white';
    }
    return 'play-white disabled';
  }
  const renderButton = () => {
    return (
      <button type="button" className={"play-preview svgOnHover " + renderButtonClass()} onClick={() => onClick()}>
        <svg className="svg svg-default">
          <use href={sprite + "#play-thin"} />
        </svg>
        <svg className="svg colored">
          <use href={sprite + "#play-thick"} />
        </svg>
        <span className={isTutorialSkipped ? "hidden" : ""}>Play Preview</span>
      </button>
    );
  }
  if (tutorialStep >= TutorialStep.Play || isTutorialSkipped) {
    return renderButton();
  }
  return <div></div>
};

export default PlayButton;
