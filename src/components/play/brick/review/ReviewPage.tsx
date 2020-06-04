import React from 'react';
import { Grid, Stepper, Step, StepButton } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@material-ui/core/styles';
import update from 'immutability-helper';
import { useHistory } from 'react-router-dom';

import './ReviewPage.scss';
import GreenTickIcon from 'components/play/components/GreenTickIcon';
import BlueCrossIcon from 'components/play/components/BlueCrossIcon';
import { Question } from 'model/question';
import QuestionLive from '../questionPlay/QuestionPlay';
import TabPanel from '../baseComponents/QuestionTabPanel';
import { PlayStatus, ComponentAttempt } from '../model/model';

interface ReviewPageProps {
  status: PlayStatus;
  brickId: number;
  questions: Question[];
  attempts: any[];
  isPlayPreview?: boolean;
  updateAttempts(attempt: any, index: number): any;
  finishBrick():void;
}

const ReviewPage: React.FC<ReviewPageProps> = (
  { status, questions, updateAttempts, attempts, finishBrick, brickId, ...props }
) => {
  const history = useHistory();
  const [activeStep, setActiveStep] = React.useState(0);
  let initAnswers: any[] = [];
  const [answers, setAnswers] = React.useState(initAnswers);
  const theme = useTheme();

  if (status === PlayStatus.Live) {
    if (props.isPlayPreview) {
      history.push(`/play-preview/brick/${brickId}/intro`);
    } else {
      history.push(`/play/brick/${brickId}/intro`);
    }
    return <div>...Loading...</div>
  } else if (status === PlayStatus.Ending) {
    if (props.isPlayPreview) {
      history.push(`/play-preview/brick/${brickId}/ending`);
    } else {
      history.push(`/play/brick/${brickId}/ending`);
    }
    return <div>...Loading...</div>
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
      if (props.isPlayPreview) {
        history.push(`/play-preview/brick/${brickId}/ending`);
      } else {
        history.push(`/play/brick/${brickId}/ending`);
      }
    }
  }

  const renderQuestion = (question: Question, attempt: ComponentAttempt, index: number) => {
    let isLastOne = (questions.length - 1) === activeStep;
    return <QuestionLive
      next={next}
      attempt={attempt}
      question={question}
      isLastOne={isLastOne}
      answers={answers[index]}
      ref={questionRefs[index]} />
  }

  return (
    <Grid container direction='row' justify='center'>
      <div className='brick-container review-page live-page'>
        <Stepper alternativeLabel nonLinear activeStep={activeStep}>
          {questions.map((question, index) => {
            const stepProps: { completed?: boolean } = {};
            const buttonProps: { optional?: React.ReactNode } = {};
            if (index === activeStep) {
              if (attempts[index].correct === true) {
                return (
                  <Step key={index} {...stepProps}>
                    <StepButton
                      icon={<GreenTickIcon />}
                      onClick={handleStep(index)}
                      completed={isStepComplete(index)}
                      {...buttonProps}
                    >
                    </StepButton>
                  </Step>
                );
              } else {
                return (
                  <Step key={index} {...stepProps}>
                    <StepButton
                      icon={<BlueCrossIcon />}
                      onClick={handleStep(index)}
                      completed={isStepComplete(index)}
                      {...buttonProps}
                    >
                    </StepButton>
                  </Step>
                );
              }
            }
            if (question.edited) {
              return (
                <Step key={index} {...stepProps}>
                  <StepButton
                    icon={<CreateIcon className='edited-step-icon' />}
                    onClick={handleStep(index)}
                    completed={isStepComplete(index)}
                    {...buttonProps}
                  >
                  </StepButton>
                </Step>
              );
            }
            if (attempts[index].correct === true) {
              return (
                <Step key={index} {...stepProps}>
                  <StepButton
                    icon={<GreenTickIcon customClass='grey-icon ' />}
                    onClick={handleStep(index)}
                    completed={isStepComplete(index)}
                    {...buttonProps}
                  >
                  </StepButton>
                </Step>
              );
            } else {
              return (
                <Step key={index} {...stepProps}>
                  <StepButton
                    icon={<BlueCrossIcon customClass='grey-icon ' />}
                    onClick={handleStep(index)}
                    completed={isStepComplete(index)}
                    {...buttonProps}
                  >
                  </StepButton>
                </Step>
              );
            }
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
