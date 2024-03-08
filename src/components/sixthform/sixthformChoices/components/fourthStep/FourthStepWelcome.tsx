import React from "react";
import BackButtonSix from "../BackButtonSix";

interface WelcomeProps {
  moveNext(): void;
  moveBack(): void;
}

const FourthStepWelcome: React.FC<WelcomeProps> = (props) => {
  return (
    <div className="question">
    <img src="/images/choicesTool/Step3background.png" className="step2background-img" />
    <div className="text-container-5432">
      <div>
        <div className="font-20">You’ve completed Step Three, now let’s look at</div>
        <div className="font-48 bold s-text-323">SUBJECTS</div>
      </div>
    </div>
    <BackButtonSix onClick={props.moveBack} />
    <button
      className="absolute-contunue-btn font-24"
      onClick={props.moveNext}
    >Start</button>
  </div>
  );
}

export default FourthStepWelcome;
