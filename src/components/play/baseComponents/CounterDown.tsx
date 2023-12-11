import React, { Component } from 'react';

import './BrickCounter.scss';
import { Moment } from 'moment';
let moment = require('moment');


interface CounterProps {
  endTime: Moment;
  onEnd(): void;
}

interface CounterState {
  minutes: string;
  seconds: string;
  milliseconds: string;
  isCounting: boolean;
  timerInterval: number | NodeJS.Timeout;
  isDeadlineSoon: boolean;
}

class CounterDown extends Component<CounterProps, CounterState> {
  constructor(props: CounterProps) {
    super(props);

    this.state = {
      seconds: "00",
      minutes: "00",
      milliseconds: "00",
      isCounting: false,
      timerInterval: this.setTimer(),
      isDeadlineSoon: false
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.timerInterval);
  }

  setTimer() {
    return setInterval(() => {
      let now = moment();
      let dif = moment.duration(this.props.endTime.diff(now));
      let minutes = this.formatTwoLastDigits(dif.hours() * 60 + dif.minutes());
      let seconds = this.formatTwoLastDigits(dif.seconds());
      let milliseconds = this.formatTwoLastDigits(Math.round(dif.milliseconds() / 10));
      this.setState({ minutes, seconds, milliseconds, isCounting: true });
      if (dif.asMilliseconds() < 1000) {
        this.props.onEnd();
        clearInterval(this.state.timerInterval);
      }
      if (dif.asMilliseconds() < 31000 && this.state.isDeadlineSoon === false) {
        this.setState({ ...this.state, isDeadlineSoon: true })
      }
    }, 1000);
  }

  formatTwoLastDigits(twoLastDigits: number) {
    var formatedTwoLastDigits = "";
    if (twoLastDigits < 10) {
      formatedTwoLastDigits = "0" + twoLastDigits;
    } else {
      formatedTwoLastDigits = "" + twoLastDigits;
    }
    return formatedTwoLastDigits;
  }

  renderArrow() {
    return (
      <div className="intro-arrow">
        <img alt="" src="/feathericons/svg/arrow-down-blue.svg" />
      </div>
    );
  }

  render() {
    let className = "brick-counter";
    if (this.state.isDeadlineSoon) {
      className += " text-theme-orange";
    }
    return (
      <div className={className}>
        {this.renderArrow()}
        {this.state.minutes}:{this.state.seconds}
      </div>
    );
  }
}

export default CounterDown;
