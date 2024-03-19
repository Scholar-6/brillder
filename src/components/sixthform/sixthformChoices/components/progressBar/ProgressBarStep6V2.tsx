import React from 'react';
import './ProgressBarSixthform.scss';
import SpriteIcon from 'components/baseComponents/SpriteIcon';

interface Props {
  icon?: string;
  step: number;
  total: number;
  title: string;
  description: string;
}

const ProgressBarStep6V2: React.FC<Props> = (props) => {
  const { step, total } = props;
  let renderLine = (isActive: boolean) => {
    return <div className={`line-r23 ${isActive ? 'active' : ''}`} />
  }
  return (
    <div className="progress-description-container-r3234 progress-watching-bar">
      <div className="progress-bar-sixthform">
        {Array.from({length: total}).map((v, i) => renderLine(step >= i))}
      </div>
      <div className="font-14 paging-3c1">{step + 1} / {total} items</div>
      <div className="flex-center">{props.icon ? <SpriteIcon name={props.icon} /> : "" }</div>
      <div className="font-24 text-center bold title-6v2">{props.title}</div>
      <div className="font-16 text-center description-6v2">{props.description}</div>
    </div>
  );
}

export default ProgressBarStep6V2;
