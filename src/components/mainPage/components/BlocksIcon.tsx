import React from "react";

import './BlocksIcon.scss';


interface FirstButtonProps {
  disabled?: boolean;
}

const BlocksIcon: React.FC<FirstButtonProps> = props => {
  const [hovered, setHover] = React.useState(false);
  let className = 'blocks-icon svg';
  if (hovered) {
    className += ' hovered';
  }
  return (
    <div className={className} onMouseEnter={() => {
      if (!props.disabled) {
        setHover(true)
      }
    }} onMouseLeave={() => setHover(false)}>
      <div className="stack-blocks">
        <div className="bl bl-1" />
        <div className="bl bl-2" />
        <div className="bl bl-3" />
        <div className="bl bl-4" />
        <div className="bl bl-5" />
        <div className="bl bl-6" />
      </div>
      <div className="groped-blocks">
        <div className="bl bl-1" />
        <div className="bl bl-2" />
        <div className="bl bl-3" />
        <div className="bl bl-4" />
        <div className="bl bl-5" />
        <div className="bl bl-6" />
      </div>
    </div>
  );
}

export default BlocksIcon;
