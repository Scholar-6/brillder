import React from "react";

import sprite from "assets/img/icons-sprite.svg";

interface PrevButtonProps {
  isShown: boolean;
  onClick(): void;
}

const PrevButton: React.FC<PrevButtonProps> = props => {
  if (!props.isShown) { return <div></div>; }
  return (
    <button
      className={"btn btn-transparent prev-button svgOnHover active"}
      onClick={props.onClick}
    >
      <svg className="svg w100 h100 active">
        {/*eslint-disable-next-line*/}
        <use href={sprite + "#arrow-up"} />
      </svg>
    </button>
  );
}

export default PrevButton;
