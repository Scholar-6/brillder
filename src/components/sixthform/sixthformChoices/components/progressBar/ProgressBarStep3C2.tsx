import React from 'react';
import './ProgressBarSixthform.scss';
import AnimatedDescriptionV5 from './AnimatedDescriptionV5';

interface Props {
  step: number;
  total: number;
  topLabel: string;
  subjectDescription: string;
}

const ProgressBarStep3C2: React.FC<Props> = (props) => {
  const { step, total, subjectDescription } = props;
  let renderLine = (isActive: boolean) => {
    return <div className={`line-r23 ${isActive ? 'active' : ''}`} />
  }
  return (
    <div className="progress-description-container-r3234 color-light-blue">
      <div className="progress-bar-sixthform">
        {Array.from({length: total}).map((v, i) => renderLine(step >= i))}
      </div>
      <div className="font-14 paging-3c1">{step + 1}/{total} subjects</div>
      <div className="progress-custom-r32">
        <AnimatedDescriptionV5 step={step} title={props.topLabel} description={subjectDescription} />
      </div>
    </div>
  );
}

export default ProgressBarStep3C2;
