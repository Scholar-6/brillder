import React from 'react'
import { Grid, Button } from '@material-ui/core';
import './ProposalPanel.scss';
import { TutorialStep } from './TutorialPanelWorkArea';
import SpriteIcon from 'components/baseComponents/SpriteIcon';


export interface TutorialProps {
  next(step: TutorialStep): void;
  skip(): void;
}

const ProposalPanel: React.FC<TutorialProps> = (props) => {
  return (
    <div className="tutorial-panel tutorial-proposal-panel">
      <div className="tutorial-step-1">
        <h1>There are 4 steps to the build process.</h1>
        <Grid container justify="center">
          <div className="editor-border svgOnHover border-animation">
            <SpriteIcon name="feather-map" className="w80 h80 active text-theme-dark-blue" />
          </div>
        </Grid>
        <p className="center">
          You can <span className="bold">Edit Your Plan</span> at anytime by clicking the icon in the first tab on the left.
        </p>
        <div className="proposal-box">
          <h2>1. The Plan</h2>
          <p>
            If you’ve made it here, then you’ve at least made a start on your plan.
            You will need to complete all fields if you want your brick to be published.
          </p>
          <p className="last-text bold">
            The Plan can also be accessed by clicking the ‘Build Bricks’ button on your homepage.
          </p>
        </div>
      </div>
      <Grid container direction="row" className="button-row">
        <Grid item xs={4} />
        <Grid container justify="center" item xs={4}>
          <Button onClick={props.skip}>SKIP</Button>
        </Grid>
        <Grid
          container justify="flex-end" item xs={4}
          className="hover-move-left"
          onClick={() => props.next(TutorialStep.Investigation)}
        >
          <span className="bold">2. The Investigation</span>
          <div className="right-arrow" />
        </Grid>
      </Grid>
    </div>
  );
}

export default ProposalPanel;

