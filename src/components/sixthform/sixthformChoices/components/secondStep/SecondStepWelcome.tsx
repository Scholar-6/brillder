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

const SecondStepWelcome: React.FC<WelcomeProps> = (props) => {
  return (
    <div className="question question-subject-welcome">
    {isPhone()
      ? <img src="/images/choicesTool/phone/subjects.png" className="step2background-img" />
      : <img src="/images/choicesTool/Step3background.png" className="step2background-img" />
    }
    <div className="text-container-5432">
      <div>
        <div className="font-20">Step 2</div>
        <div className="font-48 bold s-text-323">SUBJECTS</div>
      </div>
    </div>
    <BackButtonSix onClick={props.moveBack} />
    {!isPhone() && props.canSkip && <div className="absolute-skip-btn font-24" onClick={props.onSkip}>Skip to end<SpriteIcon name="Skip-six" /></div>}
    <NextButtonSix label="Start" onClick={props.moveNext} />
  </div>
  );
}

export default SecondStepWelcome;
