import axios from "axios";
import { Subject } from "model/brick";
import { User } from "model/user";

import { MUser } from "./model";
import { ClassroomChoice } from "./assignments/components/TeachFilterSidebar";

export interface ClassroomApi {
  created: string;
  id: number;
  name: string;
  subjectId: number;
  subject: Subject;
  status: number;
  students: MUser[];
  updated: string;
  creator: User;
  isActive: boolean;
  assignmentsCount?: number;
  studentsInvitations?: MUser[];
  teacher?: User;
  teachers: User[];
  assignments?: any[];
  code?: string;
}

export interface ClassroomsResult {
  result: ClassroomApi[];
  count: number;
}

/**
 * Create Classroom
 * @param name name of classroom
 * return classroom object if success or null if failed
 */
export const createClass = async (name: string) => {
  try {
    const res = await axios.post(
      process.env.REACT_APP_BACKEND_HOST + "/classroom",
      { name },
      { withCredentials: true }
    );
    if (res.data) {
      let classroom = (res.data as ClassroomApi);
      classroom.students = [];
      return res.data as ClassroomApi;
    }
    return null;
  }
  catch (e) {
    return null;
  }
}

/**
 * Get Classroom By Id with assignments
 * @param id id of classroom
 * return classroom object if success or null if failed
 */
export const getClassById = async (id: number) => {
  try {
    const res = await axios.get(
      process.env.REACT_APP_BACKEND_HOST + "/classroom/" + id,
      { withCredentials: true }
    );
    if (res.data) {
      return (res.data as ClassroomApi);
    }
    return null;
  }
  catch (e) {
    return null;
  }
}

/**
 * Get top 100 classrooms
 * return list of classrooms if success or null if failed
 */
export const getAllClassrooms = async () => {
  try {
    const res = await axios.get(process.env.REACT_APP_BACKEND_HOST + "/classroomsV2", {
      withCredentials: true,
    });
    if (res.data) {
      let data = res.data as ClassroomsResult;
      let classrooms = data.result;
      for (let classroom of classrooms) {
        for (let student of classroom.students as MUser[]) {
          student.selected = false;
        }
      }
      return res.data as ClassroomsResult;
    }
    return null;
  }
  catch (e) {
    return null;
  }
}

/**
 * Get top 100 admin classrooms
 * return list of classrooms if success or null if failed
 */
export const getAdminClassrooms = async (type: ClassroomChoice, page: number, domain?: string) => {
  try {
    const res = await axios.post(process.env.REACT_APP_BACKEND_HOST + "/adminClassrooms/", { type, domain, page }, {
      withCredentials: true,
    });
    if (res.data) {
      let data = res.data as ClassroomsResult;
      let classrooms = data.result;
      for (let classroom of classrooms) {
        for (let student of classroom.students as MUser[]) {
          student.selected = false;
        }
      }
      return res.data as ClassroomsResult;
    }
    return null;
  }
  catch (e) {
    return null;
  }
}

/**
 * Get top 100 classrooms by teacher
 * return list of classrooms if success or null if failed
 */
export const getTeacherClassrooms = async (teacherId?: number) => {
  try {
    const res = await axios.get(process.env.REACT_APP_BACKEND_HOST + "/classroomsV2/teacher/" + teacherId, {
      withCredentials: true,
    });
    if (res.data) {
      let classrooms = (res.data as ClassroomApi[]);
      for (let classroom of classrooms) {
        for (let student of classroom.students as MUser[]) {
          student.selected = false;
        }
      }
      return res.data as ClassroomApi[];
    }
    return null;
  }
  catch (e) {
    return null;
  }
}

/**
 * Get all assignments by admin
 * return list of classrooms if success or null if failed
 */
 export const getAllAssignmentsByAdmin = async (dateFilter: number) => {
  try {
    const res = await axios.get(process.env.REACT_APP_BACKEND_HOST + "/institution/getAdminAssignments/" + dateFilter, {
      withCredentials: true,
    });
    if (res.data) {
      return res.data as any[];
    }
    return null;
  }
  catch (e) {
    return null;
  }
}



/**
 * Get classroom Assignments
 * return list of assignments if success or null if failed
 */
 export const getAssignmentsClassrooms = async (classId: number) => {
  try {
    const res = await axios.get(process.env.REACT_APP_BACKEND_HOST + "/classroom/assignments/0/9000/" + classId, {
      withCredentials: true,
    });
    if (res.data) {
      return res.data;
    }
    return null;
  }
  catch (e) {
    return null;
  }
}

/**
 * Search classroms
 * @returns list of classrooms if success or null if failed
 */
export const searchClassrooms = async (searchString: string, searchType?: number) => {
  try {
    const res = await axios.post(
      process.env.REACT_APP_BACKEND_HOST + "/classrooms",
      { searchString, searchType }, { withCredentials: true }
    );
    if (res.data) {
      let classrooms = (res.data as ClassroomApi[]);
      for (let classroom of classrooms) {
        for (let student of classroom.students as MUser[]) {
          student.selected = false;
        }
      }
      return res.data as ClassroomApi[];
    }
    return null;
  }
  catch (e) {
    return null;
  }
}

/**
 * Get all classrooms
 * return list of classrooms if success or null if failed
 */
export const getAllStudents = async () => {
  try {
    const res = await axios.get(process.env.REACT_APP_BACKEND_HOST + "/classrooms/students", {
      withCredentials: true,
    });
    if (res.data) {
      return res.data as ClassroomApi[];
    }
    return null;
  }
  catch (e) {
    return null;
  }
}

/**
 * Assign students to class
 * @param classroomId classroom id
 * @param studentsIds studentIds to assign
 */
export const assignStudentIdsToClassroom = async (classroomId: number, studentsIds: number[]) => {
  try {
    const res = await axios.post(
      process.env.REACT_APP_BACKEND_HOST + "/classrooms/students/" + classroomId,
      { studentsIds },
      { withCredentials: true }
    );
    if (res.status === 200) {
      return true;
    }
    return false;
  }
  catch (e) {
    return false;
  }
}

/**
 * Assign students to class
 * @param classroomId classroom id
 * @param students students to assign. all should have id
 */
export const assignStudentsToClassroom = async (classroomId: number, students: any[]) => {
  const studentsIds = students.map(s => s.id);
  return await assignStudentIdsToClassroom(classroomId, studentsIds);
}

export const unassignStudent = async (classroomId: number, studentId: number) => {
  try {
    const res = await axios.delete(
      `${process.env.REACT_APP_BACKEND_HOST}/classrooms/students/${classroomId}/${studentId}`,
      { withCredentials: true }
    );
    if (res.status === 200) {
      return true;
    }
    return false;
  }
  catch (e) {
    return false;
  }
}
