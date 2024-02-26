import React from "react";
import ChoiceStepsSvg from "./ChoiceStepsSvg";
import './WelcomePage.scss';
import ChoiceSidebarSvg from "./ChoiceSidebarSvg";

interface TasterProps {
  moveNext(): void;
}

const WelcomePage: React.FC<TasterProps> = (props) => {
  return (
    <div className="WelcomePageChoices">
      <img className="absolute-welcome-img" src="/images/choicesTool/SixthformChoiceWelcome.png" />
      <div className="absolute-welcome-content">
        <div className="relative">
          <div className="bold big-text-q1 font-58">Start to shape your future.</div>
          <div className="flex-right margin-top-3vh">
            <ChoiceStepsSvg />
          </div>
          <div className="flex-right">
            <ChoiceSidebarSvg />
          </div>
          <button className="absolute-contunue-btn font-24" onClick={props.moveNext}>Let’s start</button>
        </div>
      </div>
    </div>
  )
}

export default WelcomePage;
