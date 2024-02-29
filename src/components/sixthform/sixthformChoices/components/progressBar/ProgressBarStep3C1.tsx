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
    console.log(3);
    return <div className={`line-r23 ${isActive ? 'active' : ''}`} />
  }
  return (
    <div className="progress-description-container-r3234">
      <div className="progress-bar-sixthform">
        {Array.from({length: total}).map((v, i) => renderLine(step >= i))}
      </div>
      <div className="font-14 paging-3c1">{step + 1}/{total} subjects</div>
      <div className="flex-center"><SpriteIcon name="step3c1-progress" /></div>
      <div className="font-16 text-center">Which subject matches this description?</div>
      <div className="font-20 text-center bold subject-description-3c1">{subjectDescription}</div>
    </div>
  );
}


export default ProgressBarStep3C1;
