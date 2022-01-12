import { BrickLengthEnum } from "model/brick";
import { isITablet } from "services/phone";
import { SubjectAssignments } from "./model";

export const getSubjectWidth = (subjectAssignment: SubjectAssignments) => {
  if (isITablet()) {
    const paddingWidth = 0.4 * 2;
    const marginWidth = 0.2 * 2;
    const baseWidth = 1.4;
    let width = paddingWidth + 2;
    for (let a of subjectAssignment.assignments) {
      width += marginWidth;
      if (a.brick.brickLength === BrickLengthEnum.S20min) {
        width += baseWidth;
      } else if (a.brick.brickLength === BrickLengthEnum.S40min) {
        width += baseWidth * 2;
      } else if (a.brick.brickLength === BrickLengthEnum.S60min) {
        width += baseWidth * 4;
      }
    }
    console.log(width);
    return width;
  } else {
    const paddingWidth = 0.4 * 2;
    const marginWidth = 0.2 * 2;
    const baseWidth = 0.8;
    let width = paddingWidth + 2;
    for (let a of subjectAssignment.assignments) {
      width += marginWidth;
      if (a.brick.brickLength === BrickLengthEnum.S20min) {
        width += baseWidth;
      } else if (a.brick.brickLength === BrickLengthEnum.S40min) {
        width += baseWidth * 2;
      } else if (a.brick.brickLength === BrickLengthEnum.S60min) {
        width += baseWidth * 4;
      }
    }
    return width;
  }
}

export const getPhoneSubjectWidth = (subjectAssignment: SubjectAssignments) => {
  const paddingWidth = 0.8 * 2;
  const marginWidth = 0.4 * 2;
  const baseWidth = 1.6;
  let width = paddingWidth;
  for (let a of subjectAssignment.assignments) {
    width += marginWidth;
    if (a.brick.brickLength === BrickLengthEnum.S20min) {
      width += baseWidth;
    } else if (a.brick.brickLength === BrickLengthEnum.S40min) {
      width += baseWidth * 2;
    } else if (a.brick.brickLength === BrickLengthEnum.S60min) {
      width += baseWidth * 4;
    }
  }
  return width;
}
