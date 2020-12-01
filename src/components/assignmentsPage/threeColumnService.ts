import { AssignmentBrick } from 'model/assignment';
import { ThreeAssignmentColumns, AssignmentBrickData } from './model';

const prepareAssignmentData = (data: any[], assignment: AssignmentBrick, index: number, key: number, row: number) => {
  data.push({
    brick: assignment.brick, key, index, row, assignmentId: assignment.id, status: assignment.status, isInvitation: assignment.isInvitation
  } as AssignmentBrickData);
}

export const prepareVisibleThreeColumnAssignments = (pageSize: number, sortedIndex: number, threeColumns: ThreeAssignmentColumns) => {
  let data: AssignmentBrickData[] = [];
  let count = 0;

  for (let i = 0 + sortedIndex; i < (pageSize / 3) + sortedIndex; i++) {
    let assignment = threeColumns.red.finalAssignments[i];
    let row = i - sortedIndex;
    if (assignment) {
      prepareAssignmentData(data, assignment, i, count, row);
      count++;
    } else {
      prepareAssignmentData(data, { brick: {}} as AssignmentBrick, i, count, row);
      count++;
    }
    assignment = threeColumns.yellow.finalAssignments[i];
    if (assignment) {
      prepareAssignmentData(data, assignment, i, count, row);
      count++;
    } else {
      prepareAssignmentData(data, { brick: {}} as AssignmentBrick, i, count, row);
      count++;
    }
    assignment = threeColumns.green.finalAssignments[i];
    if (assignment) {
      prepareAssignmentData(data, assignment, i, count, row);
      count++;
    } else {
      prepareAssignmentData(data, { brick: {}} as AssignmentBrick, i, count, row);
      count++;
    }
  }
  return data;
}
