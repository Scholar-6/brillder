import React, { Component } from 'react';
import { Moment } from 'moment';
import LinearProgress from '@material-ui/core/LinearProgress';
import './ProgressbarCountdown.scss';
const moment = require('moment');


interface CounterProps {
  duration: number;
  endTime: Moment;
  minutes?: number;
  onEnd(): void;
}

interface CounterState {
  value: number;
  isCounting: boolean;
  timerInterval: number;
  isDeadlineSoon: boolean;
}

class ProgressbarCountdown extends Component<CounterProps, CounterState> {
  constructor(props: CounterProps) {
    super(props);

    this.state = {
      value: 0,
      isCounting: false,
      timerInterval: this.setTimer(),
      isDeadlineSoon: false
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.timerInterval);
  }

  setValue(difference: number) {
    let dd = this.props.duration - difference;
    console.log(dd / 1000 / 60);
    const value = ((this.props.duration - difference) / this.props.duration) * 100;
    this.setState({ value, isCounting: true });
  }

  setTimer() {
    return setInterval(() => {
      const now = moment();
      const dif = moment.duration(this.props.endTime.diff(now));
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

    return (
      <div className="time-container">
        <LinearProgress className={className} variant="determinate" value={this.state.value} />
        {this.props.minutes ? <div>{this.props.minutes}:00/{this.props.minutes}:00</div> : ''}
      </div>
    );
  }
}

export default ProgressbarCountdown;
