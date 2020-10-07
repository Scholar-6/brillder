import React from 'react'
import { Grid } from '@material-ui/core';

import './AdditionalPanel.scss';
import { TutorialStep } from './TutorialPanelWorkArea';
import SpriteIcon from 'components/baseComponents/SpriteIcon';

export interface TutorialProps {
  next(step: TutorialStep): void;
  skip(): void;
}

const AdditionalPanel: React.FC<TutorialProps> = (props) => {
  return (
    <div className="tutorial-panel tutorial-additional-panel">
      <div className="tutorial-step-1">
        <Grid container justify="center">
          <div className="editor-border svgOnHover border-animation">
            <SpriteIcon name="zap-off" className="w80 h80 active text-gray" />
          </div>
          <div className="editor-border svgOnHover border-animation">
            <SpriteIcon name="zap" className="w80 h80 active text-theme-dark-blue" />
          </div>
        </Grid>
        <p className="center">
          Turn Tool Tips on and off at any time by clicking this icon.
        </p>
        <div className="proposal-box">
          <h2>5. Additional Information</h2>
          <p>If you feel comfortable enough with how building works, you can <span className="bold">disable Tool Tips now</span> to declutter the interface. You’re also free to keep them on as long as you like.</p>
          <p className="last-text"><span className="bold">Saving:</span> We’ve got your back. Anytime you edit your brick, the text above the phone will show you this change has been saved. Your changes will also be saved anytime you Exit to the home screen (by clicking the red icon top left).</p>
        </div>
      </div>
      <Grid container direction="row" className="button-row">
        <Grid container justify="flex-start" item xs={6}>
          <div className="left-arrow" onClick={() => props.next(TutorialStep.Play)} />
          <span className="button-label bold">4. Play Preview and Submission</span>
        </Grid>
        <Grid container justify="flex-end" item xs={6}>
          <span className="button-label bold long">START BUILDING</span>
          <div className="right-arrow" onClick={() => props.skip()} />
        </Grid>
      </Grid>
    </div>
  );
}

export default AdditionalPanel;
