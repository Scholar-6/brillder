import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";

export interface ButtonProps {
  onClick(): void;
}

const RemoveImageButton: React.FC<ButtonProps> = ({onClick}) => {
  return (
    <button
      className="btn btn-transparent right-top-icon svgOnHover"
      onClick={onClick}
    >
      <SpriteIcon
        name="circle-cancel"
        className="active back-button theme-orange"
      />
    </button>
  );

  return <div></div>;
};

export default RemoveImageButton;
