import React from 'react'
import { Grid } from '@material-ui/core';
import './PlayPanel.scss';
import { TutorialStep } from './TutorialPanelWorkArea';
import SpriteIcon from 'components/baseComponents/SpriteIcon';


export interface TutorialProps {
  next(step: TutorialStep): void;
  skip(): void;
}

const PlayPanel: React.FC<TutorialProps> = (props) => {
  const renderArrow = (className: string) => {
    return (
      <div className={"icon-container arrow-icon svgOnHover " + className}>
        <SpriteIcon name="arrow-right" className="w100 h100 active text-gray" />
      </div>
    );
  }

  return (
    <div className="tutorial-panel tutorial-play-panel">
      <div className="tutorial-step-1">
        <div className="icons-row">
          <div>
            <div className="icon-container container-1 svgOnHover">
              <SpriteIcon
                name="feather-map"
                className="w80 h80 active text-theme-dark-blue"
              />
            </div>
            {renderArrow('container-2')}
            <div className="icon-container container-3 svgOnHover">
              <SpriteIcon name="plus" className="w80 h80 active text-theme-dark-blue" />
            </div>
            {renderArrow('container-4')}
            <div className="icon-container container-5 svgOnHover">
              <SpriteIcon name="feather-menu" className="w80 h80 active text-theme-dark-blue stroke-2-5" />
            </div>
            {renderArrow('container-6')}
            <div className="icon-container container-7">
            <div className="play-icon svgOnHover">
              <div className="hover-background" />
              <div className="background" />
              <SpriteIcon name="play-thin" className="w80 h80 svg-default text-white" />
              <SpriteIcon name="play-thick" className="w80 h80 colored text-white" />
            </div>
            </div>
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
        <Grid
          container justify="flex-start" item xs={6}
          className="hover-move-right"
          onClick={() => props.next(TutorialStep.Synthesis)}
        >
          <div className="left-arrow" />
          <span className="button-label bold">3. The Synthesis</span>
        </Grid>
        <Grid
          container justify="flex-end" item xs={6}
          className="hover-move-left"
          onClick={() => props.skip()}
        >
          <span className="button-label bold">Build Questions</span>
          <div className="right-arrow" />
        </Grid>
      </Grid>
    </div>
  );
}

export default PlayPanel;
