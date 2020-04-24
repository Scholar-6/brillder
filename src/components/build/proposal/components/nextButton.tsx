import React from "react";
import { useHistory } from 'react-router-dom';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { IconButton } from "material-ui";

import { ProposalStep } from "../model";
import './nextButton.scss';

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
    <div className="tutorial-next-container">
      <IconButton className="tutorial-next-button" onClick={next} aria-label="next">
        <ArrowForwardIosIcon className="tutorial-next-icon" />
      </IconButton>
    </div>
  );
}

export default NextButton
