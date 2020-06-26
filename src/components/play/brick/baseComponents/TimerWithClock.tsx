import React from 'react';

import './BrickCounter.scss';
import BrickCounter from './BrickCounter';
import { Moment } from 'moment';
import { BrickLengthEnum } from "model/brick";
import Clock from './Clock';

interface CounterProps {
  isArrowUp?: boolean;
  startTime?: Moment;
  isStopped?: boolean;
  brickLength: BrickLengthEnum;
  onStop?(duration: any): void;
}

const TimerWithClock: React.FC<CounterProps> = (props) => {
  return (
    <div className="intro-header">
      <BrickCounter isArrowUp={props.isArrowUp} isStopped={props.isStopped} onStop={props.onStop} startTime={props.startTime} />
      <Clock brickLength={props.brickLength} />
    </div>
  );
}

export default TimerWithClock;
