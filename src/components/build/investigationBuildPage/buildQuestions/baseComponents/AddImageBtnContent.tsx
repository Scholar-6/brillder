import React from "react";
import { Grid } from "@material-ui/core";

import './AddImageBtnContent.scss';


const AddImageBtnContent: React.FC = () => {
  return (
    <Grid
      container
      direction="row"
      justify="center"
      className="answer-image-drop-content drop-placeholder"
    >
      <Grid container className="answer-image-drop-button" direction="row">
        <Grid xs={6}>
          <img alt="" className="plus-image" src="/feathericons/plus-white.png" />
        </Grid>
        <Grid xs={6}>
          <span>jpg.</span>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AddImageBtnContent;
