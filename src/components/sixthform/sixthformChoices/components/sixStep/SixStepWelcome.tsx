import React from "react";
import BackButtonSix from "../BackButtonSix";

interface WelcomeProps {
  moveNext(): void;
  moveBack(): void;
}

const SixStepWelcome: React.FC<WelcomeProps> = (props) => {
  return (
    <div className="question">
      <img src="/images/choicesTool/Step6backgroundDreams.png" className="step2background-img" />
      <div className="text-container-5432">
        <div>
          <div className="font-32 bold s-text-323 padding-b-1d5vh">Dreams, Ambitions and Values</div>
          <div className="font-16 padding-left-02vw">
            In this final section, we’ll ask you about what you would like to do in the future, after you’ve finished studying. There are no wrong answers, so<br/>
            please respond honestly and we’ll be better able to match you to the right subjects.
          </div>
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

export default SixStepWelcome;
