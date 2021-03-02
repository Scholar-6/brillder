import React from "react";

import ProgressbarCountdown from "./ProgressbarCountdown";
import { BrickLengthEnum } from "model/brick";
import { getSynthesisTime } from 'components/play/services/playTimes';
const moment = require("moment");
// TODO: try combining this into import { Moment }, * as moment from 'moment';

interface CounterProps {
  isIntro?: boolean;
  isSynthesis?: boolean;
  brickLength: BrickLengthEnum;
  startTime: any;
  onEnd(): void;
}

const TimeProgressbar: React.FC<CounterProps> = (props) => {
  const getIntroDuration = () => {
    let durationMins = 5;
    if (props.brickLength === BrickLengthEnum.S40min) {
      durationMins = 10;
    } else if (props.brickLength === BrickLengthEnum.S60min) {
      durationMins = 15;
    }
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
    let duration = getDuration();
    let endTime = moment().add(duration);
    if (startTime) {
      endTime = startTime.add(duration);
    }
    return endTime;
  }

  let {startTime} = props;
  
  const duration = getDuration().asMilliseconds();
  let endTime = getEndTime();


  return <ProgressbarCountdown onEnd={props.onEnd} duration={duration} endTime={endTime} />;
};

export default TimeProgressbar;
