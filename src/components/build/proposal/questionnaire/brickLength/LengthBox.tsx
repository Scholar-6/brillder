import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { BrickLengthEnum } from 'model/brick';
import React from 'react';

interface LengthBoxProps {
  activeLength: BrickLengthEnum;
  boxLength: BrickLengthEnum;
  setBrickLength(l: BrickLengthEnum): void;
}

const LengthBox: React.FC<LengthBoxProps> = ({ activeLength, boxLength, setBrickLength }) => {
  const [hovered, setHover] = React.useState(false);
  let icon = ''
  let label = '';
  let className = 'brick-length-image-container brick-length-image-container';
  if (boxLength === BrickLengthEnum.S20min) {
    icon = '20min-';
    label = '20';
    className += '1';
  } else if (boxLength === BrickLengthEnum.S40min) {
    icon = '40min-';
    label = '40';
    className += '2';
  } else {
    icon = '60min-';
    label = '60';
    className += '3';
  }

  if (activeLength === boxLength || hovered) {
    icon += 'red';
  } else {
    icon += 'blue';
  }

  if (activeLength === boxLength) {
    className += ' active';
  }

  return (
    <div className={className} onClick={() => setBrickLength(boxLength)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} >
      <SpriteIcon name={icon} className="brick-length-image" />
      <div className="length-num">
        {label}
      </div>
    </div>
  )
}

export default LengthBox;
