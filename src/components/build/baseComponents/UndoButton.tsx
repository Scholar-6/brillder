


import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";

export interface ButtonProps {
  undo(): void;
  canUndo(): boolean;
}

const RedoButton: React.FC<ButtonProps> = props => {
  const [hovered, setHover] = React.useState(false);

  return (
    <div className="undo-button-container">
      <button
        className="btn btn-transparent svgOnHover undo-button"
        onMouseLeave={() => setHover(false)}
        onMouseEnter={()=> setHover(true)}
        onClick={props.undo}
      >
        <SpriteIcon
          name="undo"
          className={`w100 h100 active ${props.canUndo() && "text-theme-orange"}`}
        />
      </button>
      {hovered && <div className="custom-tooltip">Undo</div>}
    </div>
  );
};

export default RedoButton;
