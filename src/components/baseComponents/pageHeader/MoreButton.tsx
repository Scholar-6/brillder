import React from "react";
import SpriteIcon from "../SpriteIcon";

interface MoreButtonProps {
  onClick(): void;
}

const MoreButton: React.FC<MoreButtonProps> = (props) => {
  return (
    <div className="header-btn more-button svgOnHover" onClick={props.onClick}>
      <SpriteIcon name="more" className="active" />
    </div>
  );
};

export default MoreButton;
