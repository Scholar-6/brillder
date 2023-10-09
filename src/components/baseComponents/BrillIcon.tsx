import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";

import SpriteIcon from './SpriteIcon';
import { isPhone } from 'services/phone';
import { ReduxCombinedState } from 'redux/reducers';
import { User } from 'model/user';

interface Props {
  popupShown?: boolean;
  onClick?(): void;

  user: User;
}

const BrillIcon: React.FC<Props> = (props) => {
  const [isLibraryUser, setLibraryUser] = useState(false);

  useEffect(() => {
    if (props.user) {
      if (props.user.library) {
        setLibraryUser(true);
      } else {
        setLibraryUser(false);
      }
    }
    /*eslint-disable-next-line*/
  }, [props.user]);

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
            Collect enough brills and you can even win {isLibraryUser ? '' : 'cash'} prizes!
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="brill-coin-img" onClick={props.onClick}>
      <img alt="brill" className="brills-icon" src="/images/Brill.svg" />
      <SpriteIcon name="logo" />
      <div className="css-custom-tooltip">
        <div className="bold">What are brills?</div>
        <div className="regular">
          If you score over 50% on a brick, your percentage converts into bonus points, called brills.
        </div>
        <div className="regular" style={{marginTop: '1vw'}}>
          Collect enough brills and you can win {isLibraryUser ? '' : 'cash'} prizes!
        </div>
      </div>
    </div>
  )
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

export default connect(mapState)(BrillIcon);
