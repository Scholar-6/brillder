import { AssignmentBrick, AssignmentBrickStatus } from "model/assignment";

export const isAssignmentsTab = (a: AssignmentBrick) => {
  return a.status === AssignmentBrickStatus.ToBeCompleted;
}

export const isCompletedTab = (a: AssignmentBrick) => {
  return a.status !== AssignmentBrickStatus.ToBeCompleted;
}

export const getAssignmentsTabCount = (assignments: AssignmentBrick[]) => {
  let count = 0;
  for (let a of assignments) {
    if (isAssignmentsTab(a)) {
      count += 1;
    }
  }
  return count;
}

export const getCompletedTabCount = (assignments: AssignmentBrick[]) => {
  let count = 0;
  for (let a of assignments) {
    if (isCompletedTab(a)) {
      count += 1;
    }
  }
  return count;
}

export interface ClassroomCountResult {
  assignmentsTabCount: number;
  completedTabCount: number;
}

export const countClassAssignments = (classroomId: number, assignments: AssignmentBrick[]): ClassroomCountResult => {
  let assignmentsTabCount = 0;
  let completedTabCount = 0;
  for (let a of assignments) {
    if (a.classroom?.id === classroomId) {
      if (isAssignmentsTab(a)) {
        assignmentsTabCount += 1;
      } else {
        completedTabCount += 1;
      }
    }
  }
  return { assignmentsTabCount, completedTabCount };
}

export const filter = (assignments: AssignmentBrick[], classroomId: number) => {
  let asins = assignments;
  if (classroomId > 0) {
    asins = assignments.filter(s => s.classroom?.id === classroomId);
  }

  const res = [];
  for (let a of asins) {
    res.push(a);
  }
  return res;
}

export const sortAssignments = (a: AssignmentBrick, b: AssignmentBrick) => {
  if (a.deadline) {
    if (a.deadline && b.deadline) {
      if (new Date(a.deadline).getTime() < new Date(b.deadline).getTime()) {
        return -1;
      } else {
        return 0;
      }
    }
    return -1;
  }
  return 1;
}

export const countClassroomAssignments = (classrooms: any[], assignments: AssignmentBrick[]) => {
  for (let c of classrooms) {
    c.assignmentsBrick = [];
    for (let a of assignments) {
      if (a.classroom && a.classroom.id === c.id) {
        c.assignmentsBrick.push(a);
      }
    }
  }
}