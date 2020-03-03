import React from "react";
import { useHistory } from 'react-router-dom';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { IconButton } from "material-ui";
import { Grid } from "@material-ui/core";


function PreviousButton({ to }: any) {
  const history = useHistory()

  const prev = () => {
    history.push(to);
  }

  return (
    <Grid container justify="flex-start" item xs={6}>
      <IconButton className="tutorial-next-button" onClick={prev} aria-label="next">
        <ArrowForwardIosIcon className="tutorial-prev-icon rotate-180" />
      </IconButton>
    </Grid>
  );
}

export default PreviousButton
