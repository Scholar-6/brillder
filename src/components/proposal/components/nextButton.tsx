import React from "react";
import { useHistory } from 'react-router-dom';

import { ProposalStep } from "../model";
import './nextButton.scss';
import sprite from "assets/img/icons-sprite.svg";
import map from 'components/map';

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

  const next = () => {
    if (canSubmit === true) {
      if (onSubmit) {
        onSubmit(data);
      }
      switch (step) {
        case ProposalStep.Subject:
          return history.push(map.ProposalTitle);
        case ProposalStep.BrickTitle:
          return history.push(map.ProposalOpenQuestion);
        case ProposalStep.OpenQuestion:
          return history.push(map.ProposalLength);
        case ProposalStep.BrickLength:
          return history.push(map.ProposalBrief);
          case ProposalStep.Brief:
          return history.push(map.ProposalPrep);
        case ProposalStep.Prep:
          return history.push(map.ProposalReview);
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
