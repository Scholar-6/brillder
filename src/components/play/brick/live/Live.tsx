import React from 'react';
import { Grid } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@material-ui/core/styles';
import update from 'immutability-helper';
import { useHistory, Redirect } from 'react-router-dom';

import './Live.scss';
import { Question } from 'model/question';
import QuestionLive from '../questionPlay/QuestionPlay';
import TabPanel from '../baseComponents/QuestionTabPanel';
import { PlayStatus } from '../model/model';
import BrickCounter from "../baseComponents/BrickCounter";

import {CashQuestionFromPlay} from '../../../localStorage/buildLocalStorage';
import { Moment } from 'moment';
import { Brick } from 'model/brick';


interface LivePageProps {
  status: PlayStatus;
  brick: Brick;
  startTime?: Moment;
  questions: Question[];
  isPlayPreview?: boolean;
  previewQuestionIndex?: number;
  updateAttempts(attempt: any, index: number): any;
  finishBrick():void;
}

const LivePage: React.FC<LivePageProps> = ({ status, questions, brick, ...props }) => {
  let initStep = 0;
  if (props.previewQuestionIndex) {
    if (questions[props.previewQuestionIndex]) {
      initStep = props.previewQuestionIndex;
    }
  }

  const [activeStep, setActiveStep] = React.useState(initStep);
  let initAnswers: any[] = [];

  const [answers, setAnswers] = React.useState(initAnswers);
  const history = useHistory();

  const theme = useTheme();

  if (status > PlayStatus.Live) {
    if (props.isPlayPreview) {
      return <Redirect to={`/play-preview/brick/${brick.id}/provisionalScore`} />;
    } else {
      return <Redirect to={`/play/brick/${brick.id}/provisionalScore`} />;
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
      CashQuestionFromPlay(brick.id, step);
    } else {
      let attempt = questionRefs[activeStep].current?.getAttempt();
      props.updateAttempts(attempt, activeStep);
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
      CashQuestionFromPlay(brick.id, newStep);
    }

    if (activeStep >= questions.length - 1) {
      questions.forEach(question => {
        question.edited = false;
      });
      props.finishBrick();
      if (props.isPlayPreview) {
        history.push(`/play-preview/brick/${brick.id}/provisionalScore`);
      } else {
        history.push(`/play/brick/${brick.id}/provisionalScore`);
      }
    }
  }

  const renderQuestion = (question: Question, index: number) => {
    let isLastOne = (questions.length - 1) === activeStep;
    return (
      <QuestionLive
        question={question}
        answers={answers[index]}
        isLastOne={isLastOne}
        next={next}
        ref={questionRefs[index]}
      />
    );
  }

  const renderStepper = () => {
    const chunk = (arr: Question[], size: number) =>
      arr.reduce((acc: any, _, i) =>
        (i % size) ? acc : [...acc, arr.slice(i, i + size)], []
    );

    let cols:Question[][] = [];
    let colWidth = 4 as any;
    if (questions.length <= 27) {
      cols = chunk(questions, 3) as Question[][];
    } else {
      cols = chunk(questions, 4) as Question[][];
      colWidth = 3 as any;
    }

    let questionIndex = 0;

    return (
      <Grid container direction="row" className="stepper">
        {
          cols.map(col => {
            return (
              <Grid xs={colWidth}>
                {
                  col.map(question => {
                    let completed= isStepComplete(questionIndex);
                    let className = "step";
                    if (completed) {
                      className += " completed";
                    }
                    questionIndex++;
                    return (
                      <div
                        className={className}
                        onClick={handleStep(questionIndex-1)}
                      >
                        {questionIndex}
                      </div>
                    )
                  })
                }
              </Grid>
            )
          })
        }
      </Grid>
    );
  }

  return (
    <Grid container direction='row' justify='center'>
      <div className='brick-container live-page'>
        <Grid container direction="row">
          <Grid item xs={8}>
            <SwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={activeStep}
              style={{width: '100%'}}
              onChangeIndex={handleStep}
            >
              {
                questions.map((question, index) =>
                  <TabPanel key={index} index={index} value={activeStep} dir={theme.direction}>
                    <div className="question-index">{index + 1}</div>
                    {renderQuestion(question, index)}
                  </TabPanel>
                )
              }
            </SwipeableViews>
          </Grid>
          <Grid item xs={4}>
            <Grid container direction="row">
              <Grid item xs={8}>
                <BrickCounter startTime={props.startTime} />
              </Grid>
              <Grid item xs={4}>
                <img
                  alt=""
                  className="clock-image"
                  src="/feathericons/svg/blue-clock.svg"
                />
                <span className="max-length">{brick.brickLength}</span>
              </Grid>
            </Grid>
            <Grid container direction="row">
              <Grid item xs={12}>
                {renderStepper()}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Grid>
  );
}

export default LivePage;
