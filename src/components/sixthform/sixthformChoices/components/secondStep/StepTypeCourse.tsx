import React from "react";
import BackButtonSix from "../BackButtonSix";

interface WelcomeProps {
  moveNext(): void;
  moveBack(): void;
}

const StepTypeCourse: React.FC<WelcomeProps> = (props) => {
  return (
    <div className="question question-6-entusiasm-start">
      <img src="/images/choicesTool/Step2backgroundR2.png" className="step2background-img" />
      <div className="text-container-5432">
        <div>
          <div className="font-20">Step 2</div>
          <div className="font-48 bold s-text-323">TYPES OF COURSE</div>
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

export default StepTypeCourse;
