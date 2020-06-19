import React from "react";
import { Grid } from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@material-ui/core/styles";
import update from "immutability-helper";
import { useHistory } from "react-router-dom";

import "./ReviewPage.scss";
import { Question } from "model/question";
import QuestionLive from "../questionPlay/QuestionPlay";
import TabPanel from "../baseComponents/QuestionTabPanel";
import { PlayStatus, ComponentAttempt } from "../model/model";
import sprite from "../../../../assets/img/icons-sprite.svg";
import ReviewStepper from "./ReviewStepper";

interface ReviewPageProps {
  status: PlayStatus;
  brickId: number;
  questions: Question[];
  attempts: any[];
  isPlayPreview?: boolean;
  updateAttempts(attempt: any, index: number): any;
  finishBrick(): void;
}

const ReviewPage: React.FC<ReviewPageProps> = ({
  status,
  questions,
  updateAttempts,
  attempts,
  finishBrick,
  brickId,
  ...props
}) => {
  const history = useHistory();
  const [activeStep, setActiveStep] = React.useState(0);
  let initAnswers: any[] = [];
  const [answers, setAnswers] = React.useState(initAnswers);
  const theme = useTheme();

  if (status === PlayStatus.Live) {
    if (props.isPlayPreview) {
      history.push(`/play-preview/brick/${brickId}/intro`);
    } else {
      history.push(`/play/brick/${brickId}/intro`);
    }
    return <div>...Loading...</div>;
  } else if (status === PlayStatus.Ending) {
    if (props.isPlayPreview) {
      history.push(`/play-preview/brick/${brickId}/ending`);
    } else {
      history.push(`/play/brick/${brickId}/ending`);
    }
    return <div>...Loading...</div>;
  }

  let questionRefs: React.RefObject<QuestionLive>[] = [];
  questions.forEach(() => {
    questionRefs.push(React.createRef());
  });

  const handleStep = (step: number) => () => {
    const copyAnswers = Object.assign([], answers) as any[];
    copyAnswers[activeStep] = questionRefs[activeStep].current?.getAnswer();
    let attempt = questionRefs[activeStep].current?.getAttempt();
    updateAttempts(attempt, activeStep);
    setAnswers(copyAnswers);
    setActiveStep(step);
  };

  const setActiveAnswer = () => {
    const copyAnswers = Object.assign([], answers) as any[];
    copyAnswers[activeStep] = questionRefs[activeStep].current?.getAnswer();
    let attempt = questionRefs[activeStep].current?.getAttempt();
    updateAttempts(attempt, activeStep);
    setAnswers(copyAnswers);
  };

  const prev = () => {
    setActiveAnswer();
    questions[activeStep].edited = true;
    setActiveStep(update(activeStep, { $set: activeStep - 1 }));
  };

  const next = () => {
    setActiveAnswer();
    questions[activeStep].edited = true;
    setActiveStep(update(activeStep, { $set: activeStep + 1 }));

    if (activeStep >= questions.length - 1) {
      finishBrick();
      if (props.isPlayPreview) {
        history.push(`/play-preview/brick/${brickId}/ending`);
      } else {
        history.push(`/play/brick/${brickId}/ending`);
      }
    }
  };

  const renderQuestion = (question: Question, index: number) => {
    return (
      <QuestionLive
        attempt={attempts[index]}
        question={question}
        answers={answers[index]}
        ref={questionRefs[index]}
      />
    );
  };

  const renderQuestionContainer = (question: Question, index: number) => {
    let indexClassName = "question-index-container";
    const attempt = attempts[index];
    if (attempt.correct) {
      indexClassName += " correct";
    } else {
      indexClassName += " wrong";
    }
    return (
      <TabPanel
        key={index}
        index={index}
        value={activeStep}
        dir={theme.direction}
      >
        <div className={indexClassName}>
          <div className="question-index">{index + 1}</div>
        </div>
        <div className="question-live-play">
          {renderQuestion(question, index)}
        </div>
      </TabPanel>
    );
  };

  const renderPrevButton = () => {
    if (activeStep === 0) {
      return "";
    }
    return (
      <button className="play-preview svgOnHover back-button" onClick={prev}>
        <img className="svg svg-default" alt="" src="/feathericons/svg/chevron-left-blue.svg" />
        <img className="svg colored" alt="" src="/feathericons/svg/chevron-left-blue.svg" />
      </button>
    );
  };

  return (
    <div className="brick-container review-page">
      <Grid container direction="row">
        <Grid item xs={8}>
          <div className="review-page">
            <SwipeableViews
              axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={activeStep}
              onChangeIndex={handleStep}
            >
              {questions.map(renderQuestionContainer)}
            </SwipeableViews>
          </div>
        </Grid>
        <Grid item xs={4}>
          <div className="introduction-info">
            <div className="intro-header">
              <div className="clock">
                <div className="clock-image svgOnHover">
                  <svg className="svg w100 h100 active">
                    <use href={sprite + "#clock"} />
                  </svg>
                </div>
              </div>
            </div>
            <div className="intro-text-row">
              <ReviewStepper
                questions={questions}
                attempts={attempts}
                handleStep={handleStep}
              />
            </div>
            <Grid container direction="row" className="action-footer">
              <Grid container item xs={3} justify="center">
                {renderPrevButton()}
              </Grid>
              <Grid container item xs={6} justify="center" className="fotter-text">
                <h2>Next</h2>
                <div>Don’t panic, you can</div>
                <div>always come back</div>
              </Grid>
              <Grid container item xs={3} justify="center">
                <button
                  type="button"
                  className="play-preview svgOnHover play-green"
                  onClick={next}
                >
                  <img className="svg svg-default" alt="" src="/feathericons/svg/chevron-right-white.svg" />
                  <img className="svg colored" alt="" src="/feathericons/svg/chevron-right-white.svg" />
                </button>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default ReviewPage;
