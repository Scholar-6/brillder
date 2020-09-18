import React from "react";
import { Grid } from "@material-ui/core";

import sprite from "assets/img/icons-sprite.svg";

interface InviteProps {
  size?: 3 | 4 | 5 | 6 | 7 | 8;
  firstLabel?: string;
  secondLabel?: string;
  onClick(): void;
}

const InviteColumn: React.FC<InviteProps> = props => {
  return (
    <Grid container item xs={props.size ? props.size : 5} justify="center">
      <div>
        <div className="button-container" onClick={props.onClick}>
          <svg className="svg active inline-button">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#user-plus"} />
          </svg>
        </div>
        <div className="link-text">Invite</div>
        <div className="link-description">
          {props.firstLabel ? props.firstLabel : "internal users"}
        </div>
        <div className="link-description">
          {props.secondLabel ? props.secondLabel : "to play this brick"}
        </div>
      </div>
    </Grid>
  );
};

export default InviteColumn;
