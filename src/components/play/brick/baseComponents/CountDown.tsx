import React from "react";

import "./BrickCounter.scss";
import CounterDown from "./CounterDown";
import { BrickLengthEnum } from "model/brick";
import Clock from "./Clock";
const moment = require("moment");

interface CounterProps {
  isLive: boolean;
  brickLength: BrickLengthEnum;
  onEnd(): void;
}

const CountDown: React.FC<CounterProps> = (props) => {
  const getLiveDuration = () => {
    let durationMins = 8;
    if (props.brickLength === BrickLengthEnum.S40min) {
      durationMins = 16;
    } else if (props.brickLength === BrickLengthEnum.S60min) {
      durationMins = 24;
    }
    return moment.duration(durationMins, "minutes");
  };

  const getReviewDuration = () => {
    let durationMins = 3;
    if (props.brickLength === BrickLengthEnum.S40min) {
      durationMins = 6;
    } else if (props.brickLength === BrickLengthEnum.S60min) {
      durationMins = 9;
    }
    return moment.duration(durationMins, "minutes");
  }

  let duration = {};
  if (props.isLive) {
    duration = getLiveDuration();
  } else {
    duration = getReviewDuration();
  }

  return (
    <div className="intro-header">
      <CounterDown onEnd={props.onEnd} duration={duration} />
      <Clock brickLength={props.brickLength} />
    </div>
  );
};

export default CountDown;
