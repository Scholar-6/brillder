import React from 'react'
import { TutorialStep } from '../tutorial/TutorialPanelWorkArea';


export interface LastTabProps {
  columns: number
  synthesis: string
  tutorialStep: TutorialStep;
  isSynthesis: boolean
}

const LastTab: React.FC<LastTabProps> = ({columns, tutorialStep, synthesis, isSynthesis}) => {
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
