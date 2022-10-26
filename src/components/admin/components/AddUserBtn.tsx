import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface Props {
  onClick(): void;
}

const ExportBtn: React.FC<Props> = ({onClick}) => {
  return (
    <div className="btn-container margin-right-small">
      <div className="btn btn-blue flex-center" onClick={onClick}>
        <div>Add User</div>
        <SpriteIcon name="user-plus-g" />
      </div>
    </div>
  )
}

export default ExportBtn;
