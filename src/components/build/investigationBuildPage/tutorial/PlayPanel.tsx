import React from 'react'
import { Grid, Button } from '@material-ui/core';

import './PlayPanel.scss';
import {TutorialStep} from './TutorialPanelWorkArea';


export interface TutorialProps {
  next(step: TutorialStep): void; 
  skip(): void;
}

const PlayPanel: React.FC<TutorialProps> = (props) => {
  const renderDashedLine = () => {
    return (
      <Grid container className="icon-container" alignContent="center">
        <hr className="dashed-line"></hr>
      </Grid>
    );
  }

  const renderArrow = () => {
    return (
      <Grid container className="icon-container" alignContent="center">
        <img alt="icon" src="/feathericons/big-chevron-right-blue.png" className="arrow-icon" />
      </Grid>
    );
  }

  return (
    <div className="tutorial-play-panel">
      <div className="tutorial-step-1">
        <Grid container justify="center" alignContent="center" className="icons-row">
          <Grid container className="icon-container" alignContent="center">
            <img alt="icon" src="/images/edit.png" className="edit-icon" />
          </Grid>
          {renderDashedLine()}
          {renderArrow()}
          <Grid container className="icon-container" alignContent="center">
            <img alt="icon" src="/feathericons/plus-blue.png" className="add-icon" />
          </Grid>
          {renderDashedLine()}
          {renderArrow()}
          <Grid container className="icon-container" alignContent="center">
            <img alt="icon" src="/images/synthesis-icon.png" className="synthesis-icon" />
          </Grid>
          {renderDashedLine()}
          {renderArrow()}
          <Grid container className="icon-container" alignContent="center">
            <img alt="icon" src="/feathericons/play-white.png" className="play-icon" />
          </Grid>
        </Grid>
        <p className="center">The Play Preview button will turn green once every required field has been filled.</p>
        <p className="center-second">Clicking it before this point will show incomplete fields in red.</p>
        <div className="proposal-box">
          <h2>4. Play Preview and Submission.</h2>
          <p>While building your brick, the phone screen on your right will show you a preview of how the layout will appear on a mobile device, plus the answers and hints you enter. Once the Play Preview button has turned green, you will be able to play through the brick you have just created as it would appear to the learner on a tablet or desktop.</p>
        </div>
      </div>
      <Grid container direction="row" className="button-row">
        <Grid container justify="flex-start" item xs={5}>
          <div className="left-arrow" onClick={() => props.next(TutorialStep.Synthesis)} />
          <span className="button-label bold">3. The Synthesis</span>
        </Grid>
        <Grid container justify="center" item xs={2}>
          <Button onClick={props.skip}>SKIP</Button>
        </Grid>
        <Grid container justify="flex-end" item xs={5}>
          <span className="bold">5. Additional Information</span>
          <div className="right-arrow" onClick={() => props.next(TutorialStep.Additional)} />
        </Grid>
      </Grid>
    </div>
  );
}

export default PlayPanel;
