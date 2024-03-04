import React from "react";
import BackButtonSix from "./BackButtonSix";

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
          <div className="font-20">You’ve completed Step Three, now let’s look at:</div>
          <div className="font-24">Step 4</div>
          <div className="font-48 bold">HIGHER EDUCATION</div>
        </div>
      </div>
      <BackButtonSix onClick={props.moveBack} />
      <button
        className="absolute-contunue-btn font-24"
        onClick={props.moveNext}
      >Begin step 4</button>
    </div>
  );
}

export default FourthStepWelcome;
