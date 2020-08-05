import React from "react";
import { useHistory } from 'react-router-dom';

import { ProposalStep, PlayButtonStatus } from "../../model";
import './Navigation.scss';
import { Grid, Hidden } from "@material-ui/core";

import map from 'components/map';
import PlayButton from "components/build/investigationBuildPage/components/PlayButton";

interface NextButtonProps {
  step: ProposalStep;
  playStatus: PlayButtonStatus;
  onMove(): void;
}

const NextButton: React.FC<NextButtonProps> = ({ step, playStatus, onMove }) => {
  const history = useHistory()

  const move = (route: string) => {
    onMove();
    history.push(route);
  }

  const renderButtons = () => {
    return (
      <Grid container item justify="center">
        <div className={`step-container ${step === ProposalStep.BrickTitle ? 'active' : ''}`}>
          <div className="step-label">Title</div>
          <div
            className="navigation-button navigation-titles"
            onClick={() => move(map.ProposalTitle)}
          />
        </div>
        <div className={`step-container ${step === ProposalStep.OpenQuestion ? 'active' : ''}`}>
          <div className="step-label">Open Question</div>
          <div
            className={`navigation-button navigation-question ${step >= ProposalStep.OpenQuestion ? 'active' : ''}`}
            onClick={() => move(map.ProposalOpenQuestion)}
          />
        </div>
        <div className={`step-container ${step === ProposalStep.Brief ? 'active' : ''}`}>
          <div className="step-label">Brief</div>
          <div
            className={`navigation-button navigation-brief ${step >= ProposalStep.Brief ? 'active' : ''}`}
            onClick={() => move(map.ProposalBrief)}
          />
        </div>
        <div className={`step-container ${step === ProposalStep.Prep ? 'active' : ''}`}>
          <div className="step-label">Prep</div>
          <div
            onClick={() => move(map.ProposalPrep)}
            className={`navigation-button navigation-prep ${step >= ProposalStep.Prep ? 'active' : ''}`}
          />
        </div>
        <div className={`step-container ${step === ProposalStep.BrickLength ? 'active' : ''}`}>
          <div className="step-label">Length</div>
          <div
            onClick={() => move(map.ProposalLength)}
            className={`navigation-button navigation-length ${step >= ProposalStep.BrickLength ? 'active' : ''}`}
          />
        </div>
      </Grid>
    );
  }

  const renderButtonsContainer = () => {
    if (playStatus !== PlayButtonStatus.Hidden) {
      return (
        <div className="navigation-container">
          <div className="play-preview-button-container">
            <PlayButton isValid={playStatus === PlayButtonStatus.Valid} tutorialStep={-1} isTutorialSkipped={true} onClick={() => { }} />
          </div>
          <div className="navigation-left">
            {renderButtons()}
          </div>
        </div>
      );
    }
    return (
      <div className="navigation-container">
        {renderButtons()}
      </div>
    );
  }

  return (
    <Hidden only={['xs', 'sm']}>
      {renderButtonsContainer()}
    </Hidden>
  );
}

export default NextButton
