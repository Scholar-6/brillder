import React from "react";
import { Grid } from "@material-ui/core";

import SpriteIcon from "components/baseComponents/SpriteIcon";

interface PublishProps {
  onClick(): void;
}

const SelfPublishColumn: React.FC<PublishProps> = props => {
  return (
    <Grid container item xs={3} justify="center">
      <div>
        <div className="button-container self-publish-button" onClick={props.onClick}>
          <SpriteIcon name="award" />
        </div>
        <div className="link-text">Self Publish</div>
      </div>
    </Grid>
  );
};

export default SelfPublishColumn;
