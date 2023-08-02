import { AssignmentBrickData } from './model';
import { AssignmentBrick } from "model/assignment";

export const prepareVisibleAssignment = (assignment: AssignmentBrick) => {
  return {
    brick: assignment.brick,
    assignmentId: assignment.id,
    status: assignment.status,
    deadline: assignment.deadline,
    completedDate: assignment.completedDate,
    teacher: assignment.teacher,
    bestScore: assignment.bestScore
  } as AssignmentBrickData;
}
