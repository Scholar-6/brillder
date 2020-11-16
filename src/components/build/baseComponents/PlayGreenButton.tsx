import React from "react";

import "./PlayButton.scss";
import sprite from "assets/img/icons-sprite.svg";


export interface PlayButtonProps {
  onClick(): void;
}

const PlayGreenButton: React.FC<PlayButtonProps> = props => {
  return (
    <button type="button" className="play-green-button" onClick={props.onClick}>
      <svg className="svg w80 h80 colored m-l-02">
        <use href={sprite + "#play-thick"} className="text-white" />
      </svg>
    </button>
  );
};

export default PlayGreenButton;
