import { AssignmentBrick } from 'model/assignment';
import { ThreeAssignmentColumns } from '../../model';

export const getLongestColumn = (threeColumns: ThreeAssignmentColumns) => {
  const draftLength = threeColumns.red.finalAssignments.length;
  const reviewLength = threeColumns.yellow.finalAssignments.length;
  const publishLenght = threeColumns.green.finalAssignments.length;
  return Math.max(draftLength, reviewLength, publishLenght);
}

export const hideAssignments = (assignments: AssignmentBrick[]) => {
  return assignments.forEach(a => a.brick.expanded = false);
}
