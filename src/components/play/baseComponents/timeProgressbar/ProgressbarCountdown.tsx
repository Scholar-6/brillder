import React, { Component } from 'react';
import { Moment } from 'moment';
import LinearProgress from '@material-ui/core/LinearProgress';
import './ProgressbarCountdown.scss';
let moment = require('moment');


interface CounterProps {
  endTime: Moment;
  onEnd(): void;
}

interface CounterState {
  milliseconds: number;
  isCounting: boolean;
  timerInterval: number;
  isDeadlineSoon: boolean;
}

class ProgressbarCountdown extends Component<CounterProps, CounterState> {
  constructor(props: CounterProps) {
    super(props);

    this.state = {
      milliseconds: 0,
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
      let milliseconds = (Math.round(dif.milliseconds() / 10));
      this.setState({ milliseconds, isCounting: true });
      if (dif._milliseconds < 1000) {
        this.props.onEnd();
        clearInterval(this.state.timerInterval);
      }
      if (dif._milliseconds < 31000 && this.state.isDeadlineSoon === false) {
        this.setState({ ...this.state, isDeadlineSoon: true })
      }
    }, 1000);
  }

  render() {
    let className = 'timer-progressbar';
    if (this.state.isDeadlineSoon) {
      className += ' deadline-soon';
    }
    return (
      <LinearProgress className={className} variant="determinate" value={50} />
    );
  }
}

export default ProgressbarCountdown;
