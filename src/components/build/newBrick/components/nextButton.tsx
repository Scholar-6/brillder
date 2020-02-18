import React from "react";
import { useHistory } from 'react-router-dom';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { IconButton } from "material-ui";
import { Grid } from "@material-ui/core";

import { NewBrickStep } from "../model";
import './nextButton.scss';


function NextButton({ step, canSubmit, onSubmit, data }: any) {
  const history = useHistory()
  const url = "/build/new-brick"

  const next = () => {
    if (canSubmit == true) {
      if (onSubmit) {
        onSubmit(data);
      }
      switch (step) {
        case NewBrickStep.Welcome:
          return history.push(`${url}/choose-subject`);
        case NewBrickStep.ChooseSubject:
          return history.push(`${url}/brick-title`);
        case NewBrickStep.BrickTitle:
          return history.push(`${url}/open-question`);
        case NewBrickStep.OpenQuestion:
          return history.push(`${url}/length`);
        case NewBrickStep.BrickLength:
          return history.push(`${url}/brief-prep`);
        case NewBrickStep.BriefPrep:
          return ""
      }
    }
  }

  return (
    <Grid
      container
      direction="row"
      justify="flex-end"
      alignItems="flex-start"
      className="tutorial-next-container"
    >
      <IconButton className="tutorial-next-button" onClick={next} aria-label="next">
        <ArrowForwardIosIcon className="tutorial-next-icon" />
      </IconButton>
    </Grid>
  );
}

export default NextButton
