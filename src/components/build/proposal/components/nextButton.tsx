import React from "react";
import { useHistory } from 'react-router-dom';

import { ProposalStep } from "../model";
import './nextButton.scss';
import { Grid } from "@material-ui/core";

interface NextButtonProps {
  isActive: boolean
  step: ProposalStep
  canSubmit: boolean
  onSubmit(data?:any): void
  data?: any
}

const NextButton:React.FC<NextButtonProps> = (
  { step, canSubmit, onSubmit, data, isActive }
) => {
  const history = useHistory()
  const url = "/build/new-brick"

  const next = () => {
    if (canSubmit === true) {
      if (onSubmit) {
        onSubmit(data);
      }
      switch (step) {
        case ProposalStep.Subject:
          return history.push(`${url}/brick-title`);
        case ProposalStep.BrickTitle:
          return history.push(`${url}/open-question`);
        case ProposalStep.OpenQuestion:
          return history.push(`${url}/brief`);
        case ProposalStep.Brief:
          return history.push(`${url}/prep`);
        case ProposalStep.Prep:
          return history.push(`${url}/length`);
        case ProposalStep.BrickLength:
          return history.push(`${url}/editor`)
        case ProposalStep.BrickEditor:
          return history.push(`${url}/proposal`);
      }
    }
  }

  return (
    <Grid container justify="center" className="tutorial-next-container">
      <img
        alt=""
        src={
          isActive
            ? "/feathericons/chevron-down-orange.png"
            : "/feathericons/chevron-down-gray.png"
        }
        onClick={next}
      />
    </Grid>
  );
}

export default NextButton
