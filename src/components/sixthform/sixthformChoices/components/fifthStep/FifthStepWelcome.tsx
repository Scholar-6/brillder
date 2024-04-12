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

const FifthStepWelcome: React.FC<WelcomeProps> = (props) => {
  return (
    <div className="question question-careers-welcome">
      <img src={isPhone() ? "/images/choicesTool/phone/CareerCover.png" : "/images/choicesTool/Step5background.png"} className="step2background-img" />
      <div className="text-container-5432">
        <div>
          <div className="font-20">Step 5</div>
          <div className="font-48 bold s-text-323">CAREERS</div>
        </div>
      </div>
      <BackButtonSix onClick={props.moveBack} />
      {!isPhone() && props.canSkip && <div className="absolute-skip-btn font-24" onClick={props.onSkip}>Skip to end<SpriteIcon name="Skip-six" /></div>}
      <NextButtonSix label="Start" onClick={props.moveNext} />
    </div>
  );
}

export default FifthStepWelcome;
