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
          <img
            onClick={moveToTitles}
            className="navigation-button first" alt=""
            src="/images/new-brick/titles.png"
          />
          </div>
        <div className="step-container">
          {
            step === ProposalStep.OpenQuestion ? <div className="step-label">Open Question</div> : ""
          }
          <img
            onClick={moveToOpenQuestion}
            className="navigation-button" alt=""
            src={step >= ProposalStep.OpenQuestion ? "/images/new-brick/head.png" : "/images/new-brick/head-grey.png"}
          />
        </div>
        <div className="step-container">
          {
            step === ProposalStep.Brief ? <div className="step-label">Brief</div> : ""
          }
          <img
            onClick={moveToBrief}
            className="navigation-button" alt=""
            src={step >= ProposalStep.Brief ? "/images/new-brick/brief-circles.png" : "/images/new-brick/brief-circles-grey.png"}
          />
        </div>
        <div className="step-container">
          {
            step === ProposalStep.Prep ? <div className="step-label">Prep</div> : ""
          }
          <img
            onClick={moveToPrep}
            className="navigation-button" alt=""
            src={step >= ProposalStep.Prep ? "/images/new-brick/prep.png" : "/images/new-brick/prep-grey.png"}
          />
        </div>
        <div className="step-container">
          {
            step === ProposalStep.BrickLength ? <div className="step-label">Length</div> : ""
          }
          <img
            onClick={moveToLength}
            className="navigation-button last" alt=""
            src={step >= ProposalStep.BrickLength ? "/feathericons/clock.png" : "/feathericons/clock-grey.png"}
          />
        </div>
      </Grid>
    </div>
  );
}

export default NextButton
