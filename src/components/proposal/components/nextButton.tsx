import React from "react";
import { useHistory } from 'react-router-dom';

import { ProposalStep } from "../model";
import './nextButton.scss';
import map from 'components/map';
import SpriteIcon from "components/baseComponents/SpriteIcon";

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
      <SpriteIcon
        name="arrow-down"
        className={`active h100 w100 ${isActive ? "text-theme-orange":"text-gray" }`}
      />
    </button>
  );
}

export default NextButton
