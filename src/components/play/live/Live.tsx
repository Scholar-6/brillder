import React, { useEffect } from "react";
import { Grid, Hidden } from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@material-ui/core/styles";
import { useHistory, useLocation } from "react-router-dom";
import queryString from 'query-string';
import { Moment } from 'moment';

import "./Live.scss";

import { Question, QuestionTypeEnum } from "model/question";
import QuestionLive from "../questionPlay/QuestionPlay";
import { PlayStatus, ComponentAttempt } from "../model";
import { CashQuestionFromPlay } from "localStorage/buildLocalStorage";
import { Brick } from "model/brick";
import { PlayMode } from "../model";
import { getPlayPath, getAssignQueryString, scrollToStep } from "../service";

import CountDown from "../baseComponents/CountDown";
import LiveStepper from "./components/LiveStepper";
import TabPanel from "../baseComponents/QuestionTabPanel";
import ShuffleAnswerDialog from "components/baseComponents/failedRequestDialog/ShuffleAnswerDialog";
import SubmitAnswersDialog from "components/baseComponents/dialogs/SubmitAnswers";
import PulsingCircleNumber from "./components/PulsingCircleNumber";
import LiveActionFooter from './components/LiveActionFooter';
import MobileNextButton from './components/MobileNextButton';
import { leftKeyPressed, rightKeyPressed } from "components/services/key";
import MobilePrevButton from "./components/MobilePrevButton";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import TimeProgressbar from "../baseComponents/timeProgressbar/TimeProgressbar";
import { isPhone } from "services/phone";

interface LivePageProps {
  status: PlayStatus;
  attempts: ComponentAttempt<any>[];
  brick: Brick;
  questions: Question[];
  isPlayPreview?: boolean;
  previewQuestionIndex?: number;
  updateAttempts(attempt: any, index: number): any;
  finishBrick(): void;

  // things related to count down
  endTime: any;
  setEndTime(time: Moment): void;

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
  const [isSubmitOpen, setSubmitAnswers] = React.useState(false);
  let initAnswers: any[] = [];

  const [answers, setAnswers] = React.useState(initAnswers);
  const history = useHistory();

  const location = useLocation();
  const theme = useTheme();

  useEffect(() => {
    function handleMove(e: any) {
      if (rightKeyPressed(e)) {
        if (questions.length - 1 > activeStep) {
          next();
        } else {
          setSubmitAnswers(true);
        }
      } else if (leftKeyPressed(e)) {
        prev();
      }
    }

    document.addEventListener("keydown", handleMove, false);

    return function cleanup() {
      document.removeEventListener("keydown", handleMove, false);
    };
  });

  useEffect(() => {
    const values = queryString.parse(location.search);
    if (values.activeStep) {
      setActiveStep(parseInt(values.activeStep as string));
    }
  }, [location.search]);

  const moveToProvisional = () => {
    let playPath = getPlayPath(props.isPlayPreview, brick.id);
    history.push(`${playPath}/provisionalScore${getAssignQueryString(location)}`);
  }

  if (status > PlayStatus.Live) {
    moveToProvisional();
    return <div></div>;
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

  const setCurrentAnswerAttempt = () => {
    let attempt = questionRefs[activeStep].current?.getAttempt(false);
    props.updateAttempts(attempt, activeStep);
  }

  const setActiveAnswer = () => {
    const copyAnswers = Object.assign([], answers) as any[];
    copyAnswers[activeStep] = questionRefs[activeStep].current?.getAnswer();
    setCurrentAnswerAttempt();
    setAnswers(copyAnswers);
  };

  const prev = () => {
    if (activeStep === 0) {
      moveToPrep();
    } else {
      handleStep(activeStep - 1)();
      scrollToStep(activeStep);
    }
  }

  const nextFromShuffle = () => {
    setShuffleDialog(false);
    onQuestionAttempted(activeStep);

    handleStep(activeStep + 1)();
    if (activeStep >= questions.length - 1) {
      questions.forEach((question) => (question.edited = false));
      props.finishBrick();
      moveToProvisional();
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
      let attempt = questionRefs[activeStep].current?.getAttempt(false);
      if (!attempt.dragged) {
        setShuffleDialog(true);
        return;
      }
    }
    handleStep(activeStep + 1)();
    scrollToStep(activeStep + 2);

    if (activeStep >= questions.length - 1) {
      setSubmitAnswers(true);
    }
  };

  const onEnd = () => {
    setTimeover(true);
    moveNext();
  }

  const moveNext = () => {
    handleStep(activeStep + 1)();
    questions.forEach((question) => (question.edited = false));
    props.finishBrick();
    moveToProvisional();
  }

  const submitAndMove = () => {
    setActiveAnswer();
    questions.forEach((question) => (question.edited = false));
    props.finishBrick();
    moveToProvisional();
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
        attempt={props.attempts[index]}
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
        <PulsingCircleNumber
          isPulsing={true}
          edited={question.edited}
          number={index + 1}
        />
        <div className="question-live-play review-content">
          <div className="question-title">Investigation</div>
          {renderQuestion(question, index)}
        </div>
      </TabPanel>
    );
  };

