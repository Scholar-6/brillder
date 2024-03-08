import React from "react";
import BackButtonSix from "../BackButtonSix";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface WelcomeProps {
  moveNext(): void;
  moveBack(): void;
}

const SixStepEntusiasmStart: React.FC<WelcomeProps> = (props) => {
  return (
    <div className="question question-6-entusiasm-start">
      <img src="/images/choicesTool/Step6backgroundEntusiasm.png" className="step2background-img" />
      <div className="text-container-5432">
        <div>
          <SpriteIcon name="heart-six" className="heart-icon" />
          <div className="font-32 bold">Enthusiasms, Passions and Interests</div>
          <div className="font-16 s-text-323">How true are the following statements of you?</div>
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

export default SixStepEntusiasmStart;
