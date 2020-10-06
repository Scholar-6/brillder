import React from "react";
import { Grid } from "@material-ui/core";
import './AddImageBtnContent.scss';
import SpriteIcon from "components/baseComponents/SpriteIcon";


const AddImageBtnContent: React.FC = () => {
  return (
    <Grid
      container
      direction="row"
      justify="center"
      className="answer-image-drop-content drop-placeholder"
    >
      <div className="answer-image-drop-button svgOnHover">
        <SpriteIcon name="plus-circle" className="plus-image active" />
        <span>jpg</span>
      </div>
    </Grid>
  );
};

export default AddImageBtnContent;
