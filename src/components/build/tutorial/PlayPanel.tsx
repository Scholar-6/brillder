import React from 'react'
import { Grid, Button } from '@material-ui/core';
import sprite from "assets/img/icons-sprite.svg";
import './PlayPanel.scss';
import { TutorialStep } from './TutorialPanelWorkArea';


export interface TutorialProps {
  next(step: TutorialStep): void;
  skip(): void;
}

const PlayPanel: React.FC<TutorialProps> = (props) => {
  const renderDashedLine = () => {
    return (
      <div className="icon-container dashed-line">
        <div></div>
      </div>
    );
  }

  const renderArrow = () => {
    return (
      <div className="icon-container arrow-icon svgOnHover">
        <svg className="svg w100 h100 active">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#arrow-right"} className="text-gray" />
        </svg>
      </div>
    );
  }

  return (
    <div className="tutorial-panel tutorial-play-panel">
      <div className="tutorial-step-1">
        <div className="icons-row">
          <div className="icon-container svgOnHover">
            <svg className="svg w80 h80 active">
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#edit-outline"} className="text-theme-dark-blue" />
            </svg>
          </div>
          {renderDashedLine()}
          {renderArrow()}
          <div className="icon-container svgOnHover">
            <svg className="svg w80 h80 active">
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#plus"} className="text-theme-dark-blue" />
            </svg>
          </div>
          {renderDashedLine()}
          {renderArrow()}
          <div className="icon-container svgOnHover">
            <svg className="svg w80 h80 active">
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#list"} className="text-theme-dark-blue" />
            </svg>
          </div>
          {renderDashedLine()}
          {renderArrow()}
          <div className="icon-container play-icon svgOnHover">
            <svg className="svg w80 h80 svg-default">
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#play-thin"} className="text-white" />
            </svg>
            <svg className="svg w80 h80 colored">
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#play-thick"} className="text-white" />
            </svg>
          </div>
        </div>
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
