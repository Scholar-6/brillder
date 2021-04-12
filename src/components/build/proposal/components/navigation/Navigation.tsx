import React from "react";
import { useHistory } from 'react-router-dom';
import { Grid, Hidden } from "@material-ui/core";
import { connect } from 'react-redux';

import './Navigation.scss';
import { ReduxCombinedState } from 'redux/reducers';
import { ProposalStep, PlayButtonStatus, PrepRoutePart, BriefRoutePart, OpenQuestionRoutePart, TitleRoutePart, BrickLengthRoutePart } from "../../model";
import PlayButton from "components/build/baseComponents/PlayButton";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface NextButtonProps {
  step: ProposalStep;
  playStatus: PlayButtonStatus;
  brickId?: number;
  baseUrl?: string;
  onMove(): void;
  saveAndPreview(): void;
}

const NavigationButtons: React.FC<NextButtonProps> = ({ step, brickId, baseUrl, playStatus, ...props }) => {
  const history = useHistory()

  const move = (route: string) => {
    props.onMove();
    history.push(route);
  }

  const renderButtons = () => {
    return (
      <Grid container item justify="center">
        <div className={`step-container ${step === ProposalStep.BrickTitle ? 'active' : ''}`}>
          <div className="step-label">Title</div>
          <SpriteIcon
            name="search-flip-thick"
            className="active navigation-button navigation-titles"
            onClick={() => move(baseUrl + TitleRoutePart)}
          />
        </div>
        <div className={`step-container ${step === ProposalStep.OpenQuestion ? 'active' : ''}`}>
          <div className="step-label">Open Question</div>
          <SpriteIcon
            name="help-circle"
            className={`navigation-button navigation-question ${step >= ProposalStep.OpenQuestion ? 'active' : ''}`}
            onClick={() => move(baseUrl + OpenQuestionRoutePart)}
          />
        </div>
        <div className={`step-container ${step === ProposalStep.BrickLength ? 'active' : ''}`}>
          <div className="step-label">Length</div>
          <SpriteIcon
            name="clock"
            className={`navigation-button navigation-length ${step >= ProposalStep.BrickLength ? 'active' : ''}`}
            onClick={() => move(baseUrl + BrickLengthRoutePart)}
          />
        </div>
        <div className={`step-container ${step === ProposalStep.Brief ? 'active' : ''}`}>
          <div className="step-label">Brief</div>
          <SpriteIcon
            name="crosshair"
            className={`navigation-button navigation-brief ${step >= ProposalStep.Brief ? 'active' : ''}`}
            onClick={() => move(baseUrl + BriefRoutePart)}
          />
        </div>
        <div className={`step-container ${step === ProposalStep.Prep ? 'active' : ''}`}>
          <div className="step-label">Prep</div>
          <SpriteIcon
            name="file-text"
            className={`navigation-button navigation-prep ${step >= ProposalStep.Prep ? 'active' : ''}`}
            onClick={() => move(baseUrl + PrepRoutePart)}
          />
        </div>
      </Grid>
    );
  }

  return (
    <Hidden only={['xs', 'sm']}>
      <div className="navigation-container">
        {renderButtons()}
      </div>
    </Hidden>
  );
}

const mapState = (state: ReduxCombinedState) => ({ brickId: state.brick?.brick?.id });

export default connect(mapState)(NavigationButtons);
