import React from "react";
import { useHistory } from 'react-router-dom';

import './previousButton.scss';
import { Grid } from "@material-ui/core";

function PreviousButton({ to }: any) {
  const history = useHistory()

  const prev = () => {
    history.push(to);
  }

  return (
    <Grid container justify="center" className="tutorial-prev-container">
      <img alt="" src="/feathericons/chevron-up-orange.png" onClick={prev} />
    </Grid>
  );
}

export default PreviousButton
