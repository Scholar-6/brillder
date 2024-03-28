import React from 'react';
import './ProgressBarSixthform.scss';
import AnimatedDescription from './AnimatedDescription';
import SpriteIcon from 'components/baseComponents/SpriteIcon';

interface Props {
  icon?: string;
  step: number;
  total: number;
  isBig: boolean;
  subjectDescription: string;
}

const ProgressBarStep6: React.FC<Props> = (props) => {
  const { step, total, subjectDescription } = props;
  let renderLine = (isActive: boolean, i: number) => {
    return <div key={i} className={`line-r23 ${isActive ? 'active' : ''}`} />
  }
  return (
    <div className={`progress-description-container-r3234 progress-watching-bar progress-entusiasm-bar ${props.isBig ? 'box-bigger-r343' : ''}`}>
      <div className="progress-bar-sixthform">
        {Array.from({length: total}).map((v, i) => renderLine(step >= i, i))}
      </div>
      <div className="font-14 paging-3c1">{step + 1} / {total} items</div>
      {props.icon &&
      <div className="flex-center">
        <SpriteIcon name={props.icon} />
      </div>}
      <div className="flex-center progress-content-box-r233">
        <AnimatedDescription step={step} description={subjectDescription} textClass="bold" />
      </div>
    </div>
  );
}


export default ProgressBarStep6;