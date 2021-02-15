import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface InviteProps {
  onClick(): void;
}

const ExitButton: React.FC<InviteProps> = props => {
  return (
    <div className="action-footer">
      <div></div>
      <div className="direction-info text-center">
        <h2>Exit</h2>
      </div>
      <div>
        <button
          type="button"
          className="play-preview svgOnHover roller-red"
          onClick={props.onClick}
        >
          <SpriteIcon name="arrow-right" className="w80 h80 active m-l-02" />
        </button>
      </div>
    </div>
  );
};

export default ExitButton;
