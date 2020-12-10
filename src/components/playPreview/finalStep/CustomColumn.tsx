import React from "react";
import { Grid } from "@material-ui/core";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface CustomColumnProps {
  icon: string;
  title: string;
  label: string;
  size: 3 | 5;
  onClick(): void;
}

const CustomColumn: React.FC<CustomColumnProps> = (props) => {
  return (
    <Grid container item xs={props.size} justify="center">
      <div>
        <div className="button-container" onClick={props.onClick}>
          <SpriteIcon name={props.icon} />
        </div>
        <div className="link-text">{props.title}</div>
        <div className="link-description">{props.label}</div>
      </div>
    </Grid>
  );
};

export default CustomColumn;
