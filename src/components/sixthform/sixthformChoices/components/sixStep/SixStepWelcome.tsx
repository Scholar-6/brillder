import React from "react";
import BackButtonSix from "../BackButtonSix";
import { isPhone } from "services/phone";
import NextButtonSix from "../NextButtonSix";

interface WelcomeProps {
  moveNext(): void;
  moveBack(): void;
}

const SixStepWelcome: React.FC<WelcomeProps> = (props) => {
  return (
    <div className="question question-dream-welcome">
      <img src={isPhone() ? "/images/choicesTool/phone/DreamsCover.png" : "/images/choicesTool/Step6backgroundDreams.png"} className="step2background-img" />
      <div className="text-container-5432">
        <div>
          <div className="font-32 bold s-text-323 padding-b-1d5vh dreams-title"> Dreams, Ambitions{isPhone() && <br/>} and Values</div>
          <div className="font-16 padding-left-02vw">
            In this final section, we’ll ask you about what you would like to do in the future, after you’ve finished studying. There are no wrong answers, so<br/>
            please respond honestly and we’ll be better able to match you to the right subjects.
          </div>
        </div>
      </div>
      <BackButtonSix onClick={props.moveBack} />
      <NextButtonSix label="Start" onClick={props.moveNext} />
    </div>
  );
}

export default SixStepWelcome;
