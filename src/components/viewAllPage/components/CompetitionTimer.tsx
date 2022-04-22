import React, { useEffect } from 'react';
import { Competition } from 'model/competition';

interface Props {
  competition: Competition;
}

const CompetitionTimer: React.FC<Props> = ({ competition }) => {
  const [days, setDays] = React.useState(-1);
  const [hours, setHours] = React.useState(-1);
  const [minutes, setMinutes] = React.useState(-1);
  const [seconds, setSeconds] = React.useState(-1);

  const setAllTime = () => {
    const second = 1000,
      minute = second * 60,
      hour = minute * 60,
      day = hour * 24;

    const end = new Date(competition.endDate).getTime();
    const now = new Date().getTime();
    const distance = end - now;

    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour) > 0 ? Math.floor((distance % day) / hour) : 0;
    const minutes = Math.floor((distance % hour) / minute) > 0 ? Math.floor((distance % hour) / minute) : 0;
    const seconds = Math.floor((distance % minute) / second) > 0 ? Math.floor((distance % minute) / second) : 0;

    setDays(days);
    setHours(hours);
    setMinutes(minutes);
    setSeconds(seconds);
  }

  useEffect(() => {
    const interval = setInterval(setAllTime, 1000);

    return () => { clearInterval(interval) }
    /*eslint-disable-next-line*/
  }, []);

  return (
    <div>
      <div className="background-d33" />
      <div className="cover-competition-timer-d33">
        {days > 0 && <span>{days}<span className="time-character">D</span></span>}
        {hours >= 0 && <span>{hours}<span className="time-character">H</span></span>}
        {minutes >= 0 && <span>{minutes}<span className="time-character">M</span></span>}
        {seconds >= 0 && <span>{seconds}<span className="time-character">S</span></span>}
      </div>
    </div>
  )
}

export default CompetitionTimer;
