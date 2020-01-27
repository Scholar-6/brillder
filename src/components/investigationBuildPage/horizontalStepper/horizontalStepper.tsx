import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import StepButton from '@material-ui/core/StepButton';

import './horizontalStepper.scss'
import ShortAnswer from './shortAnswer/shortAnswer';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    button: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  }),
);

const CustomNumberIcon = (step:any) => () => (
  <span className={"circle-round circle icon-circle-blue-" + step}></span>
);

const CustomFilledNumberIcon = (step:any) => () => (
  <span className={"circle icon-filled-circle-blue-" + step}>
    <span className="path1"></span>
      <span className="path2"></span><span className="path3"></span><span className="path4"></span>
      <span className="path5"></span><span className="path6">
    </span>
  </span>
);

function getSteps(numOfSteps:number) {
  const steps:any[] = [];
  for (let i = 0; i < numOfSteps; i++) {
    steps.push(createStep());
  }
  return steps;
}

function createStep():any {
  return {
    isClicked: false,
    isCompleted: false
  }
}

export default function HorizontalLinearStepper() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps(8);

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleStep = (step: any, index: number) => () => {
    setActiveStep(index);
    step.isClicked = true; 
  };

  return (
    <div className={classes.root}>
      <Stepper alternativeLabel  activeStep={activeStep} className="stepper">
        {steps.map((step, index) => {
          index = index + 1;
          let IconStep = null;
          if (index > activeStep + 1) {
            IconStep = CustomNumberIcon(index);
          } else {
            IconStep = CustomFilledNumberIcon(index);
          }
          return (
            <Step key={index}>
              <StepButton icon={IconStep()} onClick={handleStep(step, index - 1)} />
            </Step>
          )
        })}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you are finished
            </Typography>
          </div>
        ) : (
          <div>
            <ShortAnswer activeStep={activeStep} />
            <div>
              <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}