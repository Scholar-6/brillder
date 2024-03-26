import React from 'react';
import './ProgressBarSixthform.scss';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import AnimatedDescriptionWriting from './AnimatedDescriptionWriting';

interface Props {
  step: number;
  title: string;
  total: number;
  description: string;
}

const ProgressBarWriting: React.FC<Props> = (props) => {
  const { step, total } = props;
  let renderLine = (isActive: boolean, i: number) => {
    return <div key={i} className={`line-r23 ${isActive ? 'active' : ''}`} />
  }
  return (
    <div className="progress-description-container-r3234 progress-watching-bar progress-entusiasm-bar">
      <div className="progress-bar-sixthform">
        {Array.from({length: total}).map((v, i) => renderLine(step >= i, i))}
      </div>
      <div className="font-14 paging-3c1">{step + 1} / {total} items</div>
      <div className="flex-center">
        <SpriteIcon name="writing-sixth" />
      </div>
      <div className="flex-center progress-content-box-r233">
        <AnimatedDescriptionWriting step={step} title={props.title} description={props.description} />
      </div>
    </div>
  );
}


export default ProgressBarWriting;
