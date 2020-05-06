import React, { Component } from "react";
import Avatar from '@material-ui/core/Avatar';

import './HorizontalShufflePreview.scss';
import { Grid } from "@material-ui/core";


class HorizontalShufflePreview extends Component<any, any> {
  render() {
    return (
      <div className="phone-preview-component horizontal-shuffle-preview">
        <Grid container justify="center" className="small-text">
          Reorder the following symbols to express a formula used in Statistics.
        </Grid>
        <Grid container justify="center">
            <button>E</button>
            <button>(<span>X</span>)</button>
            <button>=</button>
            <button>&#956;</button>
        </Grid>
      </div>
    )
  }
}

export default HorizontalShufflePreview;
