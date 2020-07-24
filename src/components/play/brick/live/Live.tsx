import React from "react";
import { Grid, Hidden } from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@material-ui/core/styles";
import { useHistory, Redirect } from "react-router-dom";

import "./Live.scss";
import { Question, QuestionTypeEnum } from "model/question";
import QuestionLive from "../questionPlay/QuestionPlay";
import TabPanel from "../baseComponents/QuestionTabPanel";
import { PlayStatus, ComponentAttempt } from "../model/model";
import CountDown from "../baseComponents/CountDown";
import sprite from "../../../../assets/img/icons-sprite.svg";

import { CashQuestionFromPlay } from "../../../localStorage/buildLocalStorage";
import { Brick } from "model/brick";
import LiveStepper from "./LiveStepper";
import ShuffleAnswerDialog from "components/baseComponents/failedRequestDialog/ShuffleAnswerDialog";
import PulsingCircleNumber from "./PulsingCircleNumber";
import { PlayMode } from "../model";

interface LivePageProps {
  status: PlayStatus;
  attempts: ComponentAttempt<any>[];
  brick: Brick;
  questions: Question[];
  isPlayPreview?: boolean;
  previewQuestionIndex?: number;
  updateAttempts(attempt: any, index: number): any;
  finishBrick(): void;

  // only for real play
  mode?: PlayMode;
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
  const [prevStep, setPrevStep] = React.useState(initStep);
  const [isShuffleOpen, setShuffleDialog] = React.useState(false);
  const [isTimeover, setTimeover] = React.useState(false);
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
  questions.forEach(() => questionRefs.push(React.createRef()));

  const handleStep = (step: number) => () => {
    setActiveAnswer();
    let newStep = activeStep + 1;

    if (props.isPlayPreview) {
      CashQuestionFromPlay(brick.id, newStep);
    }
    setTimeout(() => {
      setPrevStep(activeStep);
      setActiveStep(step);
    }, 100);
  };

  const setActiveAnswer = () => {
    const copyAnswers = Object.assign([], answers) as any[];
    copyAnswers[activeStep] = questionRefs[activeStep].current?.getAnswer();
    let attempt = questionRefs[activeStep].current?.getAttempt();
    props.updateAttempts(attempt, activeStep);
    setAnswers(copyAnswers);
  };

  const prev = () => handleStep(activeStep - 1)();

  const nextFromShuffle = () => {
    setShuffleDialog(false);

    handleStep(activeStep + 1)();
    if (activeStep >= questions.length - 1) {
      questions.forEach((question) => (question.edited = false));
      props.finishBrick();
      if (props.isPlayPreview) {
        history.push(`/play-preview/brick/${brick.id}/provisionalScore`);
      } else {
        history.push(`/play/brick/${brick.id}/provisionalScore`);
      }
    }
  };

  const cleanAndNext = () => {
    setShuffleDialog(false);
    handleStep(activeStep + 1)();
    questions[activeStep].edited = false;
    if (activeStep >= questions.length - 1) {
      moveNext();
    }
  };

  const next = () => {
    let question = questions[activeStep];
    if (
      question.type === QuestionTypeEnum.PairMatch ||
      question.type === QuestionTypeEnum.HorizontalShuffle ||
      question.type === QuestionTypeEnum.VerticalShuffle
    ) {
      let attempt = questionRefs[activeStep].current?.getAttempt();
      if (!attempt.dragged) {
        setShuffleDialog(true);
        return;
      }
    }
    handleStep(activeStep + 1)();
    if (activeStep >= questions.length - 1) {
      moveNext();
    }
  };

  const onEnd = () => {
    setTimeover(true);
    moveNext();
  }

  const moveNext = () => {
    questions.forEach((question) => (question.edited = false));
    props.finishBrick();
    if (props.isPlayPreview) {
      history.push(`/play-preview/brick/${brick.id}/provisionalScore`);
    } else {
      history.push(`/play/brick/${brick.id}/provisionalScore`);
    }
  }

