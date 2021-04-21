import React from "react";

import ProgressbarCountdown from "./ProgressbarCountdown";
import { BrickLengthEnum } from "model/brick";
import { Moment } from 'moment';
import { getLiveTime, getPrepareTime, getReviewTime } from "components/play/services/playTimes";
const moment = require("moment");
// TODO: try combining this into import { Moment }, * as moment from 'moment';

interface CounterProps {
  isLive?: boolean;
  isIntro?: boolean;
  brickLength: BrickLengthEnum;
  minutes?: number;
  endTime: any;
  onEnd(): void;
  setEndTime(time: Moment): void;
}

const TimeProgressbar: React.FC<CounterProps> = (props) => {
  const getLiveDuration = () => {
    const durationMins = getLiveTime(props.brickLength);
    return moment.duration(durationMins, "minutes");
  };

  const getReviewDuration = () => {
    const durationMins = getReviewTime(props.brickLength);
    return moment.duration(durationMins, "minutes");
  }

  const getIntroDuration = () => {
    const durationMins = getPrepareTime(props.brickLength);
    return moment.duration(durationMins, "minutes");
  }

  const getDuration = () => {
    if (props.isIntro) {
      return getIntroDuration();
    }
    if (props.isLive) {
      return getLiveDuration();
    } else {
      return getReviewDuration();
    }
  }

  const getEndTime = () => {
    const duration = getDuration();
    const endTime = moment().add(duration);
    return endTime;
  }

  let {endTime} = props;

  const duration = getDuration().asMilliseconds();

  if (!props.endTime) {
    endTime = getEndTime();
  }

  return <ProgressbarCountdown onEnd={props.onEnd} minutes={props.minutes} duration={duration} endTime={endTime} />;
};

export default TimeProgressbar;
