import axios from "axios";

import { User } from "model/user";

export interface ClassroomApi {
  created: string;
  id: number;
  name: string;
  status: number;
  students: User[];
  updated: string;
  isActive: boolean;
}

/**
 * Create Classroom
 * @param name name of classroom
 * return classroom object if success or null if failed
 */
export const createClass = (name: string) => {
  return axios.post(
    process.env.REACT_APP_BACKEND_HOST + "/classroom",
    { name },
    { withCredentials: true }
  ).then((res) => {
    if (res.data) {
      let classroom = res.data as ClassroomApi;
      classroom.students = [];
      return res.data as ClassroomApi;
    }
    return null;
  }).catch(() => null);
}

/**
 * Get all classrooms
 * return list of classrooms if success or null if failed
 */
export const getAllClassrooms = () => {
  return axios.get(process.env.REACT_APP_BACKEND_HOST + "/classrooms", {
    withCredentials: true,
  }).then(res => {
    if (res.data) {
      return res.data as ClassroomApi[];
    }
    return null;
  }).catch(() => null);
}

/**
 * Get all classrooms
 * return list of classrooms if success or null if failed
 */
export const getAllStudents = () => {
  return axios.get(process.env.REACT_APP_BACKEND_HOST + "/classrooms/students", {
    withCredentials: true,
  }).then(res => {
    if (res.data) {
      return res.data as ClassroomApi[];
    }
    return null;
  }).catch(() => null);
}

/**
 * Assign students to class
 * @param classroomId classroom id
 * @param students students to assign. all should have id
 */
export const assignStudentsToClassroom = (classroomId: number, students: any[]) => {
  let studentsIds = students.map(s => s.id);
  return axios.post(
    process.env.REACT_APP_BACKEND_HOST + "/classrooms/students/" + classroomId,
    { studentsIds },
    { withCredentials: true}
  ).then(res => {
    if (res.status === 200) {
      return true;
    }
    return false;
  }).catch(() => false);
}
