import { PDateFilter } from "components/admin/bricksPlayed/BricksPlayedSidebar";
import { ACSortBy } from "components/admin/classesEvents/ClassesEvents";
import { CDomain } from "components/admin/classesEvents/ClassesSidebar";
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
  domains: string[];
  searchString: string;
}

interface ClassroomStudents {
  emails: string[];
  teacherEmails: string[];
  count: number;
}

export interface CACLassroomSParams {
  subjectIds: number[];
  domains: string[];
  searchString: string;
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

/**
 * Get all admin classrooms students emails
 * return list of classrooms if success or null if failed
 */
export const getAllAdminClassroomsStudents = async (dateFilter: PDateFilter, data: CACLassroomSParams) => {
  try {
    return await post<ClassroomStudents>("/institution/getAllStudentsClassrooms/" + dateFilter, data);
  }
  catch (e) {
    return null;
  }
}

interface UEmail {
  domains: string[];
}

/**
 * Get all creator emails by filters
 * return list of emails if success or null if failed
 */
 export const getAllUniqueEmails = async (dateFilter: PDateFilter, subjectIds: number[]) => {
  try {
    const data = await post<UEmail>("/institution/getUniqueCreatorEmails/" + dateFilter, { subjectIds });
    if (data) {
      const cdomains = data.domains.map(d => { return { name: d, checked: false } as CDomain });
      cdomains.sort((a, b) => {
        if (a.name && b.name) {
          const aT = a.name.toLocaleLowerCase();
          const bT = b.name.toLocaleLowerCase();
          return aT < bT ? -1 : 1;
        }
        return 1;
      });

      return cdomains;
    }
    return [] as CDomain[];
  }
  catch (e) {
    return [] as CDomain[];
  }
}

export interface AdminAddCredits {
  credits: number;
  userIds: number[];
}

export const adminAddCredits = async (data: AdminAddCredits) => {
  try {
    return await post<any>(`/institution/addCredits`, data);
  } catch (e) {
    console.log(e);
    return false;
  }
}
