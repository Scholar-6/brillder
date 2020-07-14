import React from "react";

import "./Clock.scss";
import sprite from "../../../../assets/img/icons-sprite.svg";
import { BrickLengthEnum } from "model/brick";

interface CounterProps {
  brickLength: BrickLengthEnum;
}

const Clock: React.FC<CounterProps> = (props) => {
  return (
    <div className="play-clock">
      <div className="clock-image svgOnHover">
        <svg className="svg w100 h100 active">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#clock"} />
        </svg>
      </div>
      <span className="max-length">{props.brickLength}</span>
    </div>
  );
};

export default Clock;
