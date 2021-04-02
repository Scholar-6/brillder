import React from "react";

import { isIPad13, isMobile, isTablet } from 'react-device-detect';
import SpriteIcon from "../SpriteIcon";

interface Props {
  hideWarning(): void;
}

const MobileTheme = React.lazy(() => import('./themes/RotateInstructionsMobileTheme'));
const TabletTheme = React.lazy(() => import('./themes/RotateInstructionsTabletTheme'));

const RotateIPadInstruction: React.FC<Props> = (props) => {
  return (
    <React.Suspense fallback={<></>}>
      {isIPad13 || isTablet ? <TabletTheme /> : isMobile && <MobileTheme />}
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
    </React.Suspense>
  );
}

export default RotateIPadInstruction;
