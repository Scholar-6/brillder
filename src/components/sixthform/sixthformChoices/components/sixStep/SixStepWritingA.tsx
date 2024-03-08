import React from "react";
import BackButtonSix from "../BackButtonSix";
import CheckBoxV2 from "../CheckBox";

export enum WritingChoice {
  Never = 1,
  Sometimes,
  ALot
}

export enum WritingChoice {
  first,
  second,
  third,
  fourth,
  fifth,
}

interface Props {
  writingChoice: WritingChoice | null;
  setWritingChoice(choice: WritingChoice): void;
  moveBack(): void;
  moveNext(): void;
}

const SixStepWritingA: React.FC<Props> = (props) => {
  return (
    <div className="question question-6 question-6-writing">
      <img src="/images/choicesTool/Step6R17.png" className="third-step-img step-img-r17"></img>
      <div className="bold font-32 question-text">
        <div>
          Writing
        </div>
      </div>
      <div className="font-16">
        Which of the following statements best describes your attitude to writing?
      </div>
      <div className="boxes-container start font-16">
        <CheckBoxV2
          currentChoice={WritingChoice.first} choice={props.writingChoice}
          label="Writing well is something I take pride in and hugely enjoy."
          setChoice={props.setWritingChoice}
        />
        <CheckBoxV2
          currentChoice={WritingChoice.second} choice={props.writingChoice}
          label="I am confident that I’m a good written communicator and I like writing."
          setChoice={props.setWritingChoice}
        />
        <CheckBoxV2
          currentChoice={WritingChoice.third} choice={props.writingChoice}
          label="The only time I write at length is for schoolwork. I don’t object to it but I don’t relish it."
          setChoice={props.setWritingChoice}
        />
        <CheckBoxV2
          currentChoice={WritingChoice.fourth} choice={props.writingChoice}
          label="I’m not a natural communicator on paper: writing is a chore I’d rather do without."
          setChoice={props.setWritingChoice}
        />
        <CheckBoxV2
          currentChoice={WritingChoice.fifth} choice={props.writingChoice}
          label="I hate writing and much prefer subjects have little or no need for it."
          setChoice={props.setWritingChoice}
        />
      </div>
      <BackButtonSix onClick={props.moveBack} />
      <button className="absolute-contunue-btn font-24" onClick={props.moveNext}>Continue</button>
    </div>
  );
}

export default SixStepWritingA;
