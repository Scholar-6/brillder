import React from "react";
import { useHistory } from 'react-router-dom';

import './nextButton.scss';
import { BrickLengthRoutePart, BriefRoutePart, OpenQuestionRoutePart, PrepRoutePart, ProposalReviewPart, ProposalStep, TitleRoutePart } from "../model";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface NextButtonProps {
  baseUrl: string;
  isActive: boolean;
  step: ProposalStep;
  canSubmit: boolean;
  onSubmit(data?:any): void;
  data?: any;
}

const NextButton:React.FC<NextButtonProps> = (
  { baseUrl, onSubmit, ...props }
) => {
  const history = useHistory()

  const next = () => {
    if (props.canSubmit === true) {
      if (onSubmit) {
        onSubmit(props.data);
      }
      switch (props.step) {
        case ProposalStep.Subject:
          return history.push(baseUrl + TitleRoutePart);
        case ProposalStep.BrickTitle:
          return history.push(baseUrl + OpenQuestionRoutePart);
        case ProposalStep.OpenQuestion:
          return history.push(baseUrl + BrickLengthRoutePart);
        case ProposalStep.BrickLength:
          return history.push(baseUrl + BriefRoutePart);
          case ProposalStep.Brief:
          return history.push(baseUrl + PrepRoutePart);
        case ProposalStep.Prep:
          return history.push(baseUrl + ProposalReviewPart);
      }
    }
  }

  return (
    <button className="btn btn-transparent tut-next svgOnHover" onClick={next}>
      <SpriteIcon
        name="arrow-right"
        className={`active h100 w100 ${props.isActive ? "text-theme-orange":"text-gray" }`}
      />
    </button>
  );
}

export default NextButton
