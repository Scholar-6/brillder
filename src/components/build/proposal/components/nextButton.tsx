import React from "react";
import { useHistory } from 'react-router-dom';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { IconButton } from "material-ui";

import { ProposalStep } from "../model";
import './nextButton.scss';
import { Grid } from "@material-ui/core";

interface NextButtonProps {
  step: ProposalStep
  canSubmit: boolean
  onSubmit(data?:any): void
  data?: any
}

const NextButton:React.FC<NextButtonProps> = ({ step, canSubmit, onSubmit, data }) => {
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
          return history.push(`${url}/proposal`);
      }
    }
  }

  return (
    <Grid container justify="center" className="tutorial-next-container">
      <img alt="" src="/feathericons/chevron-down-orange.png" onClick={next} />
    </Grid>
  );
}

export default NextButton
