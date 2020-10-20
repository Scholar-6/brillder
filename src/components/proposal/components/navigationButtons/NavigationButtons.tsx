import React from "react";

import NextButton from '../nextButton';
import PreviousButton from '../previousButton';
import { ProposalStep } from "../../model";
import './NavigationButtons.scss';


interface NavigationButtonsProps {
  step: ProposalStep
  canSubmit: boolean
  onSubmit(data?:any): void
  data: any
  backLink: string
}

const NavigationButtons:React.FC<NavigationButtonsProps> = (
  { step, canSubmit, onSubmit, data, backLink }
) => {
  let [active, toggleActive] = React.useState(true);
  const onPrevHover = () => {
    toggleActive(false);
  }

  const onPrevOut = () => {
    toggleActive(true);
  }

  return (
    <div className="tutorial-pagination">
      <PreviousButton
        isActive={!active}
        onHover={onPrevHover}
        onOut={onPrevOut}
        to={backLink}
      />
      <NextButton
        isActive={active}
        step={step}
        canSubmit={canSubmit}
        onSubmit={onSubmit}
        data={data}
      />
    </div>
  );
}

export default NavigationButtons;

