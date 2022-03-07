import { GetUserBrills, SetUserBrills } from 'localStorage/play';
import { User } from 'model/user';
import React, { useEffect } from 'react';
import { useStateWithCallbackLazy } from 'use-state-with-callback';
import BrillIcon from './BrillIcon';

interface Props {
  user: User;
}

const BrillIconAnimated: React.FC<Props> = (props) => {
  const [currentBrills, setCurrentBrills] = useStateWithCallbackLazy(0);
  const [flipCoin, setFlipCoin] = React.useState(false);

  const animateBrills = (low: number) => {
    if (props.user.brills && props.user.brills > low) {
      const high = props.user.brills;

      let step = Math.round((props.user.brills - low) / 20);
      if (step < 2) {
        step = 2;
      }
      setFlipCoin(true);
      const interval = setInterval(() => {
        if (low < high - step) {
          low += step;
          setCurrentBrills(low, () => {});
        } else {
          setCurrentBrills(high, () => {});
          SetUserBrills(high);
          clearInterval(interval);
        }
      }, 100);

      setTimeout(() => {
        setFlipCoin(false);
      }, 2000);
    }
  }

  // get cashed brills
  useEffect(() => {
    if (props.user) {
      const brills = GetUserBrills();
      if (brills) {
        setCurrentBrills(brills, () => {
          animateBrills(brills);
        });

        if (props.user.brills && props.user.brills > brills) {
          setTimeout(() => {
          }, 200);
        }
      } else if (props.user.brills) {
        SetUserBrills(props.user.brills);
        setCurrentBrills(props.user.brills, () => {});
      }
    }
    /*eslint-disable-next-line*/
  }, []);

  if (!props.user) {
    return <div />
  }

  return (
    <div className="brill-intro-container">
      <div className="brills-number">{currentBrills}</div>
      <div className={`brill-coin-container ${flipCoin ? "flip" : ""}`}>
        <BrillIcon />
      </div>
    </div>
  );
}

export default BrillIconAnimated;

