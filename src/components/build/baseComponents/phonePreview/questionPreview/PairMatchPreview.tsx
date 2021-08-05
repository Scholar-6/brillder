import React, { useEffect } from "react";

import './PairMatchPreview.scss';
import { Grid } from "@material-ui/core";


const PairMatchPreview: React.FC<any> = () => {
  const [isGreen, setGreen] = React.useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setGreen(true), 500);
    return () => clearTimeout(timeout);
  });

  return (
    <div className="phone-preview-component pairmatch-preview">
      <Grid container justify="center" className="small-text">
        A small number of words in the 
        scene are no longer in the current
        use. See if you can match each to
        its correct definition.
      </Grid>
      <Grid container justify="center" className={isGreen ? 'inside-green' : ''}>
      </Grid>
    </div>
  )
}

export default PairMatchPreview;
