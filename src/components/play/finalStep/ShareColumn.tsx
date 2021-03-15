import React from "react";
import { Grid } from "@material-ui/core";

import SpriteIcon from "components/baseComponents/SpriteIcon";

interface ShareProps {
  size?: 3 | 4 | 5 | 6 | 7 | 8;
  onClick(): void;
}

const ShareColumn: React.FC<ShareProps> = props => {
  return (
    <Grid className="share-column" onClick={props.onClick} container item xs={props.size ? props.size : 3} justify="center">
      <div>
        <div className="button-container">
          <SpriteIcon name="feather-share" className="active" />
        </div>
        <div className="link-text" >Share with a friend or colleague</div>
      </div>
    </Grid>
  );
};

export default ShareColumn;
