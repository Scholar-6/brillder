import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface InviteProps {
  onClick(): void;
}

const ExitButton: React.FC<InviteProps> = props => {
  return (
    <div className="action-footer" style={{bottom: '10.5vh'}}>
      <div></div>
      <div className="direction-info">
        Exit
      </div>
      <div style={{marginLeft: 0, marginRight: '1.7vw'}}>
        <button
          type="button"
          className="play-preview svgOnHover roller-red"
          onClick={props.onClick}
        >
          <SpriteIcon name="roller-home" className="w80 h80 active m-l-02" />
        </button>
      </div>
    </div>
  );
};

export default ExitButton;
