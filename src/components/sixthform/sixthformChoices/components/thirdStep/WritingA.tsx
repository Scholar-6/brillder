import React from "react";
import BackButtonSix from "../BackButtonSix";
import ButtonR34 from "../ButtonR34";
import { isPhone } from "services/phone";
import NextButtonSix from "../NextButtonSix";

export enum WritingChoice {
  Never = 1,
  Sometimes,
  ALot
}

export enum WritingChoice {
  first = 1,
  second,
  third,
  fourth,
}

interface Props {
  writingChoice: WritingChoice | null;
  setWritingChoice(choice: WritingChoice): void;
  moveBack(): void;
  moveNext(): void;
}

const SixStepWritingA: React.FC<Props> = (props) => {
  if (isPhone()) {
    return (
      <div className="question question-reading question-6-writing">
        <div className="relative">
          <img src="/images/choicesTool/phone/Writing.png" className="third-step-img step-img-r17"></img>
        </div>
        <div className="bold font-24 question-text">
          Writing
        </div>
        <div className="font-16 margin-left-4">
          Which of the following<br/>
          statements best describes your<br/>
          attitude to writing?
        </div>
        <div className="boxes-container start font-16">
          <ButtonR34
            currentChoice={WritingChoice.first} choice={props.writingChoice}
            label="Writing well is something I take pride in and hugely enjoy."
            setChoice={props.setWritingChoice}
          />
          <ButtonR34
            currentChoice={WritingChoice.second} choice={props.writingChoice}
            label="I am confident that I’m a good written communicator and I like writing."
            setChoice={props.setWritingChoice}
          />
          <ButtonR34
            currentChoice={WritingChoice.third} choice={props.writingChoice}
            label="The only time I write at length is for schoolwork. I don’t object to it but I don’t relish it."
            setChoice={props.setWritingChoice}
          />
          <ButtonR34
            currentChoice={WritingChoice.fourth} choice={props.writingChoice}
            label="I don’t enjoy writing and much prefer subjects that have little or no need for it."
            setChoice={props.setWritingChoice}
          />
        </div>
        <BackButtonSix onClick={props.moveBack} />
        <NextButtonSix label="Continue" disabled={props.writingChoice === null} onClick={props.moveNext} />
      </div>
    );
  }
  return (
    <div className="question question-6  question-6-writing">
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
        <ButtonR34
          currentChoice={WritingChoice.first} choice={props.writingChoice}
          label="Writing well is something I take pride in and hugely enjoy."
          setChoice={props.setWritingChoice}
        />
        <ButtonR34
          currentChoice={WritingChoice.second} choice={props.writingChoice}
          label="I am confident that I’m a good written communicator and I like writing."
          setChoice={props.setWritingChoice}
        />
        <ButtonR34
          currentChoice={WritingChoice.third} choice={props.writingChoice}
          label="The only time I write at length is for schoolwork. I don’t object to it but I don’t relish it."
          setChoice={props.setWritingChoice}
        />
        <ButtonR34
          currentChoice={WritingChoice.fourth} choice={props.writingChoice}
          label="I don’t enjoy writing and much prefer subjects that have little or no need for it."
          setChoice={props.setWritingChoice}
        />
      </div>
      <BackButtonSix onClick={props.moveBack} />
      <NextButtonSix label="Continue" disabled={props.writingChoice === null} onClick={props.moveNext} />
    </div>
  );
}

export default SixStepWritingA;
