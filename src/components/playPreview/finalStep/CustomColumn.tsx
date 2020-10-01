import React from "react";
import { Grid } from "@material-ui/core";

import sprite from "assets/img/icons-sprite.svg";

interface CustomColumnProps {
  icon: string;
  title: string;
  label: string;
  size: 3 | 5;
  onClick(): void;
}

const CustomColumn: React.FC<CustomColumnProps> = props => {
  return (
    <Grid container item xs={props.size} justify="center">
      <div>
        <div className="button-container" onClick={props.onClick}>
          <svg className="svg active">
            {/*eslint-disable-next-line*/}
            <use href={sprite + '#' + props.icon} style={{strokeWidth: 1.5}} />
          </svg>
        </div>
        <div className="link-text">{props.title}</div>
        <div className="link-description">
          {props.label}
        </div>
      </div>
    </Grid>
  );
};

export default CustomColumn;
