import React from 'react';

import './Hourglass.scss';
import { isPhone } from 'services/phone';


const MobileTheme = React.lazy(() => import("./themes/GlassMobileTheme"));
const DesktopTheme = React.lazy(() => import("./themes/GlassDesktopTheme"));

const Hourglass: React.FC<any> = (props) => {
  return (
    <React.Suspense fallback={<></>}>
      {isPhone() ? <MobileTheme /> : <DesktopTheme />}
      <div className="gg-hourglass">
        <div className="top"></div>
        <div className="bottom"></div>
      </div>
    </React.Suspense>
  )
}

export default Hourglass;
