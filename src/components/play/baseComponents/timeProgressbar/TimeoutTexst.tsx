import React, { useEffect } from 'react';
import { formatTwoLastDigits } from 'components/services/brickService';


interface Props {
  minutes?: number;
  minutesDown: number;
  secondsDown: number;
  hovered: boolean;
}

const TimeoutText: React.FC<Props> = props => {
  const [timeShown, setTimeshown] = React.useState(true);

  const textShowtimeDuration = 10700;
  const intervalDuration = 120000;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTimeshown(false);
    }, textShowtimeDuration);

    const interval = setInterval(() => {
      setTimeshown(true);
    }, intervalDuration);

    const interval2 = setInterval(() => {
      setTimeshown(false);
    }, intervalDuration + textShowtimeDuration);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
      clearInterval(interval2);
    }
  }, []);

  if (timeShown || props.hovered) {
    return (
      <div className="minutes-footer fixed">{props.minutesDown}:{formatTwoLastDigits(props.secondsDown)}/{props.minutes}:00</div>
    );
  }
  return <div />;
}

export default TimeoutText;
