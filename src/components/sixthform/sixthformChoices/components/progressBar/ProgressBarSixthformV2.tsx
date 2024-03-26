import React from 'react';
import './ProgressBarSixthform.scss';
import { Pages } from '../../SixthformChoices';

interface Props {
  step: Pages;
  moveToStep(step: number): void;
}

const ProgressBarSixthformV2: React.FC<Props> = (props) => {
  const {step} = props;
  let renderStep = (stepNum: number, isActive: boolean, isCompleted: boolean) => {
    return <div className={`step-s6 bold font-13 ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`} onClick={() => {
      // move to step
      if (isCompleted || isActive) {
        props.moveToStep(stepNum);
      }
    }}>{stepNum}</div>
  }

  let renderLine = (isActive: boolean) => {
    return <div className={`line-r23 ${isActive ? 'active' : ''}`} />
  }
  return (
    <div className="progress-bar-sixthform">
      <div>
        {renderStep(1, step === Pages.Question1, step >= 1)}
        <div className="font-12 progress-label-s6">COLLEGES</div>
      </div>
      {renderLine(step >= 2)}
      <div>
        {renderStep(2, step === Pages.Question2, step >= 2)}
        <div className="font-12 progress-label-s6">SUBJECTS</div>
      </div>
      {renderLine(step >= 3)}
      <div>
        {renderStep(3, step === Pages.Question3, step >= 3)}
        <div className="font-12 progress-label-s6">EXTRACURRICULARS</div>
      </div>
      {renderLine(step >= 4)}
      <div>
        {renderStep(4, step === Pages.Question4, step >= 4)}
        <div className="font-12 progress-label-s6">HIGHER EDUCATION</div>
      </div>
      {renderLine(step >= 5)}
      <div>
        {renderStep(5, step === Pages.Question5, step >= 5)}
        <div className="font-12 progress-label-s6">CAREERS</div>
      </div>
      {renderLine(step >= 6)}
      <div>
        {renderStep(6, step === Pages.Question6, false)}
        <div className="font-12 progress-label-s6">DREAMS</div>
      </div>
    </div>
  );
}


export default ProgressBarSixthformV2;
