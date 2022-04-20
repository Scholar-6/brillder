import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { StripeCredits } from 'components/map';
import React, { useEffect, useState} from 'react';
import { connect } from "react-redux";

import userActions from "redux/actions/user";

interface Props {
  className?: string;
  getUser(): any;
  history?: any;
  popupShown?: boolean;
  onClick?(): void;
}

const ReactiveUserCredits:React.FC<Props> = (props) => {
  const [credits, setCredits] = useState(0);

  const getCredits = async () => {
    try {
      const user = await props.getUser();
      setCredits(user.freeAttemptsLeft);
    } catch {}
  }

  useEffect(() => {
    getCredits();

    const interval = setInterval(() => {
      getCredits();
    }, 2000);

    // free resources
    return () => { clearInterval(interval); }
    /*eslint-disable-next-line*/
  }, []);

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
          Spend 1 credit to play a Brick from the catalogue or 2 credits to enter a competition.
        </div>
        <div className="flex-center">
          <div className="green-btn blue-on-hover" onClick={() => {
            if (props.history) {
              props.history.push(StripeCredits);
            }
          }}>
            Buy more credits
          </div>
        </div>
      </div>
    </div>
  );
}

const mapDispatch = (dispatch: any) => ({
  getUser: () => dispatch(userActions.getUser()),
});


/**
 *  Credits will reload every 2seconds. Works only for current logged in user.
 */
export default connect(null, mapDispatch)(ReactiveUserCredits);
