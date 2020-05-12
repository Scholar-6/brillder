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
          {
            step === ProposalStep.BrickTitle ? <div className="step-label">Title</div> : ""
          }
          <div className="navigation-button navigation-titles" onClick={moveToTitles} />
        </div>
        <div className="step-container">
          {
            step === ProposalStep.OpenQuestion ? <div className="step-label">Open Question</div> : ""
          }
          <div
            className={`navigation-button navigation-question ${step >= ProposalStep.OpenQuestion ? 'active' : ''}`}
            onClick={moveToOpenQuestion}
          />
        </div>
        <div className="step-container">
          {
            step === ProposalStep.Brief ? <div className="step-label">Brief</div> : ""
          }
          <div
            className={`navigation-button navigation-brief ${step >= ProposalStep.Brief ? 'active' : ''}`}
            onClick={moveToBrief}
          />
        </div>
        <div className="step-container">
          {
            step === ProposalStep.Prep ? <div className="step-label">Prep</div> : ""
          }
          <div
            onClick={moveToPrep}
            className={`navigation-button navigation-prep ${step >= ProposalStep.Brief ? 'active' : ''}`}
          />
        </div>
        <div className="step-container">
          {
            step === ProposalStep.BrickLength ? <div className="step-label">Length</div> : ""
          }
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
