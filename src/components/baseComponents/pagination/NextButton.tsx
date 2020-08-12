import React from "react";

import sprite from "assets/img/icons-sprite.svg";

interface NextButtonProps {
  isShown: boolean;
  onClick(): void;
}

const NextButton: React.FC<NextButtonProps> = props => {
  if (!props.isShown) { return <div></div>; }
  return (
    <button
      className={"btn btn-transparent next-button svgOnHover active"}
      onClick={props.onClick}
    >
      <svg className="svg w100 h100 active">
        {/*eslint-disable-next-line*/}
        <use href={sprite + "#arrow-down"} />
      </svg>
    </button>
  );
}

export default NextButton;
