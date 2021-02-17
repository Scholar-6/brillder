import React from "react";

import './RotateInstruction.scss';
import SpriteIcon from "../SpriteIcon";

interface Props {}

const RotateIPadInstruction: React.FC<Props> = (props) => {
  const rotateScreen = () => {
    if (document.body.requestFullscreen) {
      document.body.requestFullscreen().then(() => {
        window.screen.orientation.lock('portrait-primary');
      });
    }
  }

  return (
    <div className="rotate-instruction-page">
      <div>
        <div className="rotate-button-container">
          <div className="rotate-button" onClick={rotateScreen}>
            <SpriteIcon name="undo" />
            <div className="dot"></div>
          </div>
        </div>
        <div className="rotate-text">We think you will enjoy Brillder more with your device in landscape mode.</div>
      </div>
    </div>
  );
}

export default RotateIPadInstruction;
