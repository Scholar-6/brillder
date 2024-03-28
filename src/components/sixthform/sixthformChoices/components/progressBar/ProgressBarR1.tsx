import React from 'react';
import './ProgressBarSixthform.scss';
import AnimatedDescriptionV7 from './AnimatedDescriptionV7';

interface Props {
  step: number;
  total: number;
  topLabel: string;
  description: string;
}

const ProgressBarR1: React.FC<Props> = (props) => {
  const { step, total } = props;
  let renderLine = (isActive: boolean) => {
    return <div className={`line-r23 ${isActive ? 'active' : ''}`} />
  }
  return (
    <div className="progress-description-container-r3234">
      <div className="progress-bar-sixthform">
        {Array.from({length: total}).map((v, i) => renderLine(step >= i))}
      </div>
      <div className="font-14 paging-3c1">{step + 1}/{total} subjects</div>
      <div className="flex-center bold font-16 color-light-blue">{props.topLabel}</div>
      <div className="flex-center progress-content-box-r323">
        <AnimatedDescriptionV7 step={step} description={props.description} />
      </div>
    </div>
  );
}

export default ProgressBarR1;
