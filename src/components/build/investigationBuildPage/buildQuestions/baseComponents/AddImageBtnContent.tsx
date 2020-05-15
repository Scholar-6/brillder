import React from "react";
import { Grid } from "@material-ui/core";
import AddCircleIcon from '@material-ui/icons/AddCircle';

import './AddImageBtnContent.scss';


const AddImageBtnContent: React.FC = () => {
  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignContent="center"
      className="answer-image-drop-content drop-placeholder"
    >
      <AddCircleIcon /> <span>jpg.</span>
    </Grid>
  );
};

export default AddImageBtnContent;
