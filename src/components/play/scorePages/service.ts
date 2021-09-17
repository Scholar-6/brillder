import moment from "moment";

export const prepareDuration = (duration: moment.Duration) => {
  if (duration) {
    if (typeof duration === 'string') {
      duration = moment.duration(duration);
    }
    const minuteSeconds = duration.seconds();
    const minutesLeft = duration.minutes();
    return minutesLeft + ' mins ' + minuteSeconds + ' seconds';
  }
  return '';
}