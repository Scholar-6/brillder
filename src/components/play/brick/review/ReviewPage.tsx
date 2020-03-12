import React from 'react';
import { Grid, Stepper, Step, StepButton } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@material-ui/core/styles';
import update from 'immutability-helper';
import { useHistory } from 'react-router-dom';

import './ReviewPage.scss';
import CircleIconNumber from 'components/play/components/circleIcon/circleIcon';
import { Question } from "components/model/question";
import QuestionLive from '../live/QuestionLive';
import TabPanel from '../baseComponents/QuestionTabPanel';
import { PlayStatus, ComponentAttempt } from '../model/model';

interface LivePageProps {
  status: PlayStatus;
  brickId: number;
  questions: Question[];
  attempts: any[];
  updateAttempts(attempt: any, index: number): any;
  finishBrick():void;
}

const ReviewPage: React.FC<LivePageProps> = (
  { status, questions, updateAttempts, attempts, finishBrick, brickId }
) => {
  console.log(attempts);
  const history = useHistory();
  if (status === PlayStatus.Live) {
    history.push(`/play/brick/${brickId}/intro`);
  }

  const [activeStep, setActiveStep] = React.useState(0);
  let initAnswers: any[] = [];

  const [answers, setAnswers] = React.useState(initAnswers);

  const theme = useTheme();

  let questionRefs: React.RefObject<QuestionLive>[] = [];
  questions.forEach(() => {
    questionRefs.push(React.createRef());
  });

  const handleStep = (step: number) => () => {
    questions[activeStep].edited = true;
    setActiveStep(step);
  };

  function isStepComplete(step: number) {
    return step < activeStep;
  }

  const setActiveAnswer = () => {
    const copyAnswers = Object.assign([], answers) as any[];
    copyAnswers[activeStep] = questionRefs[activeStep].current?.getAnswer();
    let attempt = questionRefs[activeStep].current?.getAttempt();
    updateAttempts(attempt, activeStep);
    setAnswers(copyAnswers);
  }

  const next = () => {
    setActiveAnswer();
    questions[activeStep].edited = true;
    setActiveStep(update(activeStep, { $set: activeStep + 1 }));
    if (activeStep >= questions.length - 1) {
      finishBrick();
      history.push(`/play/brick/${brickId}/provisionalScore`);
    }
  }

  const renderQuestion = (question: Question, attempt: ComponentAttempt, index: number) => {
    let isLastOne = (questions.length - 1) === activeStep;
    return <QuestionLive question={question} answers={answers[index]} attempt={attempt} isLastOne={isLastOne} next={next} ref={questionRefs[index]} />
  }

  return (
    <Grid container direction="row" justify="center">
      <div className="brick-container live-page">
        <Stepper alternativeLabel nonLinear activeStep={activeStep}>
          {questions.map((question, index) => {
            const stepProps: { completed?: boolean } = {};
            const buttonProps: { optional?: React.ReactNode } = {};
            if (index === activeStep) {
              return (
                <Step key={index} {...stepProps}>
                  <StepButton
                    icon={<CircleIconNumber number={index + 1} />}
                    onClick={handleStep(index)}
                    completed={isStepComplete(index)}
                    {...buttonProps}
                  >
                  </StepButton>
                </Step>
              );
            }
            if (question.edited) {
              return (
                <Step key={index} {...stepProps}>
                  <StepButton
                    icon={<CreateIcon className="edited-step-icon" />}
                    onClick={handleStep(index)}
                    completed={isStepComplete(index)}
                    {...buttonProps}
                  >
                  </StepButton>
                </Step>
              );
            }
            return (
              <Step key={index} {...stepProps}>
                <StepButton
                  icon={<CircleIconNumber customClass="grey-icon" number={index + 1} />}
                  onClick={handleStep(index)}
                  completed={isStepComplete(index)}
                  {...buttonProps}
                >
                </StepButton>
              </Step>
            );
          })}
        </Stepper>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={activeStep}
          onChangeIndex={handleStep}
        >
          {
            questions.map((question, index) =>
              <TabPanel key={index} index={index} value={activeStep} dir={theme.direction}>
                {renderQuestion(question, attempts[index], index)}
              </TabPanel>
            )
          }
        </SwipeableViews>
      </div>
    </Grid>
  );
}

export default ReviewPage;