  const onQuestionAttempted = (questionIndex: number) => {
    if (!questions[questionIndex].edited) {
      questions[activeStep].edited = true;
      handleStep(questionIndex)();
    }
  };

  const renderQuestion = (question: Question, index: number) => {
    return (
      <QuestionLive
        mode={props.mode}
        isTimeover={isTimeover}
        question={question}
        answers={answers[index]}
        ref={questionRefs[index]}
        onAttempted={() => onQuestionAttempted(index)}
      />
    );
  };

  const renderQuestionContainer = (question: Question, index: number) => {
    return (
      <TabPanel
        key={index}
        index={index}
        value={activeStep}
        dir={theme.direction}
      >
        <div className="introduction-page">
          <PulsingCircleNumber
            isPulsing={true}
            edited={question.edited}
            number={index + 1}
          />
          <div className="question-live-play review-content">
            <div className="question-title">Investigation</div>
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
      <button
        className="play-preview svgOnHover play-white scale-07"
        onClick={prev}
      >
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

  return (
    <div className="brick-container live-page">
      <Hidden only={["xs"]}>
        <Grid container direction="row">
          <Grid item xs={8}>
            <div className="introduction-page">
              <SwipeableViews
                axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                index={activeStep}
                className="swipe-view"
                style={{ width: "100%" }}
                onChangeIndex={handleStep}
              >
                {questions.map(renderQuestionContainer)}
              </SwipeableViews>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className="introduction-info">
              <CountDown
                isLive={true}
                onEnd={onEnd}
                brickLength={brick.brickLength}
              />
              <div className="intro-text-row">
                <LiveStepper
                  activeStep={activeStep}
                  questions={questions}
                  previousStep={prevStep}
                  handleStep={handleStep}
                />
              </div>
              <div className="action-footer">
                <div>{renderPrevButton()}</div>
                <div className="direction-info">
                  <h2>Next</h2>
                  <span>
                    Don’t panic, you can
                    <br />
                    always come back
                  </span>
                </div>
                <div>
                  <button
                    type="button"
                    className="play-preview svgOnHover play-green"
                    onClick={next}
                  >
                    <svg className="svg w80 h80 active m-l-02">
                      {/*eslint-disable-next-line*/}
                      <use href={sprite + "#arrow-right"} />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </Hidden>

      <Hidden only={["sm", "md", "lg", "xl"]}>
        <div className="introduction-info">
          <CountDown
            isLive={true}
            onEnd={onEnd}
            brickLength={brick.brickLength}
          />
          <div className="intro-text-row">
            <Hidden only={["sm", "md", "lg", "xl"]}>
              <span className="heading">Investigation</span>
            </Hidden>
            <LiveStepper
              activeStep={activeStep}
              questions={questions}
              previousStep={prevStep}
              handleStep={handleStep}
            />
          </div>
          <div className="action-footer">
            <div>{renderPrevButton()}</div>
            <div className="direction-info">
              <h2>Next</h2>
              <span>
                Don’t panic, you can
                <br />
                always come back
              </span>
            </div>
            <div>
              <button
                type="button"
                className="play-preview svgOnHover play-green"
                onClick={next}
              >
                <svg className="svg active m-l-02">
                  {/*eslint-disable-next-line*/}
                  <use href={sprite + "#arrow-right"} />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="introduction-page">
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={activeStep}
            className="swipe-view"
            style={{ width: "100%" }}
            onChangeIndex={handleStep}
          >
            {questions.map(renderQuestionContainer)}
          </SwipeableViews>
        </div>

      </Hidden>
      <ShuffleAnswerDialog
        isOpen={isShuffleOpen}
        submit={() => nextFromShuffle()}
        hide={() => setShuffleDialog(false)}
        close={() => cleanAndNext()}
      />
    </div>
  );
};

export default LivePage;
