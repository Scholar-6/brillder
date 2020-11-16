import React from "react";

import "./PlayButton.scss";
import map from "components/map";
import { Brick } from "model/brick";
import { returnToAuthor } from "services/axios/brick";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import ReturnToAuthorDialog from "./dialogs/ReturnToAuthorDialog";
import ReturnAuthorSuccessDialog from "components/play/finalStep/dialogs/ReturnAuthorSuccessDialog";

export interface ButtonProps {
  disabled: boolean;
  brick: Brick;
  history: any;
}

const ReturnToAuthorButton: React.FC<ButtonProps> = props => {
  const [isOpen, setState] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [hovered, setHover] = React.useState(false);

  let className = "return-to-author-button";
  if (props.disabled) {
    className += ' disabled';
  } else {
    className += ' active';
  }

  return (
    <div>
      <div className={className} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        onClick={() => {
          if (!props.disabled) {
            setState(true);
          }
        }}
      >
        <SpriteIcon name="repeat" />
        {hovered && <div className="custom-tooltip">Return to Author</div>}
      </div>
      <ReturnToAuthorDialog
        isOpen={isOpen}
        close={() => setState(false)}
        submit={async () => {
          await returnToAuthor(props.brick.id);
          setState(false);
          setSuccess(true);
        }}
      />
      <ReturnAuthorSuccessDialog
        isOpen={success}
        author={props.brick.author}
        close={() => {
          setSuccess(false);
          props.history.push(map.BackToWorkBuildTab);
        }}
      />
    </div>
  );
};

export default ReturnToAuthorButton;
