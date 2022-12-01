import { ClassroomApi } from "components/teach/service";
import { post } from ".";

interface ClassroomsPage {
  classrooms: ClassroomApi[];
  count: number;
}

/**
 * Get all admin classrooms
 * return list of classrooms if success or null if failed
 */
 export const getAllAdminClassrooms = async (dateFilter: number, page: number, pageSize: number) => {
  try {
    const classroomPage = await post<ClassroomsPage>("/institution/getAllClassrooms/" + dateFilter, {
      page,
      pageSize,
    });
    if (classroomPage) {
      for (let classroom of classroomPage.classrooms) {
        if (classroom.assignments) {
          classroom.assignments.sort((a, b) => {
            if (a.assignedDate && b.assignedDate) {
              return new Date(a.assignedDate).getTime() > new Date(b.assignedDate).getTime() ? -1 : 1;
            }
            return -1;
          })
        }
      }
      
      return classroomPage;
    }
    return null;
  }
  catch (e) {
    return null;
  }
}