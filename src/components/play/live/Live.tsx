import React, { useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { Moment } from "moment";
import { isMobile } from "react-device-detect";

import "./Live.scss";

import { Question, QuestionTypeEnum } from "model/question";
import QuestionLive from "../questionPlay/QuestionPlay";
import { PlayStatus, ComponentAttempt } from "../model";
import { CashQuestionFromPlay } from "localStorage/buildLocalStorage";
import { Brick } from "model/brick";
import { PlayMode } from "../model";
import { getPlayPath, scrollToStep } from "../service";
import actions from 'redux/actions/play';

import LiveStepper from "./components/LiveStepper";
import TabPanel from "../baseComponents/QuestionTabPanel";
import ShuffleAnswerDialog from "components/baseComponents/failedRequestDialog/ShuffleAnswerDialog";
import SubmitAnswersDialog from "components/baseComponents/dialogs/SubmitAnswers";
import { leftKeyPressed, rightKeyPressed } from "components/services/key";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import TimeProgressbar from "../baseComponents/timeProgressbar/TimeProgressbar";
import { isPhone } from "services/phone";
import { getLiveTime } from "../services/playTimes";
import BrickTitle from "components/baseComponents/BrickTitle";
import routes from "../routes";
import previewRoutes from "components/playPreview/routes";
import HoveredImage from "../baseComponents/HoveredImage";
import { getUniqueComponent } from "components/build/questionService/QuestionService";
import CategoriseAnswersDialog from "components/baseComponents/dialogs/CategoriesAnswers";
import { ReduxCombinedState } from "redux/reducers";
import { connect } from "react-redux";
import MusicWrapper from "components/baseComponents/Music";

interface LivePageProps {
  status: PlayStatus;
  attempts: ComponentAttempt<any>[];
  brick: Brick;
  questions: Question[];
  isPlayPreview?: boolean;
  history: any;
  previewQuestionIndex?: number;
  updateAttempts(attempt: any, index: number): any;
  finishBrick(): Promise<void>;

  // things related to count down
  endTime: any;
  setEndTime(time: Moment): void;
  moveNext?(): void;

  // only for real play
  mode?: PlayMode;

  // redux
  liveBrickId: number;
  liveStep: number;
  storeLiveStep(liveStep: number, brickId: number): void;
}

const LivePage: React.FC<LivePageProps> = ({
  status,
  questions,
  history,
  brick,
  ...props
}) => {
  let initStep = 0;
  if (props.previewQuestionIndex) {
    if (questions[props.previewQuestionIndex]) {
      initStep = props.previewQuestionIndex;
    }
  }

  const [timerHidden, hideTimer] = React.useState(false);

  const [activeStep, setActiveStep] = React.useState(initStep);
  const [prevStep, setPrevStep] = React.useState(initStep);
  const [isShuffleOpen, setShuffleDialog] = React.useState(false);
  const [isTimeover, setTimeover] = React.useState(false);
  const [isSubmitOpen, setSubmitAnswers] = React.useState(false);
  const [isCategorizeOpen, setCategorizeDialog] = React.useState(false);
  const [questionScrollRef] = React.useState(React.createRef<HTMLDivElement>());

  const [answers, setAnswers] = React.useState([] as any[]);

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
      const nextStep = parseInt(values.activeStep as string);
      props.storeLiveStep(nextStep, brick.id);
      setActiveStep(nextStep);
    } else if (props.liveStep >= 0 && props.liveBrickId === brick.id) {
      setActiveStep(props.liveStep);
    }
    /*eslint-disable-next-line*/
  }, [location.search]);

  const moveToProvisional = () => {
    let playPath = getPlayPath(props.isPlayPreview, brick.id);
    if (props.isPlayPreview) {
      history.push(`${playPath}/provisionalScore`);
    } else {
      history.push(routes.playProvisionalScore(brick));
    }
    props.moveNext && props.moveNext();
  };

  if (status > PlayStatus.Live) {
    moveToProvisional();
    return <div></div>;
  }

  let questionRefs: React.RefObject<QuestionLive>[] = [];
  questions.forEach(() => questionRefs.push(React.createRef()));

  const handleStep = (step: number) => () => {
    setActiveAnswer();
    setTimeout(() => {
      setPrevStep(activeStep);
      setActiveStep(step);
      if (props.isPlayPreview) {
        CashQuestionFromPlay(brick.id, step);
      } else {
        history.push(
          routes.playInvestigation(brick) + "?activeStep=" + step
        );
      }
    }, 100);
  };

  const setCurrentAnswerAttempt = () => {
    let attempt = questionRefs[activeStep].current?.getAttempt(false);
    if (attempt) {
      props.updateAttempts(attempt, activeStep);
    }
  };

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

    // phone scroll to top
    if (isPhone()) {
      const { current } = questionScrollRef;
      if (current) {
        current.scrollTo({ top: 0 });
      }
    }
  };

  const nextFromShuffle = async () => {
    setShuffleDialog(false);
    onQuestionAttempted(activeStep);

    handleStep(activeStep + 1)();
    if (activeStep >= questions.length - 1) {
      questions.forEach((question) => (question.edited = false));
      await props.finishBrick();
      moveToProvisional();
    }
  };

  const nextFromCategorize = async () => {
    setCategorizeDialog(false);
    onQuestionAttempted(activeStep);

    handleStep(activeStep + 1)();
    if (activeStep >= questions.length - 1) {
      questions.forEach((question) => (question.edited = false));
      await props.finishBrick();
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

    // if there is unsorted answers show popup
    if (question.type === QuestionTypeEnum.Sort) {
      const attempt = questionRefs[activeStep].current?.getAttempt(false);
      if (attempt && attempt.answer) {
        for (let choice in attempt.answer) {
          const catNums = getUniqueComponent(question).categories.length;
          if (attempt.answer[choice] === catNums) {
            setCategorizeDialog(true);
            return;
          }
        }
      }
    }

    if (
      question.type === QuestionTypeEnum.PairMatch ||
      question.type === QuestionTypeEnum.HorizontalShuffle ||
      question.type === QuestionTypeEnum.VerticalShuffle
    ) {
      const attempt = questionRefs[activeStep].current?.getAttempt(false);
      if (!attempt.dragged) {
        setShuffleDialog(true);
        return;
      }
    }
    handleStep(activeStep + 1)();
    scrollToStep(activeStep + 2);

    // phone scroll to top
    if (isPhone()) {
      const { current } = questionScrollRef;
      if (current) {
        current.scrollTo({ top: 0 });
      }
    }

    if (activeStep >= questions.length - 1) {
      setSubmitAnswers(true);
    }
  };

  const onEnd = () => {
    setTimeover(true);
    if (!props.isPlayPreview) {
      moveNext();
    }
  };

  const moveNext = async () => {
    handleStep(activeStep + 1)();
    questions.forEach((question) => (question.edited = false));
    await props.finishBrick();
    moveToProvisional();
  };

  const submitAndMove = async () => {
    setActiveAnswer();
    questions.forEach((question) => (question.edited = false));
    await props.finishBrick();
    moveToProvisional();
  };

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
        <div className="question-live-play dd-live-container review-content">
          <div>
            {renderQuestion(question, index)}
          </div>
        </div>
      </TabPanel>
    );
  };

  const moveToPrep = () => {
    let attempt = questionRefs[activeStep].current?.getRewritedAttempt(false);
    props.updateAttempts(attempt, activeStep);
    let link = "";
    if (isPhone()) {
      link = routes.phonePrep(brick);
    } else {
      if (props.isPlayPreview) {
        link = previewRoutes.previewNewPrep(brick.id);
      } else {
        link = routes.playNewPrep(brick);
      }
    }
    history.push(
      link + `?prepExtanded=true&resume=true&activeStep=${activeStep}`
    );
  };

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
  };

  const renderMobileButtons = () => {
    return (
      <div className="action-footer mobile-footer-fixed-buttons">
        <SpriteIcon
          name="arrow-left"
          className="mobile-back-button"
          onClick={prev}
        />
        <SpriteIcon
          name="arrow-right"
          className="mobile-next-button"
          onClick={() => {
            if (questions.length - 1 > activeStep) {
              next();
            } else {
              setSubmitAnswers(true);
            }
          }}
        />
      </div>
    );
  };

  const minutes = getLiveTime(brick.brickLength);

  const renderDialogs = () => {
    return (
      <div>
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
        <CategoriseAnswersDialog
          isOpen={isCategorizeOpen}
          submit={nextFromCategorize}
          close={() => setCategorizeDialog(false)}
        />
      </div>
    );
  };

  if (isPhone()) {
    return (
      <div className="brick-row-container live-container">
        <HoveredImage />
        <div className="brick-container play-preview-panel live-page real-live-page">
          <div className="introduction-page">
            <div className="intro-text-row">
              <div className="phone-stepper-head">
                <BrickTitle title={brick.title} />
              </div>
              {renderStepper()}
            </div>
            <div className="introduction-content" ref={questionScrollRef}>
              {questions.map(renderQuestionContainer)}
              {renderMobileButtons()}
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
          </div>
        </div>
        {renderDialogs()}
      </div>
    );
  }

  const renderPrepButton = () => {
    return (
      <div>
        <div className="absolute-prep-text">
          Click here to
          go back to
          Prep tasks
        </div>
        <div className="prep-button" onClick={() => {
          if (props.isPlayPreview) {
            history.push(previewRoutes.previewNewPrep(brick.id) + '?resume=true');
          } else {
            history.push(routes.playNewPrep(brick) + '?resume=true');
          }
        }}>
          <svg className="highlight-circle dashed-circle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">
            <g id="Ellipse_72" data-name="Ellipse 72" fill="none" stroke="inherit" strokeLinecap="round" strokeWidth="3" strokeDasharray="8 8">
              <circle cx="36" cy="36" r="36" stroke="none" />
              <circle cx="36" cy="36" r="34.5" fill="none" />
            </g>
          </svg>
          <SpriteIcon name="file-text" />
        </div>
      </div>
    );
  }

  return (
    <div className="brick-row-container live-container real-live-container">
      {renderPrepButton()}
      <div className="fixed-upper-b-title">
        <BrickTitle title={brick.title} />
      </div>
      <HoveredImage />
      <div className="brick-container play-preview-panel live-page real-live-page">
        <div className="introduction-page">
          <div className="introduction-info">
            <div className="intro-text-row">
              {renderStepper()}
            </div>
          </div>
          {renderQuestionContainer(questions[activeStep], activeStep)}
          <div className="new-layout-footer" style={{ display: "none" }}>
            <div className="time-container">
              {!timerHidden &&
                <TimeProgressbar
                  isLive={true}
                  onEnd={onEnd}
                  minutes={minutes}
                  endTime={props.endTime}
                  brickLength={brick.brickLength}
                  setEndTime={props.setEndTime}
                />}
            </div>
            <div className="footer-space">
              {!isMobile &&
                <div className="btn toggle-timer" onClick={() => hideTimer(!timerHidden)}>
                  {timerHidden ? 'Show Timer' : 'Hide Timer'}
                </div>}
            </div>
            <div className="new-navigation-buttons">
            <MusicWrapper startTime={0.15} url="/sounds/mixkit-camera-shutter-click.wav">
              <div className="n-btn back" onClick={prev}>
                <SpriteIcon name="arrow-left" />
                Back
              </div>
              </MusicWrapper>
              <MusicWrapper startTime={0.15} url="/sounds/mixkit-camera-shutter-click.wav">
                <div
                  className="n-btn next"
                  onClick={() => {
                    if (questions.length - 1 > activeStep) {
                      next();
                    } else {
                      setSubmitAnswers(true);
                    }
                  }}
                >
                  Next
                  <SpriteIcon name="arrow-right" />
                </div>
              </MusicWrapper>
            </div>
          </div>
        </div>
      </div>
      {renderDialogs()}
    </div>
  );
};

const mapState = (state: ReduxCombinedState) => ({
  liveBrickId: state.play.brickId,
  liveStep: state.play.liveStep,
});

const mapDispatch = (dispatch: any) => ({
  storeLiveStep: (liveStep: number, brickId: number) => dispatch(actions.storeLiveStep(liveStep, brickId)),
});

export default connect(mapState, mapDispatch)(LivePage);
