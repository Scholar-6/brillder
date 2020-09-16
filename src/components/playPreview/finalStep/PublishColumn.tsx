import React from "react";
import { Grid } from "@material-ui/core";

import sprite from "assets/img/icons-sprite.svg";

interface PublishProps {
  firstLabel?: string;
  secondLabel?: string;
  onClick(): void;
}

const PublishColumn: React.FC<PublishProps> = props => {
  return (
    <Grid container item xs={3} justify="center">
      <div>
        <div className="button-container" onClick={props.onClick}>
          <svg className="svg active inline-button">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#award"} />
          </svg>
        </div>
        <div className="link-text">Invite</div>
        <div className="link-description">
          {props.firstLabel ? props.firstLabel : "finternal users"}
        </div>
        <div className="link-description">
          {props.secondLabel ? props.secondLabel : "to play this brick"}
        </div>
      </div>
    </Grid>
  );
};

export default PublishColumn;
