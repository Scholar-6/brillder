import React from "react";
import BackButtonSix from "../BackButtonSix";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import NextButtonSix from "../NextButtonSix";
import { isPhone } from "services/phone";

interface WelcomeProps {
  canSkip: boolean;
  onSkip(): void;
  moveNext(): void;
  moveBack(): void;
}

const ThirdStepWelcome: React.FC<WelcomeProps> = (props) => {
  return (
    <div className="question">
      <img src="/images/choicesTool/Step2background.png" className="step2background-img" />
      <div className="text-container-5432">
        <div>
          <div className="font-20">Step 3</div>
          <div className="font-48 bold s-text-323">INTERESTS AND EXTRACURRICULAR ACTIVITIES</div>
        </div>
      </div>
      <BackButtonSix onClick={props.moveBack} />
      {!isPhone() && props.canSkip && <div className="absolute-skip-btn font-24" onClick={props.onSkip}>Skip to end<SpriteIcon name="Skip-six" /></div>}
      <NextButtonSix label="Start" onClick={props.moveNext} />
    </div>
  );
}

export default ThirdStepWelcome;
