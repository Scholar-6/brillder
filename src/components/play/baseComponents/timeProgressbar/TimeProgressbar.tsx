import React from "react";

import ProgressbarCountdown from "./ProgressbarCountdown";
import { BrickLengthEnum } from "model/brick";
import { Moment } from 'moment';
import { getLiveTime, getSynthesisTime, getPrepareTime, getReviewTime } from "components/play/services/playTimes";
const moment = require("moment");
// TODO: try combining this into import { Moment }, * as moment from 'moment';

interface CounterProps {
  isLive?: boolean;
  isIntro?: boolean;
  isSynthesis?: boolean;
  stopped?: any;
  brickLength: BrickLengthEnum;
  minutes?: number;
  endTime: any;
  onEnd(): void;
  setEndTime(time: Moment): void;
}

const TimeProgressbar: React.FC<CounterProps> = (props) => {
  let {endTime} = props;

  const getSynthesisDuration = () => {
    const durationMins = getSynthesisTime(props.brickLength);
    return moment.duration(durationMins, "minutes");
  }

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
    if (props.isSynthesis) {
      return getSynthesisDuration();
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
    props.setEndTime(endTime);
    return endTime;
  }

  const duration = getDuration().asMilliseconds();

  if (!props.endTime) {
    endTime = getEndTime();
  }

  if (props.stopped && props.stopped.stopped === true) {
    return <div />;
  }

  return <ProgressbarCountdown onEnd={props.onEnd} minutes={props.minutes} duration={duration} endTime={endTime} />;
};

export default TimeProgressbar;
