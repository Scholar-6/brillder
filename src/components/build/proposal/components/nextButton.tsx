import React from "react";
import { useHistory } from 'react-router-dom';

import { ProposalStep } from "../model";
import './nextButton.scss';
import { Grid, Button } from "@material-ui/core";
import sprite from "assets/img/icons-sprite.svg";
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
          return history.push(`${url}/proposal`);
      }
    }
  }

  return (
    <button className="btn btn-transparent tut-next svgOnHover" onClick={next}>
      <svg className="svg active h100 w100">
        <use href={ sprite + "#arrow-down"} className={isActive ? "text-theme-orange":"text-gray" } />
      </svg>
    </button>
  );
}

export default NextButton
