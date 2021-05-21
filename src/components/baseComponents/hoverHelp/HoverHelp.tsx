import React from 'react';
import SpriteIcon from '../SpriteIcon';
import './HoverHelp.scss';

const HoverHelp: React.FC<any> = () => {
  return (
    <div className="hover-area custom">
      <SpriteIcon name="help-circle-custom" />
      <div className="hover-content">
        <div className="container">
          hello
        </div>
      </div>
    </div>
  );
}

export default HoverHelp;
