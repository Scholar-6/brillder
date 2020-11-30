import { Brick } from 'model/brick';
import { AssignmentBrickData } from './model';
import { AssignmentBrick } from "model/assignment";

export const checkPrivateBrick = (b: Brick) => {
  return !b.isCore;
}

export const filterByPrivate = (bricks: Brick[]) => {
  return bricks.filter(b => checkPrivateBrick(b));
}

export const checkCoreBrick = (b: Brick) => {
  return b.isCore === true;
}

export const prepareVisibleAssignments = (sortedIndex: number, pageSize: number, assignments: AssignmentBrick[]) => {
  let data: AssignmentBrickData[] = [];
  let count = 0;
  for (let i = 0 + sortedIndex; i < pageSize + sortedIndex; i++) {
    const assignment = assignments[i];
    if (assignment) {
      let row = Math.floor(count / 3);
      data.push({
        brick: assignment.brick, key: i, index: count, assignmentId: assignment.id, status: assignment.status, row
      } as AssignmentBrickData);
      count++;
    }
  }
  return data;
}
