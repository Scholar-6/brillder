import { TeachClassroom } from 'model/classroom';
import { Student } from 'model/user';

import {get, del} from './index';


export const getClassrooms = async () => {
  try {
    return await get<TeachClassroom[]>("/classrooms");
  } catch {
    return null;
  }
}

export const getStudentClassrooms = async () => {
  try {
    return await get<TeachClassroom[]>("/classrooms/me");
  } catch {
    return null;
  }
}

export const deleteClassroom = async (id: number) => {
  try {
    return await del('/classroom/' + id);
  } catch {
    return false;
  }
}

export const getStudents = async () => {
  try {
    return await get<Student[]>("/classrooms/students");
  } catch {
    return null;
  }
}
