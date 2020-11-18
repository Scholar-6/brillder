import React from "react";
import { Grid } from "@material-ui/core";

import sprite from "assets/img/icons-sprite.svg";

interface PublishProps {
  onClick(): void;
}

const SelfPublishColumn: React.FC<PublishProps> = props => {
  return (
    <Grid container item xs={3} justify="center">
      <div>
        <div className="button-container" onClick={props.onClick}>
          <svg className="svg active">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#award"} style={{strokeWidth: 1.5}} />
          </svg>
        </div>
        <div className="link-text">Self Publish</div>
      </div>
    </Grid>
  );
};

export default SelfPublishColumn;
