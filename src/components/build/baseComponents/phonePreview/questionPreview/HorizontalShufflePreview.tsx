import React, { useEffect } from "react";

import './HorizontalShufflePreview.scss';
import { Grid } from "@material-ui/core";


const HorizontalShufflePreview: React.FC<any> = () => {
  const [isGreen, setGreen] = React.useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setGreen(true), 500);
    return () => clearTimeout(timeout);
  });

  return (
    <div className="phone-preview-component horizontal-shuffle-preview">
      <Grid container justify="center" className="small-text">
        Reorder the following symbols to express a formula used in Statistics.
      </Grid>
      <Grid container justify="center" className={isGreen ? 'inside-green' : ''}>
        <button>E</button>
        <button>(<span>X</span>)</button>
        <button>=</button>
        <button>&#956;</button>
      </Grid>
    </div>
  )
}

export default HorizontalShufflePreview;
