import React, { useState } from "react";

import { copyBrick, publishBrick } from "services/axios/brick";
import { Brick } from "model/brick";
import { Question } from "model/question";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import SendToPublisherDialog from "./dialogs/SendToPublisherDialog";
import PublishSuccessDialog from "components/baseComponents/dialogs/PublishSuccessDialog";
import APublishSuccessDialog from "components/baseComponents/dialogs/APublishSuccessDialog";
import CopyBrickDialog from "./dialogs/CopyBrickDialog";

export interface ButtonProps {
  disabled: boolean;
  history: any;
  brick: Brick;
  questions: Question[];
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
  const [open, setOpen] = useState(false);
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
    return <div className="custom-tooltip">{brick.isCore ? 'Publish' : 'Upload'}</div>
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
          draftCopy={async (e) => {
            setState(PublishStatus.Hidden);
            e.preventDefault();
            e.stopPropagation();
            let res = await copyBrick(props.brick, props.questions);
            if (res) {
              setOpen(true);
            }
          }}
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
      <CopyBrickDialog isOpen={open} close={() => {
        setOpen(false);
        props.onFinish();
      }} />
    </div>
  );
};

export default PublishButton;
