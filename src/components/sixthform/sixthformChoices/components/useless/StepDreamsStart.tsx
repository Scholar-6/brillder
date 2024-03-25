import React from "react";
import BackButtonSix from "../BackButtonSix";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface WelcomeProps {
  moveNext(): void;
  moveBack(): void;
}

const SixStepDreamsStart: React.FC<WelcomeProps> = (props) => {
  return (
    <div className="question question-6-entusiasm-start">
      <img src="/images/choicesTool/Step6backgroundDreams.png" className="step2background-img" />
      <div className="text-container-5432">
        <div>
          <SpriteIcon name="smile-six" className="heart-icon" />
          <div className="bold font-32 flex-container-hover">
            <div>
              Dreams, Ambitions and Values
            </div>
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

export default SixStepDreamsStart;
