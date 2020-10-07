import React from "react";

import SpriteIcon from "../SpriteIcon";

interface PrevButtonProps {
  isShown: boolean;
  onClick(): void;
}

const PrevButton: React.FC<PrevButtonProps> = props => {
  if (!props.isShown) { return <div></div>; }
  return (
    <button
      className={"btn btn-transparent prev-button svgOnHover active"}
      onClick={props.onClick}
    >
      <SpriteIcon name="arrow-up" className="w100 h100 active" />
    </button>
  );
}

export default PrevButton;
