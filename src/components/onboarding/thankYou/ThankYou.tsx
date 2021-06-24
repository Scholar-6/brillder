import React from "react";
import { isMobile } from 'react-device-detect';

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { isPhone } from "services/phone";
import map from "components/map";
import { hideZendesk } from "services/zendesk";
import TypingLabel from "components/baseComponents/TypingLabel";

interface Props {
  history: any;
  location: any;
}

const MobileTheme = React.lazy(() => import('./themes/TermsMobileTheme'));
const TabletTheme = React.lazy(() => import('./themes/TermsTabletTheme'));
const DesktopTheme = React.lazy(() => import('./themes/TermsDesktopTheme'));


const ThankYou: React.FC<Props> = (props) => {
  const [isAnimated, setAnimated] = React.useState(false);

  React.useEffect(() => {
    if (isPhone()) {
      hideZendesk();
    }
  }, []);

  const moveNext = () => {
    props.history.push(map.UserPreference);
  }

  if (isPhone()) {
    return (
      <React.Suspense fallback={<></>}>
        <MobileTheme />
        <div className="thank-you-page">
          <div className="th-before-image-space" />
          <div className="flex-center th-icon-container">
            <SpriteIcon name="logo" />
          </div>
          <p className="text-center th-brillder">Brillder</p>
          <div className="th-after-image-space" />
          <div className="th-title-container">
            <p className="th-title">Thank you for</p>
            <p className="th-title">signing up</p>
            <p className="th-title">to Brillder!</p>
          </div>
          <div className="th-after-title-space" />
          <p className="text-center th-last-text">
            <TypingLabel label="It's great to have you on board." onEnd={() => setAnimated(true)} />
          </p>
          <div className="th-before-button-space" />
          {isAnimated &&
            <div className="flex-center">
              <button className="btn theme-orange" onClick={moveNext}>Start 30 second setup</button>
            </div>
          }
        </div>
      </React.Suspense>
    );
  }
  return (
    <React.Suspense fallback={<></>}>
      {isMobile ? <TabletTheme /> : <DesktopTheme />}
      <div className="thank-you-page">
        <div className="left-part">
          <div className="th-title-container">
            <p className="th-title">Thank you for signing up to Brillder!</p>
            <p className="text-center th-last-text">
              <TypingLabel label="It's great to have you on board." onEnd={() => setAnimated(true)} />
            </p>
            {isAnimated &&
            <div className="flex-center">
              <button className="btn theme-orange" onClick={moveNext}>Start 30 second setup</button>
            </div>}
          </div>
          {isAnimated &&
            <div className="th-arrow-container">
              <SpriteIcon name="thank-you-arrow" />
            </div>
          }
        </div>
        <div className="right-part">
          <div className="blue-right-block" />
          <div className="proposal-phone-preview phone-username-preview">
            <div className="phone">
              <div className="phone-border">
                <div className="volume volume1"></div>
                <div className="volume volume2"></div>
                <div className="volume volume3"></div>
                <div className="sleep"></div>
                <div className="screen">
                  <div className="only-icon-container">
                    <div className="icon-container">
                      <SpriteIcon name="logo" />
                    </div>
                    <div className="th-phone-brillder">
                      <SpriteIcon name="brillder-text" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Suspense>
  );
}

export default ThankYou;
