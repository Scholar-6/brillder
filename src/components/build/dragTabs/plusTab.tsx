import React from 'react'
import { TutorialStep } from '../tutorial/TutorialPanelWorkArea';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import Grid from '@material-ui/core/Grid';

export interface PlusTabProps {
  tutorialStep: TutorialStep;
}

const PlusTab: React.FC<PlusTabProps> = ({ tutorialStep }) => {
  let className = "add-tab last-tab";
  if (tutorialStep === TutorialStep.Investigation) {
    className += " editor-border svgOnHover border-animation";
  }
  return (
    <Grid className={"drag-tile"} container alignContent="center" justify="center">
      <div className={`svgOnHover ${className}`}>
        {tutorialStep === TutorialStep.Investigation && <SpriteIcon name="dashed-circle" className="circle-border" />}
        <SpriteIcon name="plus-line-custom" className="w100 h100 active text-theme-dark-blue"/>
      </div>
    </Grid>
  );
}

export default PlusTab
