import React, { useEffect } from 'react';
import { useStateWithCallbackLazy } from 'use-state-with-callback';
import { connect } from 'react-redux';

import { GetUserBrills, SetUserBrills } from 'localStorage/play';
import { User } from 'model/user';
import BrillIcon from './BrillIcon';
import { ReduxCombinedState } from 'redux/reducers';
interface Props {
  user: User;
  popupShown?: boolean;
  onClick?(): void;
}

const BrillIconAnimated: React.FC<Props> = (props) => {
  const [currentBrills, setCurrentBrills] = useStateWithCallbackLazy(0);
  const [flipCoin, setFlipCoin] = React.useState(false);

  const animateBrills = (cashedBrills: number) => {
    const increaseCoins = (userBrills: number) => {
      const high = userBrills;

      let step = Math.round((userBrills - cashedBrills) / 15);
      if (step < 2) {
        step = 2;
      }
      setFlipCoin(true);
      const interval = setInterval(() => {
        if (cashedBrills < high - step) {
          cashedBrills += step;
          setCurrentBrills(cashedBrills, () => { });
        } else {
          setCurrentBrills(high, () => { });
          SetUserBrills(high);
          clearInterval(interval);
        }
      }, 100);

      setTimeout(() => setFlipCoin(false), 2000);
    }

    const decreaseCoins = (userBrills: number) => {
      const high = userBrills;

      let step = -Math.round((userBrills - cashedBrills) / 15);
      if (step < 2) {
        step = 2;
      }
      setFlipCoin(true);
      const interval = setInterval(() => {
        if (cashedBrills > high + step) {
          cashedBrills -= step;
          setCurrentBrills(cashedBrills, () => { });
        } else {
          setCurrentBrills(high, () => { });
          SetUserBrills(high);
          clearInterval(interval);
        }
      }, 100);

      setTimeout(() => setFlipCoin(false), 2000);
    }

    if (props.user.brills === cashedBrills) {
      
    } else if (props.user.brills && props.user.brills > cashedBrills) {
      increaseCoins(props.user.brills);
    } else if (props.user.brills && props.user.brills < cashedBrills) {
      decreaseCoins(props.user.brills);
    } else {
      decreaseCoins(0);
    }
  }

  // get cashed brills
  useEffect(() => {
    if (props.user) {
      const brills = GetUserBrills();
      if (brills) {
        if (brills === currentBrills) {
          animateBrills(brills);
        } else {
          setCurrentBrills(brills, () => animateBrills(brills));
        }
      } else if (props.user.brills) {
        SetUserBrills(props.user.brills);
        setCurrentBrills(props.user.brills, () => { });
      }
    }
    /*eslint-disable-next-line*/
  }, [props.user]);

  if (!props.user) {
    return <div />
  }

  return (
    <div className="brill-intro-container">
      <div className="brills-number">{currentBrills}</div>
      <div className={`brill-coin-container ${flipCoin ? "flip" : ""}`}>
        <BrillIcon popupShown={props.popupShown} onClick={props.onClick} />
      </div>
    </div>
  );
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

export default connect(mapState)(BrillIconAnimated);

