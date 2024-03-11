import React from "react";
import BackButtonSix from "../BackButtonSix";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface WelcomeProps {
  moveNext(): void;
  moveBack(): void;
}

const FourthStepListenStart: React.FC<WelcomeProps> = (props) => {
  return (
    <div className="question question-watching-start">
      <img src="/images/choicesTool/Step5backgroundR2.png" className="step2background-img" />
      <div className="text-container-5432">
        <div>
          <SpriteIcon name="sixthform-comment" className="watching-start" />
          <div className="font-32 bold">Speaking</div>
          <div className="font-16 text-r34234">
            How true are the following statements of you?
          </div>
        </div>
      </div>
      <BackButtonSix onClick={props.moveBack} />
      <button
        className="absolute-contunue-btn font-24"
        onClick={props.moveNext}
      >Continue</button>
    </div>
  );
}

export default FourthStepListenStart;
