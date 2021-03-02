import { BrickLengthEnum } from "model/brick";

export const getReviewTime = (brickLength: BrickLengthEnum) => {
  let timeMinutes = 3;
  if (brickLength === BrickLengthEnum.S40min) {
    timeMinutes = 6;
  } else if (brickLength === BrickLengthEnum.S60min) {
    timeMinutes = 9;
  }
  return timeMinutes;
}

export const getSynthesisTime = (brickLength: BrickLengthEnum) => {
  let timeMinutes = 4;
  if (brickLength === BrickLengthEnum.S40min) {
    timeMinutes = 8;
  } else if (brickLength === BrickLengthEnum.S60min) {
    timeMinutes = 12;
  }
  return timeMinutes;
}
