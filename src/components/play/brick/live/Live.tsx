import React from 'react';
import { Grid, Stepper, Step, StepButton } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@material-ui/core/styles';
import update from 'immutability-helper';
import { useHistory, Redirect } from 'react-router-dom';

import './Live.scss';
import CircleIconNumber from 'components/play/components/circleIcon/circleIcon';
import { Question } from 'model/question';
import QuestionLive from '../questionPlay/QuestionPlay';
import TabPanel from '../baseComponents/QuestionTabPanel';
import { PlayStatus } from '../model/model';

import {CashQuestionFromPlay} from '../../../localStorage/buildLocalStorage';


interface LivePageProps {
  status: PlayStatus;
  brickId: number;
  questions: Question[];
  isPlayPreview?: boolean;
  previewQuestionIndex?: number;
  updateAttempts(attempt: any, index: number): any;
  finishBrick():void;
}

const LivePage: React.FC<LivePageProps> = ({ status, questions, brickId, ...props }) => {
  const [activeStep, setActiveStep] = React.useState(props.previewQuestionIndex ? props.previewQuestionIndex : 0);
  let initAnswers: any[] = [];

  const [answers, setAnswers] = React.useState(initAnswers);
  const history = useHistory();

  const theme = useTheme();

  if (status > PlayStatus.Live) {
    if (props.isPlayPreview) {
      return <Redirect to={`/play-preview/brick/${brickId}/provisionalScore`} />;
    } else {
      return <Redirect to={`/play/brick/${brickId}/provisionalScore`} />;
    }
  }

  let questionRefs: React.RefObject<QuestionLive>[] = [];
  questions.forEach(() => {
    questionRefs.push(React.createRef());
  });

  const handleStep = (step: number) => () => {
    questions[activeStep].edited = true;
    setActiveStep(step);
    if (props.isPlayPreview) {
      CashQuestionFromPlay(brickId, step);
    }
  };

  function isStepComplete(step: number) {
    return step < activeStep;
  }

  const setActiveAnswer = () => {
    const copyAnswers = Object.assign([], answers) as any[];
    copyAnswers[activeStep] = questionRefs[activeStep].current?.getAnswer();
    let attempt = questionRefs[activeStep].current?.getAttempt();
    props.updateAttempts(attempt, activeStep);
    setAnswers(copyAnswers);
  }

  const next = () => {
    setActiveAnswer();
    questions[activeStep].edited = true;
    let newStep = activeStep + 1;
    setActiveStep(update(activeStep, { $set: newStep }));

    if (props.isPlayPreview) {
      CashQuestionFromPlay(brickId, newStep);
    }

    if (activeStep >= questions.length - 1) {
      questions.forEach(question => {
        question.edited = false;
      });
      props.finishBrick();
      if (props.isPlayPreview) {
        history.push(`/play-preview/brick/${brickId}/provisionalScore`);
      } else {
        history.push(`/play/brick/${brickId}/provisionalScore`);
      }
    }
  }

  const renderQuestion = (question: Question, index: number) => {
    let isLastOne = (questions.length - 1) === activeStep;
    return <QuestionLive question={question} answers={answers[index]} isLastOne={isLastOne} next={next} ref={questionRefs[index]} />
  }

  return (
    <Grid container direction='row' justify='center'>
      <div className='brick-container live-page'>
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
                    icon={<CreateIcon className='edited-step-icon' />}
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
                  icon={<CircleIconNumber customClass='grey-icon ' number={index + 1} />}
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
                {renderQuestion(question, index)}
              </TabPanel>
            )
          }
        </SwipeableViews>
      </div>
    </Grid>
  );
}

export default LivePage;
