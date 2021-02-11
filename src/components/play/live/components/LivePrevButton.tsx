import React from "react";

import SpriteIcon from "components/baseComponents/SpriteIcon";

interface ButtonProps {
  onClick(): void;
}

const LivePrevButton: React.FC<ButtonProps> = ({ onClick }) => {
  return (
    <button className="play-preview svgOnHover play-white" onClick={onClick}>
      <SpriteIcon name="arrow-left" className="w80 h80 svg-default m-l-02 text-gray" />
      <SpriteIcon name="arrow-left" className="w80 h80 colored m-l-02 text-white" />
    </button>
  );
};

export default LivePrevButton;
