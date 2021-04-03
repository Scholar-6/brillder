import React from "react";

import { isIPad13, isMobile, isTablet } from 'react-device-detect';
import SpriteIcon from "../SpriteIcon";

interface Props { }

const MobileTheme = React.lazy(() => import('./themes/RotateInstructionsMobileTheme'));
const TabletTheme = React.lazy(() => import('./themes/RotateInstructionsTabletTheme'));

const Warning: React.FC<Props> = (props) => {
  return (
    <React.Suspense fallback={<></>}>
      {isIPad13 || isTablet ? <TabletTheme /> : isMobile && <MobileTheme />}
      <div className="rotate-instruction-page ipad-warning">
        <div>
          <div className="rotate-button-container">
            <SpriteIcon name="alert-triangle" />
          </div>
          <div className="rotate-text">Hold tight, Brillder is coming soon on iPad.</div>
        </div>
      </div>
    </React.Suspense>
  );
}

export default Warning;
