import { ClassroomApi } from 'components/teach/service';
import { TeachClassroom } from 'model/classroom';
import { Student } from 'model/user';

import { get, put, del } from './index';

export const updateClassroom = async (
  classroom: ClassroomApi
) => {
  try {
    await put("/classroom", { ...classroom });
    return true;
  } catch (e) {
    return false
  }
}

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
