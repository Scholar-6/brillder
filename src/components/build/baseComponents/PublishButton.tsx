import React from "react";

import map from "components/map";
import { publishBrick } from "services/axios/brick";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import SendToPublisherDialog from "./dialogs/SendToPublisherDialog";
import PublishSuccessDialog from "components/baseComponents/dialogs/PublishSuccessDialog";
import { Brick, BrickStatus } from "model/brick";

export interface ButtonProps {
  history: any;
  brick: Brick;
}

enum PublishStatus {
  None,
  Publishing,
  Published,
  Hidden
}

const PublishButton: React.FC<ButtonProps> = props => {
  const [state, setState] = React.useState(PublishStatus.None);
  const {brick} = props;

  if (state !== PublishStatus.Hidden && brick.status !== BrickStatus.Publish) {
    return (
      <div>
        <div className="build-publish-button" onClick={() => setState(PublishStatus.Publishing)}>
          <SpriteIcon name="award" />
        </div>
        <SendToPublisherDialog
          isOpen={state === PublishStatus.Publishing}
          close={() => setState(PublishStatus.None)}
          submit={async () => {
            let success = await publishBrick(brick.id);
            console.log(success);
            if (success) {
              setState(PublishStatus.Published)
            }
          }}
        />
        <PublishSuccessDialog
          isOpen={state === PublishStatus.Published}
          close={() => {
            setState(PublishStatus.Hidden)
          }}
        />
      </div>
    );
  }
  return <div></div>;
};

export default PublishButton;
