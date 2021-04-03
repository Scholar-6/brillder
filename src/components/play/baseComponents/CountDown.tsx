import React from "react";

import "./BrickCounter.scss";
import CounterDown from "./CounterDown";
import { BrickLengthEnum } from "model/brick";
import Clock from "./Clock";
import moment, { Moment } from 'moment';
import { getLiveTime, getReviewTime } from "../services/playTimes";


interface CounterProps {
  isLive?: boolean;
  brickLength: BrickLengthEnum;
  endTime: any;
  onEnd(): void;
  setEndTime(time: Moment): void;
}

const CountDown: React.FC<CounterProps> = (props) => {
  const getLiveDuration = () => {
    const durationMins = getLiveTime(props.brickLength);
    return moment.duration(durationMins, "minutes");
  };

  const getReviewDuration = () => {
    const durationMins = getReviewTime(props.brickLength);
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
