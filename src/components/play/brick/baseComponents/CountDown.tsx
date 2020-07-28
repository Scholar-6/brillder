import React from "react";

import "./BrickCounter.scss";
import CounterDown from "./CounterDown";
import { BrickLengthEnum } from "model/brick";
import Clock from "./Clock";
import { Moment } from 'moment';
const moment = require("moment");
// TODO: try combining this into import { Moment }, * as moment from 'moment';

interface CounterProps {
  isLive?: boolean;
  brickLength: BrickLengthEnum;
  endTime: any;
  onEnd(): void;
  setEndTime(time: Moment): void;
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

  const getEndTime = () => {
    let duration = {};
    if (props.isLive) {
      duration = getLiveDuration();
    } else {
      duration = getReviewDuration();
    }

    const endTime = moment().add(duration);
    props.setEndTime(endTime);
    return endTime;
  }

  let {endTime} = props;

  if (!props.endTime) {
    endTime = getEndTime();
  }

  return (
    <div className="intro-header">
      <CounterDown onEnd={props.onEnd} endTime={endTime} />
      <Clock brickLength={props.brickLength} />
    </div>
  );
};

export default CountDown;
