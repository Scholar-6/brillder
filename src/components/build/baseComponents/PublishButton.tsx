import React from "react";

import { publishBrick } from "services/axios/brick";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { Brick } from "model/brick";
import SendToPublisherDialog from "./dialogs/SendToPublisherDialog";
import PublishSuccessDialog from "components/baseComponents/dialogs/PublishSuccessDialog";
import APublishSuccessDialog from "components/baseComponents/dialogs/APublishSuccessDialog";

export interface ButtonProps {
  disabled: boolean;
  history: any;
  brick: Brick;
  label?: string;
  onFinish(): void;
  goToPersonal(): void;
}

enum PublishStatus {
  None,
  Publishing,
  Published,
  Hidden
}

const PublishButton: React.FC<ButtonProps> = props => {
  const [state, setState] = React.useState(PublishStatus.None);
  const { brick } = props;
  const [hovered, setHover] = React.useState(false);

  let className = 'build-publish-button';
  if (props.disabled) {
    className += ' disabled';
  } else {
    className += ' active';
  }

  const publish = async () => {
    const success = await publishBrick(brick.id);
    if (success) {
      setState(PublishStatus.Published)
    }
  }

  const renderTooltip = () => {
    return <div className="custom-tooltip">{brick.adaptedFrom ? 'Upload' : 'Publish'}</div>
  }

  const successPopup = () => {
    if (brick.adaptedFrom) {
      return (
        <APublishSuccessDialog
          isOpen={state === PublishStatus.Published}
          close={() => {
            setState(PublishStatus.Hidden);
            props.onFinish();
          }}
          toPersonal={() => {
            setState(PublishStatus.Hidden);
            props.goToPersonal();
          }}
        />
      )
    } else {
      return (
        <PublishSuccessDialog
          isOpen={state === PublishStatus.Published}
          isPersonal={!brick.isCore}
          close={() => {
            setState(PublishStatus.Hidden);
            props.onFinish();
          }}
        />);
    }
  }

  return (
    <div className="build-publish-button-container">
      <div className={`custom-hover-container ${(hovered && !props.disabled) ? 'hovered' : ''}`}></div>
      <div className={className} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        onClick={() => {
          if (!props.disabled) {
            if (props.brick.isCore) {
              setState(PublishStatus.Publishing);
            } else {
              publish();
            }
          }
        }}
      >
        <SpriteIcon name="award" />
        {hovered && renderTooltip()}
      </div>
      <SendToPublisherDialog
        isOpen={state === PublishStatus.Publishing}
        isPublishing={true}
        isCore={brick.isCore}
        close={() => setState(PublishStatus.None)}
        submit={publish}
      />
      {successPopup()}
    </div>
  );
};

export default PublishButton;
