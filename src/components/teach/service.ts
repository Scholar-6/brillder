import { StripeCardNumberElement } from "@stripe/stripe-js";
import axios from "axios";
import { Subject } from "model/brick";
import { User } from "model/user";

import { MUser } from "./model";

export interface ClassroomApi {
  created: string;
  id: number;
  name: string;
  subjectId: number;
  subject: Subject;
  status: number;
  students: MUser[];
  updated: string;
  isActive: boolean;
  assignmentsCount?: number;
  studentsInvitations?: MUser[];
  teacher?: User;
  teachers: User[];
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
 * Get all classrooms
 * return list of classrooms if success or null if failed
 */
export const getAllClassrooms = async () => {
  try {
    const res = await axios.get(process.env.REACT_APP_BACKEND_HOST + "/classrooms", {
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
 * Get all admin classrooms
 * return list of classrooms if success or null if failed
 */
 export const getAllAdminClassrooms = async (dateFilter: number) => {
  try {
    const res = await axios.get(process.env.REACT_APP_BACKEND_HOST + "/adminOrInstitution/getAllClassrooms/" + dateFilter, {
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
