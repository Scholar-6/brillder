import { MUser } from 'components/teach/model';
import { ClassroomApi } from 'components/teach/service';
import { TeachClassroom } from 'model/classroom';
import { Student } from 'model/user';

import { get, put, del, post } from './index';

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

export const getClassroomStudents = async (id: number) => {
  try {
    return await get<Student[]>("/classrooms/students/" + id);
  } catch {
    return null;
  }
}

export const getClassInvitations = async (searchString?: string) => {
  try {
    return await post<MUser[]>("/classrooms/studentsInvitations", {});
  } catch {
    return null;
  }
}

export const assignToClassByEmails = async (classroom: ClassroomApi, emails: string[]) => {
  try {
    return await post<any>(`/classrooms/students/${classroom.id}/new`, { emails });
  } catch {
    return null;
  }
}

export const resendInvitation = async (classroom: ClassroomApi, email: string) => {
  try {
    return await post<any>(`/classrooms/students/${classroom.id}/resend`, { email });
  } catch {
    return null;
  }
}

export const inviteTeacher = async (classroomId: number, userIds: number[]) => {
  try {
    await post<any>('/classroom/inviteTeacher/' + classroomId, { userIds });
    return true;
  } catch{
    return null;
  }
}