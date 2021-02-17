import React from "react";

import ProgressbarCountdown from "./ProgressbarCountdown";
import { BrickLengthEnum } from "model/brick";
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

const TimeProgressbar: React.FC<CounterProps> = (props) => {
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

  const getDuration = () => {
    if (props.isLive) {
      return getLiveDuration();
    } else {
      return getReviewDuration();
    }
  }

  const getEndTime = () => {
    let duration = getDuration();
    const endTime = moment().add(duration);
    return endTime;
  }

  let {endTime} = props;

  const duration = getDuration().asMilliseconds();

  if (!props.endTime) {
    endTime = getEndTime();
  }

  return (
    <ProgressbarCountdown onEnd={props.onEnd} duration={duration} endTime={endTime} />
  );
};

export default TimeProgressbar;
