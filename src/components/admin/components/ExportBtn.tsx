import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface Props {
  onClick(): void;
}

const ExportBtn: React.FC<Props> = ({onClick}) => {
  return (
    <div className="btn-container">
      <div className="btn btn-green flex-center" onClick={onClick}>
        <div>Export</div>
        <SpriteIcon name="download" />
      </div>
    </div>
  )
}

export default ExportBtn;
