import { Assignment, TeachClassroom } from "model/classroom";
import { TeachListItem } from "../components/ClassroomsList";

export const isArchived = (assignment: Assignment) => {
  return assignment.isArchived === true;
}

export const convertClassAssignments = (items: any[], classroom: TeachClassroom, isArchive: boolean) => {
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

export const getTotalStudentsCount = (classroom?: TeachClassroom | null) => {
  let studentsCount = 0;
  if (classroom) {
    studentsCount = classroom.students.length;
  }
  return studentsCount;
}
