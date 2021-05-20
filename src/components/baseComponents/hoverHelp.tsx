import React from 'react';
import { isPhone } from 'services/phone';
import SpriteIcon from './SpriteIcon';

const HoverHelp: React.FC<any> = () => {
  const [hover, setHover] = React.useState(false);
  return (
    <div className="hover-area">
      <SpriteIcon name="help-circle-custom" onClick={() => setFirstPhonePopup(true)} />
      {!isPhone() &&
        <div className="hover-content">
          <div>A brick is a learning unit that should take either 20, 40, or 60 minutes to complete.</div>
          <br />
          <div>Bricks follow a cognitively optimised sequence:</div>
          <div className="container">
            <div className="white-circle">1</div>
            <div className="l-text">
              Preparation: <span className="regular">stimulus content gets you in the zone.</span>
            </div>
          </div>
          <div className="container">
            <div className="white-circle">2</div>
            <div className="l-text">
              Investigation: <span className="regular">challenging interactive questions make you think.</span>
            </div>
          </div>
          <div className="container">
            <div className="white-circle">3</div>
            <div className="l-text">
              <span className="regular">A preliminary score</span>
            </div>
          </div>
          <div className="container">
            <div className="white-circle">4</div>
            <div className="l-text">
              Synthesis: <span className="regular">explanation.</span>
            </div>
          </div>
          <div className="container">
            <div className="white-circle">5</div>
            <div className="l-text">
              Review: <span className="regular">hints help you correct your answers.</span>
            </div>
          </div>
          <div className="container">
            <div className="white-circle">6</div>
            <div className="l-text">
              <span className="regular">A final score</span>
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default HoverHelp;
