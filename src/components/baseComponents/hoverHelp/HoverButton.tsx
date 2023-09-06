import React from 'react';
import SpriteIcon from '../SpriteIcon';
import './HoverHelp.scss';

interface Props {
  icon: string;
  className: string;
  children: any;
  onClick(): void;
}

const HoverButton: React.FC<Props> = (props) => {
  return (
    <div className="hover-area custom">
      <SpriteIcon name={props.icon} className={props.className} onClick={props.onClick} />
      <div className="hover-content bold">
        {props.children}
      </div>
    </div>
  );
}

export default HoverButton;
