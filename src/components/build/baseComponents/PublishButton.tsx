import React from "react";

import { publishBrick } from "services/axios/brick";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import SendToPublisherDialog from "./dialogs/SendToPublisherDialog";
import PublishSuccessDialog from "components/baseComponents/dialogs/PublishSuccessDialog";
import { Brick } from "model/brick";

export interface ButtonProps {
  disabled: boolean;
  history: any;
  brick: Brick;
  onFinish(): void;
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
  const [hovered, setHover] = React.useState(false);

  let className = 'build-publish-button';
  if (props.disabled) {
    className += ' disabled';
  } else {
    className += ' active';
  }

  return (
    <div className="build-publish-button-container">
      <div className={`hover-container ${hovered ? 'hovered' : ''}`}></div>
      <div className={className} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        onClick={() => {
          if (!props.disabled) {
            setState(PublishStatus.Publishing);
          }
        }}
      >
        <SpriteIcon name="award" />
        {hovered && <div className="custom-tooltip">Publish</div>}
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
          setState(PublishStatus.Hidden);
          props.onFinish();
        }}
      />
    </div>
  );
};

export default PublishButton;
