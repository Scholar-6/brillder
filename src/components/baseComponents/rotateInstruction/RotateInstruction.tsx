import React from "react";

import { isIPad13, isMobile, isTablet } from 'react-device-detect';
import SpriteIcon from "../SpriteIcon";

interface Props { }

const MobileTheme = React.lazy(() => import('./themes/RotateInstructionsMobileTheme'));
const TabletTheme = React.lazy(() => import('./themes/RotateInstructionsTabletTheme'));

const RotateInstruction: React.FC<Props> = (props) => {
  const rotateScreen = () => {
    if (document.body.requestFullscreen) {
      document.body.requestFullscreen().then(() => {
        window.screen.orientation.lock('portrait-primary');
      });
    }
  }

  return (
    <React.Suspense fallback={<></>}>
      {isIPad13 || isTablet ? <TabletTheme /> : isMobile && <MobileTheme />}
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
    </React.Suspense>
  );
}

export default RotateInstruction;
