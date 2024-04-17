import React from "react";

import BackButtonSix from "../BackButtonSix";
import ButtonR34 from "../ButtonR34";
import NextButtonSix from "../NextButtonSix";
import { isPhone } from "services/phone";

export enum ReadingChoice {
  first = 1,
  second,
  third,
  fourth
}

interface ReadingV1Props {
  readingChoice: ReadingChoice | null;
  onChange(value: ReadingChoice): void;
  moveBack(): void;
  moveNext(): void;
}

const ReadingV1: React.FC<ReadingV1Props> = (props) => {
  const renderBtns = () => {
    return (
      <div className="boxes-container font-16">
        <ButtonR34
          currentChoice={ReadingChoice.first} choice={props.readingChoice}
          label="Literature is one of my passions. I make efforts to read the classics that we haven’t studied in class, and I like to read modern titles too."
          className="reading-long-btn"
          setChoice={props.onChange}
        />
        <ButtonR34
          currentChoice={ReadingChoice.second} choice={props.readingChoice}
          className="reading-long-btn"
          label="I do read for pleasure and enjoy books if they interest me." setChoice={props.onChange}
        />
        <ButtonR34
          currentChoice={ReadingChoice.third} choice={props.readingChoice}
          label="I read books that are set at school and usually enjoy them unless they’re really boring."
          className="reading-long-btn"
          setChoice={props.onChange}
        />
        <ButtonR34
          currentChoice={ReadingChoice.fourth} choice={props.readingChoice}
          label="I get very little pleasure from reading and I don’t enjoy reading for school."
          className="reading-long-btn"
          setChoice={props.onChange}
        />
      </div>
    )
  }

  if (isPhone()) {
    return (
      <div className="question question-6 question-reading">
        <div className="relative">
          <img src="/images/choicesTool/phone/Reading.png" className="third-step-img third-step-img-r4"></img>
        </div>
        <div className="bold font-24 question-text">
          Reading
        </div>
        <div className="font-16 margin-left-4">
          Which of the following<br/>
          statements best describes your<br/>
          attitude to reading?
        </div>
        {renderBtns()}
        <BackButtonSix onClick={props.moveBack} />
        <NextButtonSix label="Continue" disabled={props.readingChoice === null} onClick={props.moveNext} />
      </div>
    );
  }
  return (
    <div className="question question-6">
      <img src="/images/choicesTool/SecondStepReadingV1.png" className="third-step-img third-step-img-r4"></img>
      <div className="bold font-32 question-text">
        Reading
      </div>
      <div className="font-16">
        Which of the following statements best describes your attitude to reading?
      </div>
      {renderBtns()}
      <BackButtonSix onClick={props.moveBack} />
      <NextButtonSix label="Continue" disabled={props.readingChoice === null} onClick={props.moveNext} />
    </div>
  );
}

export default ReadingV1;
