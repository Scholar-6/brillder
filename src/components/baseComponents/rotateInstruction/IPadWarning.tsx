import React from "react";

import './RotateInstruction.scss';
import SpriteIcon from "../SpriteIcon";

interface Props {
  hideWarning(): void;
}

const RotateIPadInstruction: React.FC<Props> = (props) => {
  return (
    <div className="rotate-instruction-page">
      <div>
        <div className="rotate-button-container triangle">
          <SpriteIcon name="alert-triangle" />
        </div>
        <div className="rotate-text">Brillder is not yet fully optimised for iPad.</div>
        <div className="rotate-button-container">
          <button className="btn" onClick={props.hideWarning}>Explore anyway</button>
        </div>
      </div>
    </div>
  );
}

export default RotateIPadInstruction;
