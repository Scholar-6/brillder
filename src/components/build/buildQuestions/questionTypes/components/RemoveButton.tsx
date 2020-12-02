import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";

export interface ButtonProps {
  onClick(e: any): void;
}

const RemoveButton: React.FC<ButtonProps> = props => {
  return (
    <button
      className="btn btn-transparent right-top-icon svgOnHover"
      onClick={props.onClick}
    >
      <SpriteIcon
        name="trash-outline"
        className="active back-button theme-orange"
      />
    </button>
  );
}

export default RemoveButton;
