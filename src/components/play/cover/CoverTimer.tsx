import SpriteIcon from 'components/baseComponents/SpriteIcon';
import React from 'react';

interface Props {
  brickLength: number;
}

const CoverTimer: React.FC<Props> = (props) => {
  return <div className="cover-timer"><SpriteIcon name="clock" /> {props.brickLength}</div>
}

export default CoverTimer;
