import React, { useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";
import update from "immutability-helper";
import { Moment } from "moment";

import "./ReviewPage.scss";
import { Question } from "model/question";
import { PlayStatus } from "../model";
import { PlayMode } from "../model";
import { Brick } from "model/brick";
import { getPlayPath, scrollToStep } from "../service";

import ReviewStepper from "./ReviewStepper";
import QuestionLive from "../questionPlay/QuestionPlay";
import TabPanel from "../baseComponents/QuestionTabPanel";
import PageLoader from "components/baseComponents/loaders/pageLoader";
import SubmitAnswersDialog from "components/baseComponents/dialogs/SubmitAnswers";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { leftKeyPressed, rightKeyPressed } from "components/services/key";
import TimeProgressbar from "../baseComponents/timeProgressbar/TimeProgressbar";
import { isPhone } from "services/phone";
import { getReviewTime } from "../services/playTimes";
import BrickTitle from "components/baseComponents/BrickTitle";
import routes from "../routes";
import previewRoutes from "components/playPreview/routes";
import HoveredImage from "../baseComponents/HoveredImage";
import { isMobile } from "react-device-detect";
import { CashQuestionFromPlay } from "localStorage/buildLocalStorage";
import MusicWrapper from "components/baseComponents/MusicWrapper";

interface ReviewPageProps {
  status: PlayStatus;
  brick: Brick;
  history: any;
  liveAttempts: any[];
  attempts: any[];
  isPlayPreview?: boolean;
  updateAttempts(attempt: any, index: number): any;
  finishBrick(): void;

  // things related to count down
  endTime: any;
  setEndTime(time: Moment): void;

  // only for real play
  mode?: PlayMode;
}

const ReviewPage: React.FC<ReviewPageProps> = ({
  status,
  updateAttempts,
  attempts,
  history,
  brick,
  finishBrick,
  ...props
}) => {
  const { questions } = brick;
  const [activeStep, setActiveStep] = React.useState(0);
  let initAnswers: any[] = [];
  const [answers, setAnswers] = React.useState(initAnswers);
  const [isSubmitOpen, setSubmitAnswers] = React.useState(false);
  const [questionScrollRef] = React.useState(React.createRef<HTMLDivElement>());
  const [timerHidden, hideTimer] = React.useState(false);

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

  const moveToEnding = () => {
    if (props.isPlayPreview) {
      const playPath = getPlayPath(props.isPlayPreview, brick.id);
      history.push(`${playPath}/ending`);
    } else {
      history.push(routes.playEnding(brick));
    }
  };

  if (status === PlayStatus.Live) {
    if (isPhone()) {
      history.push(routes.phonePrep(brick));
    } else {
      if (props.isPlayPreview) {
        history.push(previewRoutes.previewNewPrep(brick.id));
      } else {
        history.push(routes.playNewPrep(brick));
      }
    }
    return <PageLoader content="...Loading..." />;
  } else if (status === PlayStatus.Ending) {
    moveToEnding();
    return <PageLoader content="...Loading..." />;
  }

  let questionRefs: React.RefObject<QuestionLive>[] = [];
  questions.forEach(() => questionRefs.push(React.createRef()));

  const handleStep = (step: number) => () => {
    const copyAnswers = Object.assign([], answers) as any[];
    copyAnswers[activeStep] = questionRefs[activeStep].current?.getAnswer();
    let attempt = questionRefs[activeStep].current?.getAttempt(true);
    if (attempts[activeStep] && attempts[activeStep].liveCorrect) {
      attempt.liveCorrect = true;
    }
    if (props.isPlayPreview) {
      CashQuestionFromPlay(brick.id, step);
    }
    updateAttempts(attempt, activeStep);
    setAnswers(copyAnswers);
    setActiveStep(step);
  };

  const setActiveAnswer = () => {
    const copyAnswers = Object.assign([], answers) as any[];
    copyAnswers[activeStep] = questionRefs[activeStep].current?.getAnswer();
    let attempt = questionRefs[activeStep].current?.getAttempt(true);
    updateAttempts(attempt, activeStep);
    setAnswers(copyAnswers);
  };

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

  const prev = () => {
    if (activeStep === 0) {
      return;
    }

    // phone scroll to top
    if (isPhone()) {
      const { current } = questionScrollRef;
      if (current) {
        current.scrollTo({ top: 0 });
      }
    }

    setActiveAnswer();
    questions[activeStep].edited = true;
    setActiveStep(update(activeStep, { $set: activeStep - 1 }));
    scrollToStep(activeStep);
  };

  const next = () => {
    setActiveAnswer();
    questions[activeStep].edited = true;
    setActiveStep(update(activeStep, { $set: activeStep + 1 }));
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
    if (!props.isPlayPreview) {
      moveNext();
    }
  };

  const moveNext = () => {
    handleStep(activeStep)();
    finishBrick();
    moveToEnding();
  };

  const submitAndMove = () => {
    setActiveAnswer();
    finishBrick();
    moveToEnding();
  };

  const renderQuestion = (question: Question, index: number) => {
    return (
      <QuestionLive
        mode={props.mode}
        liveAttempt={props.liveAttempts[index]}
        attempt={attempts[index]}
        question={question}
        answers={answers[index]}
        ref={questionRefs[index]}
        isReview={true}
      />
    );
  };

  const renderReviewTitle = (attempt: any) => {
    let text = "Incorrect - try again!";
    if (attempt.correct) {
      text = "Correct!";
    } else if (attempt.marks > 0) {
      text = "Not quite - try again!";
    }
    if (attempt.correct) {
      return (
        <div className="ge-phone-title">
          <div className="ge-phone-circle b-green">
            <SpriteIcon name="check-icon" />
          </div>
          <div>{text}</div>
        </div>
      );
    }
    return (
      <div className="ge-phone-title">
        <div className={`ge-phone-circle ${attempt.marks > 0 ? 'b-yellow' : 'b-red'}`}>
          <SpriteIcon name="cancel-custom" />
        </div>
        <div>{text}</div>
      </div>
    );
  };

  const renderQuestionContainer = (question: Question, index: number) => {
    const attempt = props.liveAttempts[index];
    return (
      <TabPanel
        key={index}
        index={index}
        value={activeStep}
        dir={theme.direction}
      >
        <div className="question-live-play dd-live-container review-content">
          <div className="question-title">
            {renderReviewTitle(attempt)}
            <div className="marks-container">
              <div>Marks</div>
              <div>{attempt.marks}/{attempt.maxMarks}</div>
            </div>
          </div>
          {renderQuestion(question, index)}
        </div>
      </TabPanel>
    );
  };

  const renderPhoneButtons = () => {
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

  const minutes = getReviewTime(brick.brickLength);

  if (isPhone()) {
    return (
      <div className="brick-row-container review-container">
        <HoveredImage />
        <div className="brick-container play-preview-panel review-page">
          <div className="introduction-page">
            <div className="intro-header">
              <div className="intro-text-row">
                <span className="phone-stepper-head">
                  <BrickTitle title={brick.title} />
                </span>
                <ReviewStepper
                  questions={questions}
                  attempts={props.liveAttempts}
                  activeStep={activeStep}
                  handleStep={handleStep}
                />
              </div>
            </div>
            <div className="introduction-content" ref={questionScrollRef}>
              {questions.map(renderQuestionContainer)}
              {renderPhoneButtons()}
              <div className="time-container">
                <TimeProgressbar
                  onEnd={onEnd}
                  endTime={props.endTime}
                  brickLength={brick.brickLength}
                  setEndTime={(a) => {
                    console.log("set end 3");
                    console.log(props.setEndTime);
                    props.setEndTime(a);
                  }}
                />
              </div>
            </div>
            <SubmitAnswersDialog
              isOpen={isSubmitOpen}
              submit={submitAndMove}
              close={() => setSubmitAnswers(false)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="brick-row-container review-container">
      <div className="fixed-upper-b-title">
        <BrickTitle title={brick.title} />
      </div>
      <HoveredImage />
      <div className="brick-container play-preview-panel review-page">
        {renderPrepButton()}
        <div className="introduction-page">
          <div className="introduction-info">
            <div className="intro-text-row">
              <ReviewStepper
                questions={questions}
                attempts={props.liveAttempts}
                activeStep={activeStep}
                handleStep={handleStep}
              />
            </div>
          </div>
          {questions.map(renderQuestionContainer)}
          <div className="new-layout-footer" style={{ display: "none" }}>
            <div className="time-container">
              {!timerHidden &&
                <TimeProgressbar
                  onEnd={onEnd}
                  minutes={minutes}
                  endTime={props.endTime}
                  brickLength={brick.brickLength}
                  setEndTime={(a) => {
                    console.log("set end 6");
                    props.setEndTime(a);
                  }}
                />}
            </div>
            <div className="footer-space">
              {!isMobile &&
                <div className="btn toggle-timer" onClick={() => hideTimer(!timerHidden)}>
                  {timerHidden ? 'Show Timer' : 'Hide Timer'}
                </div>}
            </div>
            <div className="new-navigation-buttons">
              <div className="n-btn back" onClick={prev}>
                <SpriteIcon name="arrow-left" />
                Back
              </div>
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
            </div>
          </div>
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

export default ReviewPage;
