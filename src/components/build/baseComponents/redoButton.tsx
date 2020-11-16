


import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";

export interface ButtonProps {
  redo(): void;
  canRedo(): boolean;
}

const RedoButton: React.FC<ButtonProps> = props => {
  const [hovered, setHover] = React.useState(false);

  return (
    <div className="redo-button-container">
      <button
        className="btn btn-transparent svgOnHover redo-button"
        onMouseLeave={() => setHover(false)}
        onMouseEnter={()=> setHover(true)}
        onClick={props.redo}
      >
        <SpriteIcon
          name="redo"
          className={`w100 h100 active ${props.canRedo() && "text-theme-orange"}`}
        />
      </button>
      {hovered && <div className="custom-tooltip">Redo</div>}
    </div>
  );
};

export default RedoButton;
