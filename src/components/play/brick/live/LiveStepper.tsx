import React from "react";
import { Grid } from "@material-ui/core";

import "./Live.scss";
import { Question } from "model/question";

interface StepperProps {
  activeStep: number;
  questions: Question[];
  handleStep(questionIndex: number): any;
}

const LiveStepper: React.FC<StepperProps> = ({
  activeStep,
  questions,
  handleStep,
}) => {
  function isAttempted(question: Question) {
    if (question.edited) {
      return true;
    }
    return false;
  }

  let colWidth = 4;
  if (questions.length > 27) {
    colWidth = 3;
  }

  let questionIndex = 0;

  const renderQuestionStep = (question: Question, key: number, colWidth: number) => {
    let edited = isAttempted(question);

    let className = "step";
    if (edited) {
      className += " completed";
    }
    if (activeStep === questionIndex) {
      className += " current";
    }
    questionIndex++;
    let index = questionIndex;
    return (
      <Grid item xs={colWidth as any} key={key} className={className} onClick={handleStep(index - 1)}>
        <span>{questionIndex}</span>
        {question.edited ? (
          <div className="blue-circle-container animated pulse duration-1s iteration-2">
            <div className="blue-circle"></div>
          </div>
        ) : (
          ""
        )}
      </Grid>
    );
  };

  return (
    <Grid container direction="row" className="stepper">
      {questions.map((question, index) => renderQuestionStep(question, index, colWidth))}
    </Grid>
  );
};

export default LiveStepper;
