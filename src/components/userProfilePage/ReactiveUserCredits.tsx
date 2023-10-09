import React, { useEffect, useState } from 'react';
import { User } from 'model/user';
import { connect } from "react-redux";

import { ReduxCombinedState } from 'redux/reducers';
import { StripeCredits } from 'components/map';
import SpriteIcon from 'components/baseComponents/SpriteIcon';

interface Props {
  className?: string;
  history?: any;
  popupShown?: boolean;
  onClick?(): void;

  user: User;
}

const ReactiveUserCredits: React.FC<Props> = (props) => {
  const [credits, setCredits] = useState(0);
  const [isLibraryUser, setLibraryUser] = useState(false);

  useEffect(() => {
    if (props.user && props.user.freeAttemptsLeft !== credits) {
      setCredits(props.user.freeAttemptsLeft);
    }

    if (props.user && props.user.library) {
      setLibraryUser(true);
    } else {
      setLibraryUser(false);
    }
  }, [props.user]);

  const renderBoldTitle = () => {
    if (credits === 0) {
      return `You have no credits remaining`;
    }
    return `You have ${credits} credit${credits > 1 ? 's' : ''}  remaining.`;
  }

  return (
    <div className={props.className}>
      {credits > 0 ? <SpriteIcon name="circle-lines" /> : <SpriteIcon name="circle-lines-blue" />}
      <span onClick={() => {
        props.onClick?.();
      }}>{credits}</span>
      <div className={`css-custom-tooltip ${props.popupShown ? 'visible' : ''}`}>
        <div className="bold">{renderBoldTitle()}</div>
        <div className="regular">
          Spend {!isLibraryUser ? '1 credit to play a Brick from the catalogue or' : ''} 2 credits to enter a competition.
        </div>
        {!isLibraryUser &&
          <div className="flex-center">
            <div className="green-btn blue-on-hover" onClick={() => {
              if (props.history) {
                props.history.push(StripeCredits);
              }
            }}>
              Buy more credits
            </div>
          </div>}
      </div>
    </div>
  );
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});


export default connect(mapState)(ReactiveUserCredits);
