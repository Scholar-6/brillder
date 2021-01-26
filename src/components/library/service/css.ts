import { BrickLengthEnum } from "model/brick";
import { SubjectAssignments } from "../model";

export const getSubjectWidth = (subjectAssignment: SubjectAssignments) => {
  const paddingWidth = 0.4 * 2;
  const marginWidth = 0.2 * 2;
  const baseWidth = 0.8;
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
