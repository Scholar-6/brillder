import React from "react";
import { useHistory } from 'react-router-dom';

import { ProposalStep } from "../../model";
import './Navigation.scss';
import { Grid, Hidden } from "@material-ui/core";


interface NextButtonProps {
  step: ProposalStep
  onMove(): void
}

const NextButton: React.FC<NextButtonProps> = ({ step, onMove }) => {
  const history = useHistory()

  const move = (route: string) => {
    onMove();
    history.push(route);
  }

  return (
    <Hidden only={['xs','sm']}>
      <div className="navigation-container">
        <Grid container item justify="center">
          <div className={`step-container ${step === ProposalStep.BrickTitle ? 'active' : ''}`}>
            <div className="step-label">Title</div>
            <div
              className="navigation-button navigation-titles"
              onClick={() => move('/build/new-brick/brick-title')}
            />
          </div>
          <div className={`step-container ${step === ProposalStep.OpenQuestion ? 'active' : ''}`}>
            <div className="step-label">Open Question</div>
            <div
              className={`navigation-button navigation-question ${step >= ProposalStep.OpenQuestion ? 'active' : ''}`}
              onClick={() => move('/build/new-brick/open-question')}
            />
          </div>
          <div className={`step-container ${step === ProposalStep.Brief ? 'active' : ''}`}>
            <div className="step-label">Brief</div>
            <div
              className={`navigation-button navigation-brief ${step >= ProposalStep.Brief ? 'active' : ''}`}
              onClick={() => move('/build/new-brick/brief')}
            />
          </div>
          <div className={`step-container ${step === ProposalStep.Prep ? 'active' : ''}`}>
            <div className="step-label">Prep</div>
            <div
              onClick={() => move('/build/new-brick/prep')}
              className={`navigation-button navigation-prep ${step >= ProposalStep.Prep ? 'active' : ''}`}
            />
          </div>
          <div className={`step-container ${step === ProposalStep.BrickLength ? 'active' : ''}`}>
            <div className="step-label">Length</div>
            <div
              onClick={() => move('/build/new-brick/length')}
              className={`navigation-button navigation-length ${step >= ProposalStep.BrickLength ? 'active' : ''}`}
            />
          </div>
        </Grid>
      </div>
    </Hidden>
  );
}

export default NextButton
