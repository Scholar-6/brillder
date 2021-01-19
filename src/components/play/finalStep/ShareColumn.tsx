import React from "react";
import { Grid } from "@material-ui/core";

import SpriteIcon from "components/baseComponents/SpriteIcon";

interface ShareProps {
  size?: 3 | 4 | 5 | 6 | 7 | 8;
  onClick(): void;
}

const ShareColumn: React.FC<ShareProps> = props => {
  return (
    <Grid container item xs={props.size ? props.size : 5} justify="center">
      <div>
        <div className="button-container">
          <SpriteIcon name="share" className="active" onClick={props.onClick} />
        </div>
        <div className="link-text">Share with friend</div>
      </div>
    </Grid>
  );
};

export default ShareColumn;
