import { AssignmentBrickData } from './model';
import { AssignmentBrick } from "model/assignment";

export const prepareVisibleAssignments = (assignments: AssignmentBrick[]) => {
  let data: AssignmentBrickData[] = [];
  let count = 0;
  for (let assignment of assignments) {
    if (assignment) {
      let row = Math.floor(count / 3);
      data.push({
        brick: assignment.brick,
        index: count,
        assignmentId: assignment.id,
        status: assignment.status,
        row,
        deadline: assignment.deadline,
        completedDate: assignment.completedDate,
        teacher: assignment.teacher,
        bestScore: assignment.bestScore
      } as AssignmentBrickData);
      count++;
    }
  }
  return data;
}
