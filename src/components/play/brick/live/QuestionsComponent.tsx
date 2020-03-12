import React, { useEffect } from 'react';
import { Grid, Stepper, Step, StepButton } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import SwipeableViews from 'react-swipeable-views';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { useTheme } from '@material-ui/core/styles';
import update from 'immutability-helper';

import './QuestionsComponent.scss';
import { Brick } from 'model/brick';
import CircleIconNumber from 'components/play/components/circleIcon/circleIcon';
import { Question, QuestionTypeEnum, QuestionComponentTypeEnum } from "components/model/question";
import QuestionLive from './QuestionLive';
import { useHistory } from 'react-router-dom';


function shuffle(a: any[]) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface QuestionsComponentProps {
  brickId: number;
  questions: Question[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

const QuestionsComponent: React.FC<QuestionsComponentProps> = ({ questions, brickId }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  let initAnswers: any[] = [];

  const [answers, setAnswers] = React.useState(initAnswers);
  const history = useHistory();

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
    console.log(copyAnswers);
    setAnswers(copyAnswers);
  }

  const next = () => {
    setActiveAnswer();
    questions[activeStep].edited = true;
    setActiveStep(update(activeStep, { $set: activeStep + 1 }));
    if (activeStep >= questions.length - 1) {
      history.push(`/play/brick/${brickId}/provisionalScore`);
    }
  }

  const renderQuestion = (question: Question, index: number) => {
    let isLastOne = (questions.length - 1) === activeStep;
    return <QuestionLive question={question} answers={answers[index]} isLastOne={isLastOne} next={next} ref={questionRefs[index]} />
  }

  return (
    <Grid container direction="row" justify="center">
      <div className="brick-container">
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
                {renderQuestion(question, index)}
              </TabPanel>
            )
          }
        </SwipeableViews>
      </div>
    </Grid>
  );
}

export default QuestionsComponent;
