import React from "react";

import sprite from "assets/img/icons-sprite.svg";

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
          <svg className="svg w80 h80 active m-l-02">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#roller-home"} />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ExitButton;
