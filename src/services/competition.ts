import { Competition } from "model/competition";


export const checkCompetitionActive = (c: Competition) => {
  const timeNow = new Date().getTime();
  const endDate = new Date(c.endDate);
  const startDate = new Date(c.startDate);

  console.log('Competition Dates: ', endDate, startDate, timeNow)

  if (endDate.getTime() > timeNow) {
    if (startDate.getTime() < timeNow) {
      return true;
    }
  }
  return false;
}