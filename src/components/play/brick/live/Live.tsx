import React from 'react';
import { Grid, Stepper, Step, StepButton } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import SwipeableViews from 'react-swipeable-views';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';

import './Live.scss';
import { Brick } from 'model/brick';
import CircleIconNumber from 'components/play/components/circleIcon/circleIcon';

interface IntroductionProps {
  brick: Brick;
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

const Introduction: React.FC<IntroductionProps> = ({ brick, ...props }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  let { questions } = brick;
  const theme = useTheme();

  const handleStep = (step: number) => () => {
    questions[activeStep].edited = true;
    setActiveStep(step);
  };

  function isStepComplete(step: number) {
    return step < activeStep;
  }

  return (
    <Grid container direction="row" justify="center">
      <div className="brick-container">
        <div className='introduction-page'>
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
                      icon={<CreateIcon className="edited-step-icon"/>}
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
            <TabPanel value={activeStep} index={0} dir={theme.direction}>
              Item One
            </TabPanel>
            <TabPanel value={activeStep} index={1} dir={theme.direction}>
              Item Two
            </TabPanel>
            <TabPanel value={activeStep} index={2} dir={theme.direction}>
              Item Three
            </TabPanel>
          </SwipeableViews>
        </div>
      </div>
    </Grid>
  );
}

export default Introduction;
