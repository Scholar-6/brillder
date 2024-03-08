import React from "react";
import BackButtonSix from "../BackButtonSix";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface WelcomeProps {
  moveNext(): void;
  moveBack(): void;
}

const SixthStepStart: React.FC<WelcomeProps> = (props) => {
  return (
    <div className="question question-6">
      <img src="/images/choicesTool/Step6R16.png" className="step6-r16-img" />
      <div className="bold font-32 question-text">
        YOU
      </div>
      <div className="font-16 s6start-text">
        This is the most fun and, in many ways, the most important part of the process.
      </div>
      <div className="font-16 s6start-text">
        It is important to choose courses that you will enjoy. Your answers in<br/>
        this final stage will help us evaluate your interests.
      </div>
      <SpriteIcon name="sixthform-sixth-description" className="big-svg-description" />
      <BackButtonSix onClick={props.moveBack} />
      <button className="absolute-contunue-btn font-24" onClick={props.moveNext}>Proceed</button>
    </div>
  );
}

export default SixthStepStart;
