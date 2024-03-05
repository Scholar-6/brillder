import React from "react";
import BackButtonSix from "./BackButtonSix";

interface WelcomeProps {
  moveNext(): void;
  moveBack(): void;
}

const FifthStepWelcome: React.FC<WelcomeProps> = (props) => {
  return (
    <div className="question">
      <img src="/images/choicesTool/Step5background.png" className="step2background-img" />
      <div className="text-container-5432">
        <div>
          <div className="font-20">You’ve completed Step Four, now let’s look at:</div>
          <div className="font-24">Step 5</div>
          <div className="font-48 bold">CAREERS</div>
        </div>
      </div>
      <BackButtonSix onClick={props.moveBack} />
      <button
        className="absolute-contunue-btn font-24"
        onClick={props.moveNext}
      >Begin step 5</button>
    </div>
  );
}

export default FifthStepWelcome;
