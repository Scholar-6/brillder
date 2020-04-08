import React from 'react'
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { Grid } from '@material-ui/core';

import './Lock.scss'


export interface LockComponentProps {
  locked: boolean;
  onChange(): void;
}

const LockComponent: React.FC<LockComponentProps> = ({locked, onChange}) => {
  const [lock, setLock] = React.useState(locked);
  const toggleLock = () => {
    setLock(!lock);
    onChange();
  }
  return (
    <Grid container direction="row">
      <Grid container justify="center" className="lock-container" item sm={12}>
        <div>
          {
            lock ? <LockIcon className="lock-icon" onClick={toggleLock} /> : <LockOpenIcon className="unlock-icon" onClick={toggleLock} />
          }
        </div>
        <div className="lock-text">L &nbsp;O &nbsp;C &nbsp;K</div>
        <div className="lock-text">P &nbsp;A &nbsp;G &nbsp;E &nbsp;?</div>
      </Grid>
    </Grid>
  );
}

export default LockComponent
