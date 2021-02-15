
import SpriteIcon from "components/baseComponents/SpriteIcon";
import React from "react";

export enum SortBy {
  None,
  Date,
  Popularity,
}

interface ButtonProps {
  onClick(): void;
}

const CreateOneButton: React.FC<ButtonProps> = (props) => {
  return (
    <div className="create-button" onClick={props.onClick}>
      <SpriteIcon name="trowel" />
      Create a new one
    </div>
  )
}

export default CreateOneButton;
