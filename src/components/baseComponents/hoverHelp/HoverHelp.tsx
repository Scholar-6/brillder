import React from 'react';
import SpriteIcon from '../SpriteIcon';
import './HoverHelp.scss';

interface Props {
  icon?: string;
}

const HoverHelp: React.FC<Props> = (props) => {
  return (
    <div className="hover-area custom">
      <SpriteIcon name={props.icon ? props.icon : "help-circle-custom"} />
      <div className="hover-content">
        <div className="container">
          {props.children}
        </div>
      </div>
    </div>
  );
}

export default HoverHelp;
