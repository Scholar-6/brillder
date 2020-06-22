import React from 'react'
import { TutorialStep } from '../tutorial/TutorialPanelWorkArea';


export interface LastTabProps {
  tutorialStep: TutorialStep;
}

const LastTab: React.FC<LastTabProps> = ({tutorialStep}) => {
  let className = "add-tab last-tab";
  if (tutorialStep === TutorialStep.Investigation) {
    className += " tutorial-border";
  }
  return (
    <div className={className}>
      <img alt="" src="/feathericons/plus-blue.png" />
    </div>
  );
}

export default LastTab
