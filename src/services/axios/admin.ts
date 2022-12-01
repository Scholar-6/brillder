import { PDateFilter } from "components/admin/bricksPlayed/BricksPlayedSidebar";
import { ACSortBy } from "components/admin/classesEvents/ClassesEvents";
import { ClassroomApi } from "components/teach/service";
import { post } from ".";

interface ClassroomsPage {
  classrooms: ClassroomApi[];
  count: number;
}

export interface CACLassroomParams {
  page: number;
  pageSize: number;
  subjectIds: number[];
  sortBy: ACSortBy;
  isAscending: boolean;
}

/**
 * Get all admin classrooms
 * return list of classrooms if success or null if failed
 */
 export const getAllAdminClassrooms = async (dateFilter: PDateFilter, data: CACLassroomParams) => {
  try {
    const classroomPage = await post<ClassroomsPage>("/institution/getAllClassrooms/" + dateFilter, data);
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