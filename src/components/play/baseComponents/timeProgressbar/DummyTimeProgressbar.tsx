import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import './ProgressbarCountdown.scss';


interface CounterProps {
  value: number;
  deadline?: boolean;
}

const DummyProgressbarCountdown:React.FC<CounterProps> = (props) => {
  let className = 'timer-progressbar';
  if (props.deadline) {
    className += ' deadline-soon';
  }
  return <LinearProgress className={className} variant="determinate" value={props.value} />;
}

export default DummyProgressbarCountdown;
