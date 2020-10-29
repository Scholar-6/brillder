import React from "react";

import SpriteIcon from "../SpriteIcon";

interface NextButtonProps {
  isRed?: boolean;
  isShown: boolean;
  onClick(): void;
}

const NextButton: React.FC<NextButtonProps> = props => {
  if (!props.isShown) { return <div></div>; }
  let className = 'w100 h100 active';
  if (props.isRed) {
    className += ' text-orange';
  }
  return (
    <button className="btn btn-transparent next-button svgOnHover active" onClick={props.onClick}>
      <SpriteIcon name="arrow-down" className={className} />
    </button>
  );
}

export default NextButton;
