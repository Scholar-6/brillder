import React from 'react';
import { isPhone } from 'services/phone';
import SpriteIcon from './SpriteIcon';

interface Props {
  popupShown?: boolean;
  onClick?(): void;
}

const BrillIcon: React.FC<Props> = (props) => {
  if (isPhone()) {
    return (
       <div className="brill-coin-img" onClick={props.onClick}>
        <img alt="brill" className="brills-icon" src="/images/Brill.svg" />
        <SpriteIcon name="logo" />
        <div className={`css-custom-tooltip ${props.popupShown ? 'visible' : ''}`}>
          <div className="bold">What are brills?</div>
          <div className="regular">
            If you score over 50% on your first attempt or improve an earlier score while scoring over 50%, your percentage converts into bonus points, called brills. We're giving 200 brills to all new and existing users as a thank you for using our platform.
          </div>
          <div className="regular" style={{marginTop: '3vw'}}>
            Collect enough brills and you can even win cash prizes!
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="brill-coin-img">
      <img alt="brill" className="brills-icon" src="/images/Brill.svg" />
      <SpriteIcon name="logo" />
      <div className="css-custom-tooltip">
        <div className="bold">What are brills?</div>
        <div className="regular">
          If you score over 50% on a brick, your percentage converts into bonus points, called brills.
        </div>
        <div className="regular" style={{marginTop: '1vw'}}>
          Collect enough brills and you can win cash prizes!
        </div>
      </div>
    </div>
  )
}

export default BrillIcon;
