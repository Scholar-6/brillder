import React from "react";

import "./PlayButton.scss";
import map from "components/map";
import { returnToAuthor } from "services/axios/brick";
import SpriteIcon from "components/baseComponents/SpriteIcon";

export interface ButtonProps {
  brickId: number;
  history: any;
}

const ReturnToAuthorButton: React.FC<ButtonProps> = props => {
  return (
    <div className="return-to-author-button" onClick={async () => {
      await returnToAuthor(props.brickId);
      props.history.push(map.BackToWorkBuildTab);
    }}>
      <SpriteIcon name="repeat" />
    </div>
  );
};

export default ReturnToAuthorButton;
