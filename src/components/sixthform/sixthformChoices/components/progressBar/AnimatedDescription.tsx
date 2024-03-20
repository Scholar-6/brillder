import React from 'react';
import './ProgressBarSixthform.scss';
import SpriteIcon from 'components/baseComponents/SpriteIcon';

interface Props {
  description: string;
}

const AnimatedDescription: React.FC<Props> = (props) => {
  return (
    <div className="relative animating-left">
      <div className="flex-center bold font-24"><SpriteIcon name="heart-six" /> I love...</div>
      <div className="font-32 text-center bold animating title-6v2">{props.description}</div>
    </div>
  );
}


export default AnimatedDescription;
