import React from "react";
import { useHistory } from 'react-router-dom';

import { ProposalStep } from "../../model";
import './Navigation.scss';
import { Grid } from "@material-ui/core";

interface NextButtonProps {
  step: ProposalStep
}

const NextButton:React.FC<NextButtonProps> = ({ step }) => {
  const history = useHistory()

  const moveToTitles = () => {
    history.push('/build/new-brick/brick-title');
  }

  const moveToOpenQuestion = () => {
    history.push('/build/new-brick/open-question');
  }

  const moveToBrief = () => {
    history.push('/build/new-brick/brief');
  }

  const moveToPrep = () => {
    history.push('/build/new-brick/prep');
  }

  const moveToLength = () => {
    history.push('/build/new-brick/length');
  }

  return (
    <div className="navigation-container">
      <Grid container item justify="center">
        <div className="step-container">
          <div className={`step-label ${step === ProposalStep.BrickTitle ? 'active' : ''}`}>Title</div>
          <div className="navigation-button navigation-titles" onClick={moveToTitles} />
        </div>
        <div className="step-container">
          <div className={`step-label ${step === ProposalStep.OpenQuestion ? 'active' : ''}`}>Open Question</div>
          <div
            className={`navigation-button navigation-question ${step >= ProposalStep.OpenQuestion ? 'active' : ''}`}
            onClick={moveToOpenQuestion}
          />
        </div>
        <div className="step-container">
          <div className={`step-label ${step === ProposalStep.Brief ? 'active' : ''}`}>Brief</div>
          <div
            className={`navigation-button navigation-brief ${step >= ProposalStep.Brief ? 'active' : ''}`}
            onClick={moveToBrief}
          />
        </div>
        <div className="step-container">
          <div className={`step-label ${step === ProposalStep.Prep ? 'active' : ''}`}>Prep</div>
          <div
            onClick={moveToPrep}
            className={`navigation-button navigation-prep ${step >= ProposalStep.Brief ? 'active' : ''}`}
          />
        </div>
        <div className="step-container">
          <div className={`step-label ${step === ProposalStep.BrickLength ? 'active' : ''}`}>Length</div>
          <div
            onClick={moveToLength}
            className={`navigation-button navigation-length ${step >= ProposalStep.Brief ? 'active' : ''}`}
          />
        </div>
      </Grid>
    </div>
  );
}

export default NextButton
