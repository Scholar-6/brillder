import React from "react";

import ProgressbarCountdown from "./ProgressbarCountdown";
import { BrickLengthEnum } from "model/brick";
const moment = require("moment");
// TODO: try combining this into import { Moment }, * as moment from 'moment';

interface CounterProps {
  isLive?: boolean;
  isIntro?: boolean;
  brickLength: BrickLengthEnum;
  startTime: any;
  onEnd(): void;
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

  const getIntroDuration = () => {
    let durationMins = 5;
    if (props.brickLength === BrickLengthEnum.S40min) {
      durationMins = 10;
    } else if (props.brickLength === BrickLengthEnum.S60min) {
      durationMins = 15;
    }
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
