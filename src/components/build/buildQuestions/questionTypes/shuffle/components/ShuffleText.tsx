import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";

const ShuffleText = () => {
  return (
    <div className="flex-center">
      <SpriteIcon name="feather-shuffle" />
      <div>These will be randomised in the Play Interface.</div>
    </div>
  );
}

export default ShuffleText;
