import React, { useEffect } from "react";
import { Grid, Hidden } from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@material-ui/core/styles";
import update from "immutability-helper";
import { useHistory, useLocation } from "react-router-dom";
import { Moment } from "moment";

import "./ReviewPage.scss";
import { Question } from "model/question";
import { PlayStatus } from "../model";
import { PlayMode } from "../model";
import { BrickLengthEnum } from "model/brick";
import { getPlayPath, getAssignQueryString, scrollToStep } from "../service";

import ReviewStepper from "./ReviewStepper";
import QuestionLive from "../questionPlay/QuestionPlay";
import TabPanel from "../baseComponents/QuestionTabPanel";
import CountDown from "../baseComponents/CountDown";
import PageLoader from "components/baseComponents/loaders/pageLoader";
import SubmitAnswersDialog from "components/baseComponents/dialogs/SubmitAnswers";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { leftKeyPressed, rightKeyPressed } from "components/services/key";
import MobilePrevButton from "../live/components/MobilePrevButton";
import MobileNextButton from "../live/components/MobileNextButton";

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
  const location = useLocation();
  const [activeStep, setActiveStep] = React.useState(0);
  let initAnswers: any[] = [];
  const [answers, setAnswers] = React.useState(initAnswers);
  const [isSubmitOpen, setSubmitAnswers] = React.useState(false);
  const theme = useTheme();
  let playPath = getPlayPath(props.isPlayPreview, brickId);

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
    history.push(`${playPath}/ending${getAssignQueryString(location)}`)
  }

  if (status === PlayStatus.Live) {
    history.push(`${playPath}/intro${getAssignQueryString(location)}`)
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

    if (activeStep >= questions.length - 1) {
      setSubmitAnswers(true);
    }
  };

  const onEnd = () => moveNext();

  const moveNext = () => {
    handleStep(activeStep)();
    finishBrick();
    moveToEnding();
  }

  const submitAndMove = () => {
    setActiveAnswer();
    finishBrick();
    moveToEnding();
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
    if (!attempt) {
      return "Not quite - try again!";
    }
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
        <SpriteIcon name="arrow-left" className="w80 h80 svg-default m-l-02 text-gray" />
        <SpriteIcon name="arrow-left" className="svg w80 h80 colored m-l-02 text-white" />
      </button>
    );
  };

  const renderCenterText = () => {
    if (questions.length - 1 > activeStep) {
      return (
        <div className="direction-info text-center">
          <h2>Next</h2>
          <span>Don’t panic, you can<br />always come back</span>
        </div>
      );
    }
    return (
      <div className="direction-info">
        <h2 className="text-center">Submit</h2>
        <span>How do you think it went?</span>
      </div>
    );
  }

  const renderNextButton = () => {
    if (questions.length - 1 > activeStep) {
      return (
        <button type="button" className="play-preview svgOnHover play-green" onClick={next}>
          <SpriteIcon name="arrow-right" className="svg w80 h80 active m-l-02" />
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
  }

  return (
    <div className="brick-container play-preview-panel review-page">
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
            {questions.map(renderQuestionContainer)}
            <div className="action-footer">
              <div>
                <MobilePrevButton activeStep={activeStep} onClick={prev} />
              </div>
              <div className="direction-info text-center"></div>
              <div>
                <MobileNextButton questions={questions} activeStep={activeStep} onClick={next} setSubmitAnswers={setSubmitAnswers} />
              </div>
            </div>
          </Hidden>
        </Grid>
        <Grid item sm={4} xs={12}>
          <div className="introduction-info">
            <CountDown brickLength={props.brickLength} endTime={null} setEndTime={() => { }} onEnd={onEnd} />
            <div className="intro-text-row f-align-self-start m-t-5">
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
                {renderCenterText()}
                <div>{renderNextButton()}</div>
              </div>
            </Hidden>
          </div>
        </Grid>
      </Grid>
      <SubmitAnswersDialog
        isOpen={isSubmitOpen}
        submit={submitAndMove}
        close={() => setSubmitAnswers(false)}
      />
    </div>
  );
};

export default ReviewPage;
