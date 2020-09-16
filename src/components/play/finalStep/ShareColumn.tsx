import React from "react";
import { Grid } from "@material-ui/core";



import sprite from "assets/img/icons-sprite.svg";

interface ShareProps {
  size?: 3 | 4 | 5 | 6 | 7 | 8;
  onClick(): void;
}

const ShareColumn: React.FC<ShareProps> = props => {
  return (
    <Grid container item xs={props.size ? props.size : 5} justify="center">
      <div>
        <div className="button-container">
          <svg className="svg active" onClick={props.onClick}>
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#share"} />
          </svg>
        </div>
        <div className="link-text">Share</div>
        <div className="link-description">with external users via</div>
        <div className="link-description">email and social media</div>
      </div>
    </Grid>
  );
};

export default ShareColumn;
