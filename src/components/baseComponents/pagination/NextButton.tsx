import React from "react";

import SpriteIcon from "../SpriteIcon";

interface NextButtonProps {
  isShown: boolean;
  onClick(): void;
}

const NextButton: React.FC<NextButtonProps> = props => {
  if (!props.isShown) { return <div></div>; }
  return (
    <button
      className={"btn btn-transparent next-button svgOnHover active"}
      onClick={props.onClick}
    >
      <SpriteIcon name="arrow-down" className="w100 h100 active" />
    </button>
  );
}

export default NextButton;
