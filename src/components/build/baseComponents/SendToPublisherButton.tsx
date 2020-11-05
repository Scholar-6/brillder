import React from "react";

import "./PlayButton.scss";
import SpriteIcon from "components/baseComponents/SpriteIcon";

export interface ButtonProps {
}

const SendToPublisherButton: React.FC<ButtonProps> = props => {
  return (
    <div className="send-to-publisher-button" onClick={async () => {
      //await returnToAuthor(props.brickId);
      //props.history.push(map.BackToWorkBuildTab);
    }}>
      <SpriteIcon name="send" />
    </div>
  );
};

export default SendToPublisherButton;
