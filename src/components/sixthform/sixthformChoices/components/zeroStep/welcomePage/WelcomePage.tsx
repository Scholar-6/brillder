import React from "react";
import ChoiceStepsSvg from "./ChoiceStepsSvg";
import './WelcomePage.scss';
import ChoiceSidebarSvg from "./ChoiceSidebarSvg";
import { isPhone } from "services/phone";
import ChoiceStepsSvgM from "./ChoiceStepsSvgM";
import ChoiceSidebarSvgM from "./ChoiceSidebarSvgM";

const MobileTheme = React.lazy(() => import('./themes/WelcomePageMobileTheme'));

interface TasterProps {
  moveNext(): void;
}

const WelcomePage: React.FC<TasterProps> = (props) => {
  if (isPhone()) {
    return (
      <div className="WelcomePageChoices">
        <MobileTheme />
        <div className="welcome-page-top-part">
          <img className="absolute-welcome-img" src="/images/choicesTool/phone/instruction.png" />
          <img className="absolute-gradient-w-img" src="/images/choicesTool/phone/gradient-white.png" />
          <div className="absolute-welcome-content">
            <div className="relative">
              <div className="bold big-text-q1 font-50">Start to shape<br/> your future.</div>
              <div className="flex-center margin-top-3vh">
                <ChoiceStepsSvgM />
              </div>
              <div className="flex-center">
                <ChoiceSidebarSvgM />
              </div>
            </div>
          </div>
        </div>
        <div className="welcome-part-bottom-part">
          <button className="absolute-contunue-btn flex-center font-24" onClick={props.moveNext}>Let’s start</button>
        </div>
      </div>
    );
  }
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
