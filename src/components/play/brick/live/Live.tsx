import React from "react";
import { Grid } from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@material-ui/core/styles";
import update from "immutability-helper";
import { useHistory, Redirect } from "react-router-dom";

import "./Live.scss";
import { Question } from "model/question";
import QuestionLive from "../questionPlay/QuestionPlay";
import TabPanel from "../baseComponents/QuestionTabPanel";
import { PlayStatus, ComponentAttempt } from "../model/model";
import BrickCounter from "../baseComponents/BrickCounter";
import sprite from "../../../../assets/img/icons-sprite.svg";

import { CashQuestionFromPlay } from "../../../localStorage/buildLocalStorage";
import { Moment } from "moment";
import { Brick } from "model/brick";
import LiveStepper from "./LiveStepper";

interface LivePageProps {
  status: PlayStatus;
  attempts: ComponentAttempt[];
  brick: Brick;
  startTime?: Moment;
  questions: Question[];
  isPlayPreview?: boolean;
  previewQuestionIndex?: number;
  updateAttempts(attempt: any, index: number): any;
  finishBrick(): void;
}

const LivePage: React.FC<LivePageProps> = ({
  status,
  questions,
  brick,
  ...props
}) => {
  let initStep = 0;
  if (props.previewQuestionIndex) {
    if (questions[props.previewQuestionIndex]) {
      initStep = props.previewQuestionIndex;
    }
  }

  const [activeStep, setActiveStep] = React.useState(initStep);
  let initAnswers: any[] = [];

  const [answers, setAnswers] = React.useState(initAnswers);
  const history = useHistory();

  const theme = useTheme();

  if (status > PlayStatus.Live) {
    if (props.isPlayPreview) {
      return (
        <Redirect to={`/play-preview/brick/${brick.id}/provisionalScore`} />
      );
    } else {
      return <Redirect to={`/play/brick/${brick.id}/provisionalScore`} />;
    }
  }

  let questionRefs: React.RefObject<QuestionLive>[] = [];
  questions.forEach(() => {
    questionRefs.push(React.createRef());
  });

  const isAttempted = (question: Question) => {
    if (question.edited) {
      return true;
    }
    return false;
  }

  const handleStep = (step: number) => () => {
    setActiveAnswer();
    questions[activeStep].edited = true;
    let newStep = activeStep + 1;
    setActiveStep(update(activeStep, { $set: step }));

    if (props.isPlayPreview) {
      CashQuestionFromPlay(brick.id, newStep);
    }
  };

  const setActiveAnswer = () => {
    const copyAnswers = Object.assign([], answers) as any[];
    copyAnswers[activeStep] = questionRefs[activeStep].current?.getAnswer();
    let attempt = questionRefs[activeStep].current?.getAttempt();
    props.updateAttempts(attempt, activeStep);
    setAnswers(copyAnswers);
  };

  const next = () => {
    handleStep(activeStep + 1)();
    if (activeStep >= questions.length - 1) {
      questions.forEach((question) => {
        question.edited = false;
      });
      props.finishBrick();
      if (props.isPlayPreview) {
        history.push(`/play-preview/brick/${brick.id}/provisionalScore`);
      } else {
        history.push(`/play/brick/${brick.id}/provisionalScore`);
      }
    }
  };

  const renderQuestion = (question: Question, index: number) => {
    return (
      <QuestionLive
        question={question}
        answers={answers[index]}
        ref={questionRefs[index]}
      />
    );
  };

  const renderQuestionContainer = (question: Question, index: number) => {
    let indexClassName = "question-index-container";
    if (isAttempted(question)) {
      indexClassName += " attempted";
    }
    return (
      <TabPanel
        key={index}
        index={index}
        value={activeStep}
        dir={theme.direction}
      >
        <div className={indexClassName}>
          <div className="question-index">
            {index + 1}
          </div>
        </div>
        <div className="question-live-play">
          {renderQuestion(question, index)}
        </div>
      </TabPanel>
    );
  }

  return (
    <div className="brick-container live-page">
      <Grid container direction="row">
        <Grid item xs={8}>
          <div className="live-page">
            <div className="intro-header"></div>
            <SwipeableViews
              axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={activeStep}
              style={{ width: "100%" }}
              onChangeIndex={handleStep}
            >
              {questions.map(renderQuestionContainer)}
            </SwipeableViews>
          </div>
        </Grid>
        <Grid item xs={4}>
          <div className="introduction-info">
            <div className="intro-header">
              <BrickCounter startTime={props.startTime} />
              <div className="clock">
                <div className="clock-image svgOnHover">
                  <svg className="svg w100 h100 active">
                    <use href={sprite + "#clock"} />
                  </svg>
                </div>
                <span className="max-length">{brick.brickLength}</span>
              </div>
            </div>
            <div className="intro-text-row">
              <LiveStepper
                questions={questions}
                attempts={props.attempts}
                handleStep={handleStep}
              />
            </div>
            <div className="action-footer">
              <h2>Next</h2>
              <button
                type="button"
                className="play-preview svgOnHover play-green"
                onClick={next}
              >
                <svg className="svg svg-default">
                  <use href={sprite + "#play-thin"} />
                </svg>
                <svg className="svg colored">
                  <use href={sprite + "#play-thick"} />
                </svg>
              </button>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default LivePage;
