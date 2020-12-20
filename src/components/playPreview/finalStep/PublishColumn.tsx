import React from "react";
import { Grid } from "@material-ui/core";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface PublishProps {
  onClick(): void;
}

const PublishColumn: React.FC<PublishProps> = (props) => {
  return (
    <Grid container item xs={3} justify="center">
      <div>
        <div className="button-container" onClick={props.onClick}>
          <SpriteIcon name="award" />
        </div>
        <div className="link-text">Publish</div>
        <div className="link-description">to Core Library</div>
      </div>
    </Grid>
  );
};

export default PublishColumn;
