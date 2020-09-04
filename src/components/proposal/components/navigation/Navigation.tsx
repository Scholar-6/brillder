import React from "react";
import { useHistory } from 'react-router-dom';
import { Grid, Hidden } from "@material-ui/core";
import { connect } from 'react-redux';

import './Navigation.scss';
import { ReduxCombinedState } from 'redux/reducers';
import { ProposalStep, PlayButtonStatus } from "../../model";
import map from 'components/map';
import PlayButton from "components/build/components/PlayButton";

interface NextButtonProps {
  step: ProposalStep;
  playStatus: PlayButtonStatus;
  brickId?: number;
  onMove(): void;
}

const NavigationButtons: React.FC<NextButtonProps> = ({ step, brickId, playStatus, onMove }) => {
  const history = useHistory()

  const move = (route: string) => {
    onMove();
    history.push(route);
  }

  const moveToPlay = () => {
    if (brickId && playStatus === PlayButtonStatus.Valid) {
      history.push(map.playPreviewIntro(brickId));
    }
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
            <PlayButton
              isValid={playStatus === PlayButtonStatus.Valid}
              tutorialStep={-1}
              isTutorialSkipped={true}
              onClick={moveToPlay}
            />
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

const mapState = (state: ReduxCombinedState) => ({ brickId: state.brick?.brick?.id });

const connector = connect(mapState)

export default connector(NavigationButtons);
