import React from "react";

import ProgressbarCountdown from "./ProgressbarCountdown";
import { BrickLengthEnum } from "model/brick";
import moment, { Moment } from 'moment';

import { getLiveTime, getPrepareTime, getReviewTime } from "components/play/services/playTimes";

interface CounterProps {
  isLive?: boolean;
  isIntro?: boolean;
  brickLength: BrickLengthEnum;
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
    let duration = getDuration();
    const endTime = moment().add(duration);
    return endTime;
  }

  let {endTime} = props;

  const duration = getDuration().asMilliseconds();

  if (!props.endTime) {
    endTime = getEndTime();
  }

  return <ProgressbarCountdown onEnd={props.onEnd} duration={duration} endTime={endTime} />;
};

export default TimeProgressbar;
