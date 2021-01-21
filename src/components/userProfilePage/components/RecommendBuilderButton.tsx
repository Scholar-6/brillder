
import SpriteIcon from "components/baseComponents/SpriteIcon";
import React from "react";

interface ButtonProps {}

const RecommendButton: React.FC<ButtonProps> = () => {
  return (
    <div className="recomend-button">
      <SpriteIcon name="user-plus" />
      Recommend a builder
    </div>
  );
}

export default RecommendButton;
