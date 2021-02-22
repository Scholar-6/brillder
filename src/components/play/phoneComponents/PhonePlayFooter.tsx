import SpriteIcon from 'components/baseComponents/SpriteIcon';
import React from 'react';

const PhonePlayFooter: React.FC<any> = (props) => {
  return <div className="phone-play-footer">
    <SpriteIcon name="" />
    <SpriteIcon name="arrow-left-circle" />
    <SpriteIcon name="file-text" />
    <SpriteIcon name="highlighter" />
    <SpriteIcon name="arrow-left" />
    <SpriteIcon name="more" className="rotate-90" />
    <SpriteIcon name="arrow-right" />
  </div>;
}

export default PhonePlayFooter;