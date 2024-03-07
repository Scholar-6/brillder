import React from "react";
import BackButtonSix from "../BackButtonSix";

interface WelcomeProps {
  moveNext(): void;
  moveBack(): void;
}

const SixthStepWelcome: React.FC<WelcomeProps> = (props) => {
  return (
    <div className="question">
      <img src="/images/choicesTool/Step6background.png" className="step2background-img" />
      <div className="text-container-5432">
        <div className="font-20">Let’s start off with <span className="font-48 bold">YOU.</span></div>
      </div>
      <BackButtonSix onClick={props.moveBack} />
      <button
        className="absolute-contunue-btn font-24"
        onClick={props.moveNext}
      >Continue</button>
    </div>
  );
}

export default SixthStepWelcome;
