import React from "react";
import BackButtonSix from "../BackButtonSix";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { isPhone } from "services/phone";
import NextButtonSix from "../NextButtonSix";

interface WelcomeProps {
  canSkip: boolean;
  onSkip(): void;
  moveNext(): void;
  moveBack(): void;
}

const SixthStepWelcome: React.FC<WelcomeProps> = (props) => {
  if (isPhone()) {
    return (
      <div className="question schools-and-colleges-r65">
        <img src="/images/choicesTool/phone/SCHOOLSANDCOLLEGES2.png" className="step2background-img" />
        <img className="absolute-gradient-w-img" src="/images/choicesTool/phone/gradient-white.png" />
        <div className="text-container-5432">
          <div>
            <div className="font-20 text-center">Step 1</div>
            <div className="font-48 bold text-center s-text-323">SCHOOLS AND COLLEGES</div>
          </div>
        </div>
        <BackButtonSix onClick={props.moveBack} />
        <NextButtonSix label="Start" onClick={props.moveNext} />
      </div>
    );
  }
  return (
    <div className="question">
      <img src="/images/choicesTool/collegebackground.png" className="step2background-img" />
      <div className="text-container-5432">
        <div>
          <div className="font-20">Step 1</div>
          <div className="font-48 bold s-text-323">SCHOOLS AND COLLEGES</div>
        </div>
      </div>
      <BackButtonSix onClick={props.moveBack} />
      {props.canSkip && <div className="absolute-skip-btn font-24" onClick={props.onSkip}>Skip to end<SpriteIcon name="Skip-six" /></div>}
      <NextButtonSix label="Start" onClick={props.moveNext} />
    </div>
  );
}

export default SixthStepWelcome;
