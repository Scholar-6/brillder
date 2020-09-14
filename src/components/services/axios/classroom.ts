import { TeachClassroom } from 'model/classroom';
import { Student } from 'model/user';

import {get} from './index';


export const getClassrooms = async () => {
  try {
    return await get<TeachClassroom[]>("/classrooms");
  } catch {
    return null;
  }
}

export const getStudents = async () => {
  try {
    return await get<Student[]>("/classrooms/students");
  } catch {
    return null;
  }
}
