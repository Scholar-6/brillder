import React from "react";
import { useHistory } from 'react-router-dom';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import './ExitButton.scss';
import { Grid } from "@material-ui/core";

const ExitButton: React.FC = () => {
  const history = useHistory()

  return (
    <div className="new-brick-exit-button">
      <Grid container direction="row">
        <ArrowForwardIosIcon className="tutorial-prev-icon rotate-180" />
        <div className="text-container">
          <div className="exit-title">EXIT</div>
          <div className="exit-description">ARE YOU SURE?</div>
        </div>
      </Grid>
      <div className="tutorial-prev-button" onClick={() => history.push('/build')} aria-label="next">
      </div>
    </div>
  );
}

export default ExitButton;
