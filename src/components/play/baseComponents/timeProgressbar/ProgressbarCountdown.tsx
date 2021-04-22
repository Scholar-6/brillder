import React, { Component } from 'react';
import { Moment } from 'moment';
import LinearProgress from '@material-ui/core/LinearProgress';
import './ProgressbarCountdown.scss';
import { formatTwoLastDigits } from 'components/services/brickService';
let moment = require('moment');


interface CounterProps {
  minutes?: number;
  duration: number;
  endTime: Moment;
  onEnd(): void;
}

interface CounterState {
  value: number;
  isCounting: boolean;
  timerInterval: number;
  isDeadlineSoon: boolean;

  minutesDown: number;
  secondsDown: number;
}

class ProgressbarCountdown extends Component<CounterProps, CounterState> {
  constructor(props: CounterProps) {
    super(props);

    this.state = {
      value: 0,
      isCounting: false,
      timerInterval: this.setTimer(),
      isDeadlineSoon: false,

      minutesDown: props.minutes ? props.minutes : 0,
      secondsDown: 0,
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.timerInterval);
  }

  setValue(difference: number) {
    const timeLeft = this.props.duration - difference;
    const secondsLeft = timeLeft / 1000;
    const minuteSeconds = Math.floor(secondsLeft % 60);
    const minutesLeft = Math.floor(secondsLeft / 60);
    const value = (timeLeft / this.props.duration) * 100;
    this.setState({ value, minutesDown: minutesLeft, secondsDown: minuteSeconds, isCounting: true });
  }

  setTimer() {
    return setInterval(() => {
      let now = moment();
      let dif = moment.duration(this.props.endTime.diff(now));
      this.setValue(dif._milliseconds);
      if (dif._milliseconds < 1000) {
        this.props.onEnd();
        clearInterval(this.state.timerInterval);
      }
      if (dif._milliseconds < 31000 && this.state.isDeadlineSoon === false) {
        this.setState({ ...this.state, isDeadlineSoon: true })
      }
    }, 300);
  }

  render() {
    let className = 'timer-progressbar';
    if (this.state.isDeadlineSoon) {
      className += ' deadline-soon';
    }
    if (this.props.minutes) {
      return (
        <div className="united-timeprogress">
          <LinearProgress className={className} variant="determinate" value={this.state.value} />
          <div className="minutes-footer fixed">{this.state.minutesDown}:{formatTwoLastDigits(this.state.secondsDown)}/{this.props.minutes}:00</div>
        </div>
      );
    }
    return <LinearProgress className={className} variant="determinate" value={this.state.value} />;
  }
}

export default ProgressbarCountdown;
