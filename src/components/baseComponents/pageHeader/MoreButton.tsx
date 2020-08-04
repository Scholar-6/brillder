import React from "react";
import sprite from "assets/img/icons-sprite.svg";

interface MoreButtonProps {
  onClick(): void;
}

const MoreButton: React.FC<MoreButtonProps> = (props) => {
  return (
    <div className="header-btn more-button svgOnHover" onClick={props.onClick}>
      <svg className="svg active">
        <use href={sprite + "#more"} />
      </svg>
    </div>
  );
};

export default MoreButton;
