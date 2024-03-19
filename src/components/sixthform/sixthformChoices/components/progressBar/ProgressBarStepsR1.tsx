import React from 'react';
import './ProgressBarSixthform.scss';

interface Props {
  step: number;
  total: number;
}

const ProgressBarStepsR1: React.FC<Props> = (props) => {
  const { step, total } = props;
  let renderLine = (isActive: boolean, i: number) => {
    return <div key={i} className={`line-r23 ${isActive ? 'active' : ''}`} />
  }
  return (
    <div className="progress-container-r1-323">
      <div className="progress-bar-sixthform">
        {Array.from({length: total}).map((v, i) => renderLine(step >= i, i))}
      </div>
      <div className="font-14 paging-3c1">{step + 1}/{total} subjects</div>
    </div>
  );
}


export default ProgressBarStepsR1;
