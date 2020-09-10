import React from "react";

import sprite from "assets/img/icons-sprite.svg";

interface ButtonProps {
  onClick(): void;
}

const LivePrevButton: React.FC<ButtonProps> = ({ onClick }) => {
  return (
    <button className="play-preview svgOnHover play-white" onClick={onClick}>
      <svg className="svg w80 h80 svg-default m-0">
        {/*eslint-disable-next-line*/}
        <use href={sprite + "#arrow-left"} className="text-gray" />
      </svg>
      <svg className="svg w80 h80 colored m-0">
        {/*eslint-disable-next-line*/}
        <use href={sprite + "#arrow-left"} className="text-white" />
      </svg>
    </button>
  );
};

export default LivePrevButton;
