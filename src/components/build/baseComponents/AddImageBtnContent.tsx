import React from "react";
import { Grid } from "@material-ui/core";
import sprite from "assets/img/icons-sprite.svg";
import './AddImageBtnContent.scss';


const AddImageBtnContent: React.FC = () => {
  return (
    <Grid
      container
      direction="row"
      justify="center"
      className="answer-image-drop-content drop-placeholder"
    >
      <div className="answer-image-drop-button svgOnHover">
        <svg className="plus-image svg active">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#plus-circle"} />
        </svg>
        <span>jpg</span>
      </div>
    </Grid>
  );
};

export default AddImageBtnContent;
