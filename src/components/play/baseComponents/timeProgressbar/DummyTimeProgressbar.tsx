import React, { Component } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import './ProgressbarCountdown.scss';


interface CounterProps {
  value: number;
}

class DummyProgressbarCountdown extends Component<CounterProps> {
  render() {
    let className = 'timer-progressbar';
    return <LinearProgress className={className} variant="determinate" value={this.props.value} />;
  }
}

export default DummyProgressbarCountdown;
