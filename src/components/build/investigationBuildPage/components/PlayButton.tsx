import React from "react";

import "./PlayButton.scss";
import { TutorialStep } from "../tutorial/TutorialPanelWorkArea";
import { useHistory } from "react-router-dom";
import { Grid } from "@material-ui/core";


export interface PlayButtonProps {
  tutorialStep: TutorialStep;
}

const PlayButton: React.FC<PlayButtonProps> = ({tutorialStep}) => {
  if (tutorialStep >= TutorialStep.Play) {

    return (
      <div className="play-button-container">
        <div>Play Preview</div>
        <Grid container justify="center">
          <img
            alt=""
            src={
              tutorialStep === TutorialStep.Play
                ? "/feathericons/play-circle-white-green.png"
                : "/feathericons/play-circle-custom-grey.png"
            }
          />
        </Grid>
      </div>
    );
  }
  return <div></div>
};

export default PlayButton;
