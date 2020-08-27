import React from "react";
import { Grid, Hidden } from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@material-ui/core/styles";
import update from "immutability-helper";
import { useHistory } from "react-router-dom";
import { Moment } from "moment";

import "./ReviewPage.scss";
import sprite from "assets/img/icons-sprite.svg";
import { Question } from "model/question";
import { PlayStatus } from "../model";
import { PlayMode } from "../model";
import { BrickLengthEnum } from "model/brick";

import ReviewStepper from "./ReviewStepper";
import QuestionLive from "../questionPlay/QuestionPlay";
import TabPanel from "../baseComponents/QuestionTabPanel";
import CountDown from "../baseComponents/CountDown";
import PageLoader from "components/baseComponents/loaders/pageLoader";
import SubmitAnswersDialog from "components/baseComponents/dialogs/SubmitAnswers";

interface ReviewPageProps {
  status: PlayStatus;
  brickId: number;
  questions: Question[];
  brickLength: BrickLengthEnum;
  startTime?: Moment;
  attempts: any[];
  isPlayPreview?: boolean;
  updateAttempts(attempt: any, index: number): any;
  finishBrick(): void;

  // only for real play
  mode?: PlayMode;
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
  const [isSubmitOpen, setSubmitAnswers] = React.useState(false);
  const theme = useTheme();

  if (status === PlayStatus.Live) {
    if (props.isPlayPreview) {
      history.push(`/play-preview/brick/${brickId}/intro`);
    } else {
      history.push(`/play/brick/${brickId}/intro`);
    }
    return <PageLoader content="...Loading..." />;
  } else if (status === PlayStatus.Ending) {
    if (props.isPlayPreview) {
      history.push(`/play-preview/brick/${brickId}/ending`);
    } else {
      history.push(`/play/brick/${brickId}/ending`);
    }
    return <PageLoader content="...Loading..." />;
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
      moveNext();
    }
  };

  const onEnd = () => moveNext();

  const moveNext = () => {
    finishBrick();
    if (props.isPlayPreview) {
      history.push(`/play-preview/brick/${brickId}/ending`);
    } else {
      history.push(`/play/brick/${brickId}/ending`);
    }
  }

  /**
   * Handle mobile swipe
   * @param index number - could be from 0 to 1. in the end should be interger value
   * @param status string - almost all time is "move" and in the end "end"
   */
  const handleSwipe = (step: number, status: string) => {
    if (status === "end") {
      setActiveStep(Math.round(step));
      if (step === questions.length) {
        moveNext();
      }
    }
  }

  const renderQuestion = (question: Question, index: number) => {
    return (
      <QuestionLive
        mode={props.mode}
        attempt={attempts[index]}
        question={question}
        answers={answers[index]}
        ref={questionRefs[index]}
        isReview={true}
      />
    );
  };

  const renderReviewTitle = (attempt: any) => {
    if (attempt.correct) {
      return "Correct!"
    }
    return "Not quite - try again!";
  }

  const renderQuestionContainer = (question: Question, index: number) => {
    let indexClassName = "question-index-container";
    const attempt = attempts[index];
    if (attempt && attempt.correct) {
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
        <div className="introduction-page">
          <div className={indexClassName}>
            <div className="question-index">{index + 1}</div>
          </div>
          <div className="question-live-play review-content">
            <div className="question-title">{renderReviewTitle(attempt)}</div>
            {renderQuestion(question, index)}
          </div>
        </div>
      </TabPanel>
    );
  };

  const renderPrevButton = () => {
    if (activeStep === 0) {
      return "";
    }
    return (
      <button className="play-preview svgOnHover play-white" onClick={prev}>
        <svg className="svg w80 h80 svg-default m-r-02">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#arrow-left"} className="text-gray" />
        </svg>
        <svg className="svg w80 h80 colored m-r-02">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#arrow-left"} className="text-white" />
        </svg>
      </button>
    );
  };

  const renderMobileNext = () => {
    if (questions.length - 1 > activeStep) { return; }
    return (
      <button
        type="button"
        className="play-preview svgOnHover play-green mobile-next"
        onClick={() => setSubmitAnswers(true)}
      >
        <svg className="svg w80 h80 active m-l-02">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#arrow-right"} />
        </svg>
      </button>
    );
  }

  return (
    <div className="brick-container review-page">
      <Grid container direction="row">
        <Grid item sm={8} xs={12}>
          <Hidden only={['xs']}>
            <SwipeableViews
              axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={activeStep}
              className="swipe-view"
              onChangeIndex={handleStep}
            >
              {questions.map(renderQuestionContainer)}
            </SwipeableViews>
          </Hidden>
          <Hidden only={["sm", "md", "lg", "xl"]}>
            <SwipeableViews
              axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={activeStep}
              className="swipe-view"
              onSwitching={handleSwipe}
              onChangeIndex={handleStep}
            >
              {questions.map(renderQuestionContainer)}
              <TabPanel index={questions.length} value={activeStep} />
            </SwipeableViews>
            {renderMobileNext()}
          </Hidden>
        </Grid>
        <Grid item sm={4} xs={12}>
          <div className="introduction-info">
            <CountDown brickLength={props.brickLength} endTime={null} setEndTime={() => { }} onEnd={onEnd} />
            <div className="intro-text-row">
              <Hidden only={['sm', 'md', 'lg', 'xl']}>
                <span className="heading">Review</span>
              </Hidden>
              <ReviewStepper
                questions={questions}
                attempts={attempts}
                handleStep={handleStep}
              />
            </div>
            <Hidden only={['xs']}>
              <div className="action-footer">
                <div>{renderPrevButton()}</div>
                <div className="direction-info">
                  <h2 className="text-center">Next</h2>
                  <span>Don’t panic, you can<br />always come back</span>
                </div>
                <div>
                  <button type="button" className="play-preview svgOnHover play-green" onClick={next}>
                    <svg className="svg w80 h80 active m-l-02">
                      {/*eslint-disable-next-line*/}
                      <use href={sprite + "#arrow-right"} />
                    </svg>
                  </button>
                </div>
              </div>
            </Hidden>
          </div>
        </Grid>
      </Grid>
      <SubmitAnswersDialog
        isOpen={isSubmitOpen}
        submit={moveNext}
        close={() => setSubmitAnswers(false)}
      />
    </div>
  );
};

export default ReviewPage;
