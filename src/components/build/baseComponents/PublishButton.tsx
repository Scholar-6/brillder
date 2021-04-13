import React from "react";

import { publishBrick } from "services/axios/brick";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import PublishSuccessDialog from "components/baseComponents/dialogs/PublishSuccessDialog";
import { Brick } from "model/brick";
import YesNoDialog from "./dialogs/YesNoDialog";

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
      <div className={`custom-hover-container ${(hovered && !props.disabled) ? 'hovered' : ''}`}></div>
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
      <YesNoDialog
        isOpen={state === PublishStatus.Publishing}
        title="Are you convinced this brick meets our publication standards?"
        close={() => setState(PublishStatus.None)}
        submit={async () => {
          let success = await publishBrick(brick.id);
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
