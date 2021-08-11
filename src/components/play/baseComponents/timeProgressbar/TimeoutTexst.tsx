import React from 'react';
import { formatTwoLastDigits } from 'components/services/brickService';


interface Props {
  minutes?: number;
  minutesDown: number;
  secondsDown: number;
}

const TimeoutText: React.FC<Props> = props => {
  const [timeShown, setTimeshown] = React.useState(true);

  const textShowtimeDuration = 3300;

  setTimeout(() => {
    setTimeshown(false);
    setInterval(() => {
      setTimeshown(true);
      setTimeout(() => {
        setTimeshown(false);
      }, textShowtimeDuration);
    }, 120000);
  }, textShowtimeDuration);

  if (timeShown) {
    return (
      <div className="minutes-footer fixed">{props.minutesDown}:{formatTwoLastDigits(props.secondsDown)}/{props.minutes}:00</div>
    );
  }
  return <div />;
}

export default TimeoutText;
