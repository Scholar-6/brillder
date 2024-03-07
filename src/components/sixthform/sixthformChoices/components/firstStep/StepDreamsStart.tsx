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
            <div className="hover-area font-14">
              <SpriteIcon name="help-circle-r1" className="info-icon" />
              <div className="hover-content regular">
                <div className="triangle-popup" />
                Your ideas about the future reflect your priorities, interests<br />
                and what you feel may be possible. Some of the goals below<br />
                may seem exceptional, but none are impossible.
              </div>
            </div>
          </div>
          <div className="font-16 s-text-323">
            Be honest with yourself. Most of your answers in this section will probably be “Not really” - they might sound like nice ideas, but you’ve never<br/>
            given them serious thought.
          </div>
          <div className="font-16 s-text-323">However, if you find a scenario genuinely exciting, choose “Definitely”.</div>
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
