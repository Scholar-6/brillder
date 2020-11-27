import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";

export interface ButtonProps {
  length: number;
  index: number;
  onClick(index: number): void;
}

const RemoveItemButton: React.FC<ButtonProps> = ({length, index, onClick}) => {
  if (length > 3) {
    return (
      <button
        className="btn btn-transparent right-top-icon svgOnHover"
        onClick={() => onClick(index)}
      >
        <SpriteIcon
          name="trash-outline"
          className="active back-button theme-orange"
        />
      </button>
    );
  }

  return <div></div>;
};

export default RemoveItemButton;
