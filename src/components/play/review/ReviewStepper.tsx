import React from "react";

import { Question } from "model/question";
import { ComponentAttempt } from "../model";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { isMobile } from "react-device-detect";
import { isPhone } from "services/phone";

interface ReviewStepperProps {
  attempts: ComponentAttempt<any>[];
  questions: Question[];
  noScrolling?: boolean;
  isEnd?: boolean;
  activeStep?: number;
  handleStep(questionIndex: number): any;
}

const ReviewStepper: React.FC<ReviewStepperProps> = ({
  isEnd,
  noScrolling,
  questions,
  activeStep,
  handleStep,
  attempts,
}) => {
  const [stepperRef] = React.useState(React.createRef() as React.RefObject<HTMLDivElement>);

  let questionIndex = 0;

  const renderQuestionStep = (key: number) => {
    const attempt = attempts[questionIndex];
    questionIndex++;
    let index = questionIndex;

    let className = 'step';

    if (activeStep !== undefined && activeStep !== null && activeStep + 1 === questionIndex) {
      className += ' current'
    }

    // render step for invalid question
    if (!attempt) {
      className += ' failed';
      return (
        <div className={className} key={key} onClick={handleStep(index - 1)}>
          <span className={isEnd ? "blue" : ""}>{questionIndex}</span>
          <SpriteIcon name="cancel" className="active text-theme-orange" />
          <div className="underline"><div/></div>
        </div>
      );
    }

    if (attempt.correct) {
      className += ' success';
    } else {
      className += ' failed';
    }

    // render step normal questions
    return (
      <div className={className} key={key} onClick={handleStep(index - 1)}>
        <span className={isEnd ? "blue" : ""}>{questionIndex}</span>
        <SpriteIcon
          name={attempt.correct ? "ok" : "cancel"}
          className={`svg active ${attempt.correct ? "text-theme-green" : "text-theme-orange"}`}
        />
        <div className="underline"><div/></div>
      </div>
    );
  };

  let className = 'stepper';
  if (isMobile && noScrolling) {
    className += ' inline';
  }

  const getStepSize = () => {
    try {
      return window.innerWidth / 25.7;
    } catch {
      return 50;
    }
  }

  const scrollBack = () => {
    try {
      if (stepperRef.current) {
        let el = stepperRef.current;
        el.scrollBy(-getStepSize(), 0);
      }
    } catch {}
  }
  
  const scrollNext = () => {
    try {
      if (stepperRef.current) {
        let el = stepperRef.current;
        el.scrollBy(getStepSize(), 0);
      }
    } catch {}
  }

  if (isPhone()) {
    return (
      <div className={className} ref={stepperRef}>
        {questions.map((q, index) => renderQuestionStep(index))}
      </div>
    );
  }

  return (
    <div className={className} ref={stepperRef}>
      {questions.length > 19 && <div className="scroll-back-button" style={{display: 'none'}}><SpriteIcon onClick={scrollBack} name="arrow-left" /></div>}
      {questions.map((q, index) => renderQuestionStep(index))}
      {questions.length > 19 && <div className="scroll-next-button" style={{display: 'none'}}><SpriteIcon name="arrow-right" onClick={scrollNext} /></div>}
    </div>
  );
};

export default ReviewStepper;
