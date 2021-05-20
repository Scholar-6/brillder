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
import { getPlayPath, scrollToStep } from "../service";

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
import { getLiveTime } from "../services/playTimes";
import BrickTitle from "components/baseComponents/BrickTitle";
import routes from "../routes";
import previewRoutes from "components/playPreview/routes";
import HoveredImage from "../baseComponents/HoveredImage";
import { getUniqueComponent } from "components/build/questionService/QuestionService";
import CategoriseAnswersDialog from "components/baseComponents/dialogs/CategoriesAnswers";

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
  const [isCategorizeOpen, setCategorizeDialog] = React.useState(false);
  const [questionScrollRef] = React.useState(React.createRef<HTMLDivElement>());

  const [answers, setAnswers] = React.useState([] as any[]);
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
    history.push(`${playPath}/provisionalScore`);
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

    // phone scroll to top
    if (isPhone()) {
      const {current} = questionScrollRef;
      if (current) {
        current.scrollTo({top: 0});
      }
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

  const nextFromCategorize = () => {
    setCategorizeDialog(false);
    onQuestionAttempted(activeStep);

    handleStep(activeStep + 1)();
    if (activeStep >= questions.length - 1) {
      questions.forEach((question) => (question.edited = false));
      props.finishBrick();
      moveToProvisional();
    }
  }

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
      const {current} = questionScrollRef;
      if (current) {
        current.scrollTo({top: 0});
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
    let link = '';
    if (isPhone()) {
      link = routes.phonePrep(brick.id);
    } else {
      if (props.isPlayPreview) {
        link = previewRoutes.previewNewPrep(brick.id);
      } else {
        link = routes.playNewPrep(brick.id);
      }
    }
    history.push(link + `?prepExtanded=true&resume=true&activeStep=${activeStep}`);
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

  const minutes = getLiveTime(brick.brickLength);


  return (
    <div className="brick-row-container live-container">
      {!isPhone() && <div className="fixed-upper-b-title">
        <BrickTitle title={brick.title} />
      </div>}
      <HoveredImage />
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
                      minutes={minutes}
                      endTime={props.endTime}
                      brickLength={brick.brickLength}
                      setEndTime={props.setEndTime}
                    />
                  </div>
                  <div className="footer-space"><span className="scroll-text">Scroll down</span></div>
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
              <div className="intro-text-row">
                <span className="phone-stepper-head">
                  <span className="bold">{brick.subject?.name}</span> <BrickTitle title={brick.title} />
                </span>
                {renderStepper()}
              </div>
            </div>
            <div className="introduction-content" ref={questionScrollRef}>
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
          <CategoriseAnswersDialog
            isOpen={isCategorizeOpen}
            submit={nextFromCategorize}
            close={() => setCategorizeDialog(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default LivePage;