  const moveToPrep = () => {
    let attempt = questionRefs[activeStep].current?.getRewritedAttempt(false);
    props.updateAttempts(attempt, activeStep);
    let playPath = getPlayPath(props.isPlayPreview, brick.id);
    const values = queryString.parse(location.search);
    let link = `${playPath}/intro?prepExtanded=true&resume=true&activeStep=${activeStep}`;
    if (values.assignmentId) {
      link += '&assignmentId=' + values.assignmentId;
    }
    history.push(link);
  }

  const renderStepper = () => {
    return (
      <LiveStepper
        activeStep={activeStep}
        questions={questions}
        previousStep={prevStep}
        handleStep={handleStep}
        moveToPrep={moveToPrep}
      />
    );
  }

  const renderCountDown = () => {
    return (
      <CountDown
        isLive={true}
        onEnd={onEnd}
        endTime={props.endTime}
        brickLength={brick.brickLength}
        setEndTime={props.setEndTime}
      />
    );
  }

  const renderMobileButtons = () => {
    return (
      <div className="action-footer mobile-footer-fixed-buttons">
        <SpriteIcon name="arrow-left" className="mobile-back-button" onClick={prev} />
        <SpriteIcon name="arrow-right" className="mobile-next-button" onClick={() => {
          if (questions.length - 1 > activeStep) {
            next();
          } else {
            setSubmitAnswers(true);
          }
        }} />
      </div>
    );
  }

  return (
    <div className="brick-row-container live-container">
      <div className="brick-container play-preview-panel live-page">
        <div className="introduction-page">
          <Hidden only={["xs"]}>
            <Grid container direction="row">
              <Grid item xs={8}>
                <SwipeableViews
                  axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                  index={activeStep}
                  className="swipe-view"
                  style={{ width: "100%" }}
                  onChangeIndex={handleStep}
                >
                  {questions.map(renderQuestionContainer)}
                </SwipeableViews>
                <div className="new-layout-footer" style={{ display: 'none' }}>
                  <div className="time-container">
                    <TimeProgressbar
                      isLive={true}
                      onEnd={onEnd}
                      endTime={props.endTime}
                      brickLength={brick.brickLength}
                      setEndTime={props.setEndTime}
                    />
                  </div>
                  <div className="title-column">
                    <div>
                      <div className="subject">{brick.subject?.name}</div>
                      <div>{brick.title}</div>
                    </div>
                  </div>
                  <div className="new-navigation-buttons">
                    <div className="n-btn back" onClick={prev}>
                      <SpriteIcon name="arrow-left" />
                      Back
                    </div>
                    <div className="n-btn next" onClick={() => {
                      if (questions.length - 1 > activeStep) {
                        next();
                      } else {
                        setSubmitAnswers(true);
                      }
                    }}>
                      Next
                      <SpriteIcon name="arrow-right" />
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="introduction-info">
                  {renderCountDown()}
                  <div className="intro-text-row f-align-self-start m-t-5">
                    {renderStepper()}
                  </div>
                  <LiveActionFooter
                    questions={questions}
                    activeStep={activeStep}
                    prev={prev}
                    next={next}
                    setSubmitAnswers={setSubmitAnswers}
                  />
                </div>
              </Grid>
            </Grid>
          </Hidden>
          <Hidden only={["sm", "md", "lg", "xl"]}>
            <div className="introduction-info">
              {renderCountDown()}
              <div className="intro-text-row">
                <span className="phone-stepper-head"><span className="bold">{brick.subject?.name}</span> {brick.title}</span>
                {renderStepper()}
              </div>
            </div>
            <div className="introduction-content">
              {questions.map(renderQuestionContainer)}
              {isPhone() ? renderMobileButtons() :
                <div className="action-footer">
                  <div>
                    <MobilePrevButton activeStep={activeStep} onClick={prev} />
                  </div>
                  <div className="direction-info text-center"></div>
                  <div>
                    <MobileNextButton questions={questions} activeStep={activeStep} onClick={next} setSubmitAnswers={setSubmitAnswers} />
                  </div>
                </div>}
              <div className="time-container">
                <TimeProgressbar
                  isLive={true}
                  onEnd={onEnd}
                  endTime={props.endTime}
                  brickLength={brick.brickLength}
                  setEndTime={props.setEndTime}
                />
              </div>
            </div>
          </Hidden>
          <ShuffleAnswerDialog
            isOpen={isShuffleOpen}
            submit={() => nextFromShuffle()}
            hide={() => setShuffleDialog(false)}
            close={() => cleanAndNext()}
          />
          <SubmitAnswersDialog
            isOpen={isSubmitOpen}
            submit={submitAndMove}
            close={() => setSubmitAnswers(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default LivePage;
