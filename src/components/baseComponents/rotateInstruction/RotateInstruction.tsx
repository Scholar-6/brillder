import React from "react";

import './RotateInstruction.scss';
import SpriteIcon from "../SpriteIcon";

interface Props {}

const RotateInstruction: React.FC<Props> = (props) => {
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
        <div className="rotate-text">We think it will be easier to take in information with your device upright.</div>
      </div>
    </div>
  );
}

export default RotateInstruction;
