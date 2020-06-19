import React from "react";
import { Grid } from "@material-ui/core";

import { Question } from "model/question";
import { ComponentAttempt } from "../model/model";

interface ReviewStepperProps {
  attempts: ComponentAttempt[];
  questions: Question[];
  handleStep(questionIndex: number): any;
}

const ReviewStepper: React.FC<ReviewStepperProps> = ({
  questions,
  handleStep,
  attempts
}) => {
  const chunk = (arr: Question[], size: number) =>
    arr.reduce(
      (acc: any, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]),
      []
    );

  let cols: Question[][] = [];
  let colWidth = 4 as any;
  if (questions.length <= 27) {
    cols = chunk(questions, 3) as Question[][];
  } else {
    cols = chunk(questions, 4) as Question[][];
    colWidth = 3 as any;
  }

  let questionIndex = 0;

  return (
    <Grid container direction="row" className="stepper">
      {cols.map((col, colKey) => {
        return (
          <Grid item key={colKey} xs={colWidth}>
            {col.map((question, key) => {
              const attempt = attempts[questionIndex];

              questionIndex++;
              let index = questionIndex;
              return (
                <div
                  key={key}
                  className="step"
                  onClick={handleStep(index - 1)}
                >
                  {questionIndex}
                  <img
                    alt=""
                    src={
                      attempt.correct
                        ? "/feathericons/svg/check-green.svg"
                        : "/feathericons/svg/x-orange.svg"
                    }
                  />
                </div>
              );
            })}
          </Grid>
        );
      })}
    </Grid>
  );
};

export default ReviewStepper;
