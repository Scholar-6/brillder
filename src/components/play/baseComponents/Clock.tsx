import React from "react";

import "./Clock.scss";
import { BrickLengthEnum } from "model/brick";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface CounterProps {
  brickLength: BrickLengthEnum;
}

const Clock: React.FC<CounterProps> = (props) => {
  return (
    <div className="play-clock">
      <div className="clock-image svgOnHover">
        <SpriteIcon name="clock" className="w100 h100 active" />
      </div>
      <span className="max-length">{props.brickLength}</span>
    </div>
  );
};

export default Clock;
