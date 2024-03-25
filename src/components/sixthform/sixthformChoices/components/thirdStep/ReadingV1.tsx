import React from "react";

import CheckBoxV2 from "../CheckBox";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import BackButtonSix from "../BackButtonSix";

export enum ReadingChoice {
  first = 1,
  second,
  third,
  fourth,
  fifth,
}

interface ReadingV1Props {
  readingChoice: ReadingChoice | null;
  onChange(value: ReadingChoice): void;
  moveBack(): void;
  moveNext(): void;
}

const ReadingV1: React.FC<ReadingV1Props> = (props) => {
  return (
    <div className="question question-6">
      <img src="/images/choicesTool/SecondStepReadingV1.png" className="third-step-img third-step-img-r4"></img>
      <div className="bold font-32 question-text">
        <div>
          Reading
        </div>
        <div className="hover-area font-14">
          <SpriteIcon name="help-circle-r1" className="info-icon" />
          <div className="hover-content regular">
            <div className="triangle-popup" />
            Reading habits can be an indication of what types of subjects you’ll<br />
            enjoy studying. Some very able students don’t read much, but a deep-<br />
            rooted love of reading is a good indicator of academic aptitude.
          </div>
        </div>
      </div>
      <div className="font-16">
        Which of the following statements best describes your attitude to reading?
      </div>
      <div className="boxes-container font-16">
        <CheckBoxV2
          currentChoice={ReadingChoice.first} choice={props.readingChoice}
          label="I absolutely love reading and devour all sorts of books." setChoice={props.onChange}
        />
        <CheckBoxV2
          currentChoice={ReadingChoice.second} choice={props.readingChoice}
          label="I do read for pleasure and enjoy books if they interest me." setChoice={props.onChange}
        />
        <CheckBoxV2
          currentChoice={ReadingChoice.third} choice={props.readingChoice}
          label="I read if I have to - if a book is set at school - and usually don’t mind unless the book is really boring."
          setChoice={props.onChange}
        />
        <CheckBoxV2
          currentChoice={ReadingChoice.fourth} choice={props.readingChoice}
          label="I get very little pleasure from reading and I don’t enjoy reading for school."
          setChoice={props.onChange}
        />
        <CheckBoxV2
          currentChoice={ReadingChoice.fifth} choice={props.readingChoice}
          label="I hate reading and hardly ever touch a book."
          setChoice={props.onChange}
        />
      </div>
      <BackButtonSix onClick={props.moveBack} />
      <button
        className={`absolute-contunue-btn font-24 ${props.readingChoice === null ? 'disabled' : ''}`}
        disabled={props.readingChoice === null}
        onClick={props.moveNext}>Continue</button>
    </div>
  );
}

export default ReadingV1;
