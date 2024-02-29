import React from 'react';
import './ProgressBarSixthform.scss';
import SpriteIcon from 'components/baseComponents/SpriteIcon';

interface Props {
  step: number;
  total: number;
  subjectDescription: string;
}

const ProgressBarStep3C1: React.FC<Props> = (props) => {
  const { step, total, subjectDescription } = props;
  let renderLine = (isActive: boolean) => {
    return <div className={`line-r23 ${isActive ? 'active' : ''}`} />
  }
  console.log(subjectDescription);
  return (
    <div className="progress-description-container-r3234">
      <div className="progress-bar-sixthform">
        {renderLine(step >= 0)}
        {renderLine(step >= 1)}
        {renderLine(step >= 2)}
        {renderLine(step >= 3)}
        {renderLine(step >= 4)}
      </div>
      <div className="font-14 paging-3c1">{step + 1}/{total}</div>
      <div className="flex-center"><SpriteIcon name="step3c1-progress" /></div>
      <div className="font-16 text-center">Which subject matches this description?</div>
      <div className="font-20 text-center bold subject-description-3c1">{subjectDescription}</div>
    </div>
  );
}


export default ProgressBarStep3C1;
