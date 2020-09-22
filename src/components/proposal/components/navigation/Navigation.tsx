import React from "react";
import { useHistory } from 'react-router-dom';
import { Grid, Hidden } from "@material-ui/core";
import { connect } from 'react-redux';

import sprite from "assets/img/icons-sprite.svg";
import './Navigation.scss';
import { ReduxCombinedState } from 'redux/reducers';
import { ProposalStep, PlayButtonStatus } from "../../model";
import map from 'components/map';
import PlayButton from "components/build/baseComponents/PlayButton";

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
          <svg className="svg active navigation-button navigation-titles" onClick={() => move(map.ProposalTitle)}>
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#search-flip-thick"} />
          </svg>
        </div>
        <div className={`step-container ${step === ProposalStep.OpenQuestion ? 'active' : ''}`}>
          <div className="step-label">Open Question</div>
          <svg
            className={`navigation-button navigation-question ${step >= ProposalStep.OpenQuestion ? 'active' : ''}`}
            onClick={() => move(map.ProposalOpenQuestion)}
          >
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#help-circle"} />
          </svg>
        </div>
        <div className={`step-container ${step === ProposalStep.BrickLength ? 'active' : ''}`}>
          <div className="step-label">Length</div>
          <svg
            className={`navigation-button navigation-length ${step >= ProposalStep.BrickLength ? 'active' : ''}`}
            onClick={() => move(map.ProposalLength)}
          >
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#clock"} />
          </svg>
        </div>
        <div className={`step-container ${step === ProposalStep.Brief ? 'active' : ''}`}>
          <div className="step-label">Brief</div>
          <svg
            className={`navigation-button navigation-brief ${step >= ProposalStep.Brief ? 'active' : ''}`}
            onClick={() => move(map.ProposalBrief)}
          >
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#crosshair"} />
          </svg>
        </div>
        <div className={`step-container ${step === ProposalStep.Prep ? 'active' : ''}`}>
          <div className="step-label">Prep</div>
          <svg
            onClick={() => move(map.ProposalPrep)}
            className={`navigation-button navigation-prep ${step >= ProposalStep.Prep ? 'active' : ''}`}
          >
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#file-text"} />
          </svg>
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
