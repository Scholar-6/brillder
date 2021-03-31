import React, { Component } from 'react';
import moment, { Moment } from 'moment';
import LinearProgress from '@material-ui/core/LinearProgress';
import './ProgressbarCountdown.scss';


interface CounterProps {
  duration: number;
  endTime: Moment;
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
    let value = ((this.props.duration - difference) / this.props.duration) * 100;
    this.setState({ value, isCounting: true });
  }

  setTimer() {
    return setInterval(() => {
      let now = moment();
      let dif = moment.duration(this.props.endTime.diff(now)) as any;
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
    return <LinearProgress className={className} variant="determinate" value={this.state.value} />;
  }
}

export default ProgressbarCountdown;
