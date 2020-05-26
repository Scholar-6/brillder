import React from "react";

import "./PlayButton.scss";
import { TutorialStep } from "../tutorial/TutorialPanelWorkArea";
import { useHistory } from "react-router-dom";
import { Grid } from "@material-ui/core";


export interface PlayButtonProps {
  tutorialStep: TutorialStep;
  isTutorialSkipped: boolean;
}

const PlayButton: React.FC<PlayButtonProps> = ({tutorialStep, isTutorialSkipped}) => {
  const renderButtonImage = () => {
    if (tutorialStep === TutorialStep.Play) {
      return <img alt="" src="/feathericons/play-circle-white-green.png" />
    } else {
      return <img alt="" src="/feathericons/play-circle-custom-grey.png" />;
    }
  }
  const renderButton = () => {
    return (
      <div className="play-button-container">
        <div className={isTutorialSkipped ? "hidden" : ""}>Play Preview</div>
        <Grid container justify="center">
          {renderButtonImage()}
        </Grid>
      </div>
    );
  }
  if (tutorialStep >= TutorialStep.Play || isTutorialSkipped) {
    return renderButton();
  }
  return <div></div>
};

export default PlayButton;
