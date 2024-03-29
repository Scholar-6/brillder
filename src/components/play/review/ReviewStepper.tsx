import React from "react";

import { Question } from "model/question";
import { ComponentAttempt } from "../model";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { isPhone } from "services/phone";

interface ReviewStepperProps {
  attempts: ComponentAttempt<any>[];
  questions: Question[];
  noScrolling?: boolean;
  isProvisional?: boolean;
  isEnd?: boolean;
  activeStep?: number;
  handleStep(questionIndex: number): any;
}

const ReviewStepper: React.FC<ReviewStepperProps> = ({
  isEnd,
  noScrolling,
  questions,
  activeStep,
  isProvisional,
  handleStep,
  attempts,
}) => {
  const [stepperRef] = React.useState(
    React.createRef() as React.RefObject<HTMLDivElement>
  );

  let questionIndex = 0;

  const renderQuestionStep = (key: number) => {
    const attempt = attempts[questionIndex];
    questionIndex++;
    let index = questionIndex;
    let isActive = false;

    let className = "step";

    if (
      activeStep !== undefined &&
      activeStep !== null &&
      activeStep + 1 === questionIndex
    ) {
      className += " current";
      isActive = true;
    }

    // render step for invalid question
    if (!attempt) {
      className += " failed";
      return (
        <div className={className} key={key} onClick={handleStep(index - 1)}>
          <span className={isEnd ? "blue" : ""}>{questionIndex}</span>
          <SpriteIcon name="cancel" className="active text-theme-orange" />
        </div>
      );
    }

    if (attempt.correct) {
      className += " success";
    } else if (attempt.marks > 0) {
      className += " almost-failed";
    } else {
      className += " failed";
    }

    // render step normal questions
    return (
      <div className={className} key={key} onClick={handleStep(index - 1)}>
        <div>
          <span className={isEnd ? "blue" : ""}>{questionIndex}</span>
          <SpriteIcon
            name={attempt.correct ? "ok" : "cancel-custom"}
            className="svg active"
          />
          {isActive && <div className="fixed-stepper-triangle" />}
        </div>
      </div>
    );
  };

  let className = "stepper";
  if (isPhone() && noScrolling) {
    className += " inline";
  }

  const getStepSize = () => {
    try {
      return window.innerWidth / 25.7;
    } catch {
      return 50;
    }
  };

  const scrollBack = () => {
    try {
      if (stepperRef.current) {
        let el = stepperRef.current;
        el.scrollBy(-getStepSize(), 0);
      }
    } catch {}
  };

  const scrollNext = () => {
    try {
      if (stepperRef.current) {
        let el = stepperRef.current;
        el.scrollBy(getStepSize(), 0);
      }
    } catch {}
  };

  if (isPhone()) {
    return (
      <div className={className} ref={stepperRef}>
        {questions.map((q, index) => renderQuestionStep(index))}
      </div>
    );
  }

  return (
    <div className={className}>
      {questions.length > 18 && (
        <div className="scroll-back-button" style={{ display: "none" }}>
          <SpriteIcon onClick={scrollBack} name="arrow-left" />
        </div>
      )}
      {isProvisional
      ?  questions.map((q, index) => renderQuestionStep(index))
      :
      <div className="scrollable-steps" ref={stepperRef}>
        {questions.map((q, index) => renderQuestionStep(index))}
      </div>}
      {questions.length > 18 && (
        <div className="scroll-next-button" style={{ display: "none" }}>
          <SpriteIcon name="arrow-right" onClick={scrollNext} />
        </div>
      )}
    </div>
  );
};

export default ReviewStepper;
