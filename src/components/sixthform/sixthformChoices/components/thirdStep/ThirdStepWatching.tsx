import React from "react";
import BackButtonSix from "../BackButtonSix";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import SecondTable from "../sixStep/SecondTable";

interface ThirdProps {
  watchingChoices: any[];
  onChange(watchingChoices: any[]): void;
  moveBack(): void;
  moveNext(): void;
}

const ThirdStepWatching: React.FC<ThirdProps> = (props) => {
  return (
    <div className="question question-6 question-6-second">
      <div className="bold font-32 question-text">
        <div>
          TV, Video & Social Media
        </div>
        <div className="hover-area font-14">
          <SpriteIcon name="help-circle-r1" className="info-icon" />
          <div className="hover-content regular">
            <div className="triangle-popup" />
            What you choose to watch reflects your interests and, to some<br />
            extent, your capacity to challenge yourself with content which might<br />
            seek to inform or educate as well as simply entertain.
          </div>
        </div>
      </div>
      <div className="font-16">
        There is all sorts of content out there. How often do you watch the following?
      </div>
      <SecondTable
        seventhChoices={props.watchingChoices}
        onChoiceChange={() => {
          props.onChange(props.watchingChoices);
        }}
      />
      <BackButtonSix onClick={props.moveBack} />
      <button
        className="absolute-contunue-btn font-24"
        onClick={props.moveNext}>Continue</button>
    </div>
  );
}

export default ThirdStepWatching;
