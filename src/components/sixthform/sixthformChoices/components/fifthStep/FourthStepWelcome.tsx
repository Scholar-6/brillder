import React from "react";
import BackButtonSix from "../BackButtonSix";

interface WelcomeProps {
  moveNext(): void;
  moveBack(): void;
}

const FourthStepWelcome: React.FC<WelcomeProps> = (props) => {
  return (
    <div className="question">
      <img src="/images/choicesTool/Step4background.png" className="step2background-img" />
      <div className="text-container-5432">
        <div>
          <div className="font-20">Step 5</div>
          <div className="font-48 bold s-text-323">HIGHER EDUCATION</div>
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