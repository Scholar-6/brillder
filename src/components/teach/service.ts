import axios from "axios";

export interface ClassroomApi {
  created: string;
  id: number;
  name: string;
  status: number;
  updated: string;
}

/**
 * Create Classroom
 * @param name name of classroom
 * return classroom object if success or null if failed
 */
export const createClass = (name: string) => {
  return axios.post(
    process.env.REACT_APP_BACKEND_HOST + "/classroom",
    {
      name
    },
    { withCredentials: true }
  ).then((res) => {
    if (res.data) {
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

export const assignStudentsToClassroom = (classroomId: number, student: any) => {
  return axios.post(process.env.REACT_APP_BACKEND_HOST + "/classrooms", {
    withCredentials: true,
  }).then(res => {
    console.log(res);
    return res;
  }).catch(() => null);
}
