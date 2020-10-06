import React from 'react'
import { TutorialStep } from '../tutorial/TutorialPanelWorkArea';
import SpriteIcon from 'components/baseComponents/SpriteIcon';

export interface LastTabProps {
  tutorialStep: TutorialStep;
}

const LastTab: React.FC<LastTabProps> = ({ tutorialStep }) => {
  let className = "add-tab last-tab";
  if (tutorialStep === TutorialStep.Investigation) {
    className += " editor-border svgOnHover border-animation";
  }
  return (
    <div className={`svgOnHover ${className}`}>
      <SpriteIcon name="plus" className="w100 h100 active text-theme-dark-blue"/>
    </div>
  );
}

export default LastTab
