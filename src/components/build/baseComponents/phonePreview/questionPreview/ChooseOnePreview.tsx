import React, { Component } from "react";

import './ChooseOnePreview.scss';
import { Grid } from "@material-ui/core";


class ChooseOnePreview extends Component<any, any> {
  render() {
    return (
      <div className="phone-preview-component choose-one-preview">
        <Grid container justify="center" className="small-text">
          Which of the following is a fundamental cell type?
        </Grid>
        <button>Exokaryotic</button>
        <button className="green-button">Eukaryotic</button>
        <button>Protokaryotic</button>
      </div>
    )
  }
}

export default ChooseOnePreview;
