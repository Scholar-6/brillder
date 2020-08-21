import React, { Component } from "react";

import './ChooseSeveralPreview.scss';
import { Grid } from "@material-ui/core";


class ChooseSeveralPreview extends Component<any, any> {
  render() {
    return (
      <div className="phone-preview-component choose-several-preview">
        <Grid container justify="center" className="small-text">
          Select the two terms that could be used to describe the geometry of transition metal complexes.
        </Grid>
        <button className="green-button animated">Octahedral</button>
        <button>Polydentate</button>
        <button className="green-button animated">Square Planar</button>
      </div>
    )
  }
}

export default ChooseSeveralPreview;
