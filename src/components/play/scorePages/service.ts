export const prepareDuration = (duration: moment.Duration) => {
  if (duration) {
    const minuteSeconds = duration.seconds();
    const minutesLeft = duration.minutes();
    return minutesLeft + ' mins ' + minuteSeconds + ' seconds';
  }
  return '';
}