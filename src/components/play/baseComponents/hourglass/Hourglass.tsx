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
        <svg className="background-icon" viewBox="0 0 162 351.999">
          <g transform="translate(-0.459 -0.234)">
            <path
              d="M146,352H16A16,16,0,0,1,0,336V207.147L30.281,176,0,144.849V16A16,16,0,0,1,16,0H146a16,16,0,0,1,16,16V144.849L131.719,176,162,207.149V336a16,16,0,0,1-16,16Z"
              transform="translate(0.459 0.234)"
              fill="#c43c30"
            />
          </g>
        </svg>
        <div className="top"></div>
        <div className="bottom"></div>
      </div>
    </React.Suspense>
  )
}

export default Hourglass;
