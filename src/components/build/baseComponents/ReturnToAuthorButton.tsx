import React from "react";

import "./PlayButton.scss";
import map from "components/map";
import { returnToAuthor } from "services/axios/brick";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import ReturnToAuthorDialog from "./dialogs/ReturnToAuthorDialog";

export interface ButtonProps {
  brickId: number;
  history: any;
}

const ReturnToAuthorButton: React.FC<ButtonProps> = props => {
  const [isOpen, setState] = React.useState(false);

  return (
    <div>
      <div className="return-to-author-button" onClick={() => setState(true)}>
        <SpriteIcon name="repeat" />
      </div>
      <ReturnToAuthorDialog
        isOpen={isOpen}
        close={() => setState(false)}
        submit={async () => {
          await returnToAuthor(props.brickId);
          props.history.push(map.BackToWorkBuildTab);
        }}
      />
    </div>
  );
};

export default ReturnToAuthorButton;
