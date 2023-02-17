
import React from "react";
import map from "components/map";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface ButtonProps {
  history: any;
}

const SharePersonalBrickButton: React.FC<ButtonProps> = (props) => {
  return (
    <div className="share-brick-button" onClick={() => props.history.push(map.ShareBricksPage)}>
      <SpriteIcon name="share-red-filled" />
      Share Personal Bricks
    </div>
  )
}

export default SharePersonalBrickButton;
