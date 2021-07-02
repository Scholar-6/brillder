import React, { useEffect } from "react";

import ProgressbarCountdown from "./ProgressbarCountdown";
import { BrickLengthEnum } from "model/brick";
import { getPrepareTime, getSynthesisTime } from 'components/play/services/playTimes';
const moment = require("moment");
// TODO: try combining this into import { Moment }, * as moment from 'moment';

interface CounterProps {
  minutes?: number;
  isIntro?: boolean;
  isSynthesis?: boolean;
  brickLength: BrickLengthEnum;
  endTime?: string;
  onEnd(): void;
  setEndTime(endTime: string): void;
}

const TimeProgressbarV2: React.FC<CounterProps> = (props) => {
  const getIntroDuration = () => {
    const durationMins = getPrepareTime(props.brickLength);
    return moment.duration(durationMins, "minutes");
  }

  const getSynthesisDuration = () => {
    const timeMinutes = getSynthesisTime(props.brickLength);
    return moment.duration(timeMinutes, "minutes");
  }

  const getDuration = () => {
    if (props.isIntro) {
      return getIntroDuration();
    }
    if (props.isSynthesis) {
      return getSynthesisDuration();
    }
  }

  const getEndTime = () => {
    const duration = getDuration();
    let endTime = moment().add(duration);
    return endTime;
  }

  useEffect(() => {
    if (!props.endTime) {
      props.setEndTime(getEndTime());
    }
  /*eslint-disable-next-line*/
  }, []);

  const duration = getDuration().asMilliseconds();
  let endTime:any = props.endTime;
  if (!endTime) {
    endTime = getEndTime();
  }
  
  return <ProgressbarCountdown onEnd={props.onEnd} minutes={props.minutes} duration={duration} endTime={endTime} />;
};

export default TimeProgressbarV2;
