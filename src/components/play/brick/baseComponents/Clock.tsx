import React from "react";

import "./BrickCounter.scss";
import sprite from "../../../../assets/img/icons-sprite.svg";
import { BrickLengthEnum } from "model/brick";

interface CounterProps {
  brickLength: BrickLengthEnum;
}

const Clock: React.FC<CounterProps> = (props) => {
  return (
    <div className="clock">
      <div className="clock-image svgOnHover">
        <svg className="svg w100 h100 active">
          <use href={sprite + "#clock"} />
        </svg>
      </div>
      <span className="max-length">{props.brickLength}</span>
    </div>
  );
};

export default Clock;
