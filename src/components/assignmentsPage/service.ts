import { AssignmentBrickData } from './model';
import { AssignmentBrick } from "model/assignment";

export const prepareVisibleAssignments = (sortedIndex: number, pageSize: number, assignments: AssignmentBrick[]) => {
  let data: AssignmentBrickData[] = [];
  let count = 0;
  for (let i = 0 + sortedIndex; i < pageSize + sortedIndex; i++) {
    const assignment = assignments[i];
    if (assignment) {
      let row = Math.floor(count / 3);
      data.push({
        brick: assignment.brick,
        key: i,
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
