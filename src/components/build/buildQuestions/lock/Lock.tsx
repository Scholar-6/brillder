import React from 'react'
import { Grid } from '@material-ui/core';

import './Lock.scss'
import SpriteIcon from 'components/baseComponents/SpriteIcon';


export interface LockComponentProps {
  disabled: boolean;
  locked: boolean;
  onChange(): void;
}

const LockComponent: React.FC<LockComponentProps> = ({locked, disabled, onChange}) => {
  const [lock, setLock] = React.useState(locked);
  const toggleLock = () => {
    if (disabled) { return; }
    setLock(!lock);
    onChange();
  }
  return (
    <Grid container direction="row">
      <Grid container justify="center" className="lock-container" item sm={12}>
        <div className="container">
          <div className="lock-second-container">
          {
            lock
              ? <SpriteIcon name="lock" className="lock-icon" onClick={toggleLock} />
              : <SpriteIcon name="feather-unlock" className="unlock-icon" onClick={toggleLock} />
          }
          <div className="css-custom-tooltip">
            Lock brick?
          </div>
          </div>
        </div>
      </Grid>
    </Grid>
  );
}

export default LockComponent
