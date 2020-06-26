import React from 'react';

import './BrickCounter.scss';
import BrickCounter from './BrickCounter';
import sprite from "../../../../assets/img/icons-sprite.svg";
import { Moment } from 'moment';
import { BrickLengthEnum } from "model/brick";

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
      <div className="clock">
        <div className="clock-image svgOnHover">
          <svg className="svg w100 h100 active">
            <use href={sprite + "#clock"} />
          </svg>
        </div>
        <span className="max-length">{props.brickLength}</span>
      </div>
    </div>
  );
}

export default TimerWithClock;
