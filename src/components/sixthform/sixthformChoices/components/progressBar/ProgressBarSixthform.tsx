import React from 'react';
import './ProgressBarSixthform.scss';
import { Pages } from '../../SixthformChoices';
import { isPhone } from 'services/phone';

interface Props {
  step: Pages;
  exit(): void;
}

const ProgressBarSixthform: React.FC<Props> = (props) => {
  let isDesktop = !isPhone();
  const { step } = props;
  let renderStep = (stepNum: number, isActive: boolean, isCompleted: boolean) => {
    return <div className={`step-s6 bold font-13 ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>{stepNum}</div>
  }

  let renderLine = (isActive: boolean) => {
    return <div className={`line-r23 ${isActive ? 'active' : ''}`} />
  }
  return (
    <div className="progress-bar-sixthform">
      <div>
        {renderStep(1, step === Pages.Question1, step >= 2)}
        {isDesktop && <div className="font-12 progress-label-s6">COLLEGES</div>}
      </div>
      {renderLine(step >= 3)}
      <div>
        {renderStep(2, step === Pages.Question2, step >= 3)}
        {isDesktop && <div className="font-12 progress-label-s6">SUBJECTS</div>}
      </div>
      {renderLine(step >= 4)}
      <div>
        {renderStep(3, step === Pages.Question3, step >= 4)}
        {isDesktop && <div className="font-12 progress-label-s6">EXTRACURRICULAR</div>}
      </div>
      {renderLine(step >= 5)}
      <div>
        {renderStep(4, step === Pages.Question4, step >= 5)}
        {isDesktop && <div className="font-12 progress-label-s6">HIGHER EDUCATION</div>}
      </div>
      {renderLine(step >= 6)}
      <div>
        {renderStep(5, step === Pages.Question5, step >= 6)}
        {isDesktop && <div className="font-12 progress-label-s6">CAREERS</div>}
      </div>
      {renderLine(step >= 7)}
      <div>
        {renderStep(6, step === Pages.Question6, false)}
        {isDesktop && <div className="font-12 progress-label-s6">DREAMS</div>}
      </div>
      {!isPhone() && <div className="bold font-16 exit-btn" onClick={props.exit}>Exit</div>}
    </div>
  );
}


export default ProgressBarSixthform;
