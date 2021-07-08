import React, { useEffect } from "react";
import { Grid } from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
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

interface ReviewPageProps {
  status: PlayStatus;
  brick: Brick;
  history: any;
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

  const theme = useTheme();
  let playPath = getPlayPath(props.isPlayPreview, brick.id);

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
    history.push(`${playPath}/ending`);
  };

  if (status === PlayStatus.Live) {
    if (isPhone()) {
      history.push(routes.phonePrep(brick.id));
    } else {
      if (props.isPlayPreview) {
        history.push(previewRoutes.previewNewPrep(brick.id));
      } else {
        history.push(routes.playNewPrep(brick.id));
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
        attempt={attempts[index]}
        question={question}
        answers={answers[index]}
        ref={questionRefs[index]}
        isReview={true}
      />
    );
  };

  const renderReviewTitle = (attempt: any) => {
    let text = "Not quite - try again!";
    if (attempt.correct) {
      text = "Correct!";
    }
    if (isPhone()) {
      if (attempt.correct) {
        return (
          <div className="ge-phone-title">
            <div className="ge-phone-circle b-green">
              <SpriteIcon name="check" />
            </div>
            <div>{text}</div>
          </div>
        );
      }
      return (
        <div className="ge-phone-title">
          <div className="ge-phone-circle b-red">
            <SpriteIcon name="cancel-custom" />
          </div>
          <div>{text}</div>
        </div>
      );
    }
    return text;
  };

  const renderQuestionContainer = (question: Question, index: number) => {
    let indexClassName = "question-index-container";
    const attempt = attempts[index];
    if (attempt && attempt.correct) {
      indexClassName += " correct";
    } else {
      indexClassName += " wrong";
    }

    console.log(JSON.stringify(attempt));

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
        <div className="question-live-play review-content">
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

  const renderPrevButton = () => {
    if (activeStep === 0) {
      return "";
    }
    return (
      <button className="play-preview svgOnHover play-white" onClick={prev}>
        <SpriteIcon
          name="arrow-left"
          className="w80 h80 svg-default m-l-02 text-gray"
        />
        <SpriteIcon
          name="arrow-left"
          className="svg w80 h80 colored m-l-02 text-white"
        />
      </button>
    );
  };

  const renderCenterText = () => {
    if (questions.length - 1 > activeStep) {
      return (
        <div className="direction-info text-center">
          <h2>Next</h2>
          <span>
            Don’t panic, you can
            <br />
            always come back
          </span>
        </div>
      );
    }
    return (
      <div className="direction-info">
        <h2 className="text-center">Submit</h2>
        <span>How do you think it went?</span>
      </div>
    );
  };

  const renderNextButton = () => {
    if (questions.length - 1 > activeStep) {
      return (
        <button
          type="button"
          className="play-preview svgOnHover play-green"
          onClick={next}
        >
          <SpriteIcon
            name="arrow-right"
            className="svg w80 h80 active m-l-02"
          />
        </button>
      );
    }
    return (
      <button
        type="button"
        className="play-preview svgOnHover play-green"
        onClick={() => setSubmitAnswers(true)}
      >
        <SpriteIcon name="check-icon-thin" className="svg w80 h80 active" />
      </button>
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
                  attempts={attempts}
                  activeStep={activeStep}
                  handleStep={handleStep}
                />
              </div>
            </div>
            <div className="introduction-info"></div>
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
        <div className="introduction-page">
          <Grid container direction="row">
            <Grid item sm={8} xs={12}>
              <SwipeableViews
                axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                index={activeStep}
                className="swipe-view"
                onChangeIndex={handleStep}
              >
                {questions.map(renderQuestionContainer)}
              </SwipeableViews>
              <div className="new-layout-footer" style={{ display: "none" }}>
                <div className="time-container">
                  <TimeProgressbar
                    onEnd={onEnd}
                    minutes={minutes}
                    endTime={props.endTime}
                    brickLength={brick.brickLength}
                    setEndTime={(a) => {
                      console.log("set end 6");
                      props.setEndTime(a);
                    }}
                  />
                </div>
                <div className="footer-space">
                  <span className="scroll-text">Scroll down</span>
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
            </Grid>
            <Grid item sm={4} xs={12}>
              <div className="introduction-info">
                <div className="intro-text-row f-align-self-start m-t-5">
                  <ReviewStepper
                    questions={questions}
                    attempts={attempts}
                    activeStep={activeStep}
                    handleStep={handleStep}
                  />
                </div>
                <div className="action-footer">
                  <div>{renderPrevButton()}</div>
                  {renderCenterText()}
                  <div>{renderNextButton()}</div>
                </div>
              </div>
            </Grid>
          </Grid>
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
