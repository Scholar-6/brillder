import React from 'react'
import { TutorialStep } from '../tutorial/TutorialPanelWorkArea';
import sprite from "../../../../assets/img/icons-sprite.svg";

export interface LastTabProps {
  tutorialStep: TutorialStep;
}

const LastTab: React.FC<LastTabProps> = ({tutorialStep}) => {
  let className = "add-tab last-tab";
  if (tutorialStep === TutorialStep.Investigation) {
    className += " tutorial-border";
  }
  return (
    <div className={className + " svgOnHover"}>
			<svg className="svg w100 h100 active">
				<use href={sprite + "#plus"} className="text-theme-dark-blue" />
			</svg>
    </div>
  );
}

export default LastTab
