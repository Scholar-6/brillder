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
      <img src="/images/choicesTool/Step4backgroundListening.png" className="step2background-img" />
      <div className="text-container-5432">
        <div>
          <SpriteIcon name="listening-sixth" className="watching-start" />
          <div className="font-32 bold">Listening</div>
          <div className="font-16 text-r34234">
          There is all sorts of content out there. How often do you listen to the following?
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
