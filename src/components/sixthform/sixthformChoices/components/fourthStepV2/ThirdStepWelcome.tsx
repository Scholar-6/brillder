import React from "react";
import BackButtonSix from "../BackButtonSix";

interface WelcomeProps {
  moveNext(): void;
  moveBack(): void;
}

const ThirdStepWelcome: React.FC<WelcomeProps> = (props) => {
  return (
    <div className="question">
      <img src="/images/choicesTool/Step3background.png" className="step2background-img" />
      <div className="text-container-5432">
        <div>
          <div className="font-20">You’ve completed Step Two, now let’s look at:</div>
          <div className="font-48 bold">SUBJECTS</div>
        </div>
      </div>
      <BackButtonSix onClick={props.moveBack} />
      <button
        className="absolute-contunue-btn font-24"
        onClick={props.moveNext}
      >Begin step 3</button>
    </div>
  );
}

export default ThirdStepWelcome;
