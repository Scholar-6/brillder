import { Assignment, TeachClassroom } from "model/classroom";
import { TeachListItem } from "../components/ClassroomsList";


export const convertClassAssignments = (items: any[], classroom: TeachClassroom, isArchive: boolean) => {
  if (classroom.assignments) {
    for (let assignment of classroom.assignments) {
      let item: TeachListItem = {
        classroom,
        assignment
      };

      if (assignment.isArchived === true) {
        if (isArchive) {
          items.push(item);
        }
      } else {
        if (!isArchive) {
          items.push(item);
        }
      }
    }
  }
}

export const getTotalStudentsCount = (classroom?: TeachClassroom | null) => {
  let studentsCount = 0;
  if (classroom) {
    studentsCount = classroom.students.length;
  }
  return studentsCount;
}

export const isDeadlinePassed = (assignment: Assignment) => {
  if (!assignment.deadline) { return false; }
  const endTime = new Date(assignment.deadline).getTime();
  const nowTime = new Date().getTime();
  if (endTime < nowTime) {
    return true;
  }
  return false;
}

export const getClassAssignedCount = (classroom: any) => {
  if (classroom.assignmentsCount) {
    return parseInt(classroom.assignmentsCount);
  } else if (classroom.assignments) {
    return classroom.assignments.length;
  }
  return 0;
}

export const getArchivedAssignedCount = (classroom: any) => {
  if (classroom.archivedAssignmentsCount) {
    return parseInt(classroom.archivedAssignmentsCount);
  } else if (classroom.assignments) {
    let archivedCount = 0;
    for (let assignment of classroom.assignments) {
      if (assignment.isArchived) {
        archivedCount += 1;
      }
    }
    return archivedCount;
  }
  return 0;
}