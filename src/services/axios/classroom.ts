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

export const getClassroomByCode = async (code: string) => {
  try {
    return await get<any>("/classroom/code/" + code);
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

export const archiveClassroom = async (id: number) => {
  try {
    return await put('/classroom/archive/' + id, {});
  } catch {
    return false;
  }
}

export const unarchiveClassroom = async (id: number) => {
  try {
    return await put('/classroom/unarchive/' + id, {});
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

export const assignToClassByEmails = async (classroom: ClassroomApi, emails: string[], withoutEmail?: boolean) => {
  try {
    return await post<any>(`/classrooms/students/${classroom.id}/new`, { emails, withoutEmail });
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

export const getTeachClassInvitations = async () => {
  try {
    return await get<any>('/classrooms/teachInvitations');
  } catch {
    return null;
  }
}

export const teachAcceptClass = async (classroomId: number) => {
  try {
    await post<any>('/classroom/acceptTeacherInvite/' + classroomId, {});
    return true;
  } catch {
    return null;
  }
}

export const teachRejectClass = async (classroomId: number) => {
  try {
    await post<any>('/classroom/rejectTeacherInvite/' + classroomId, {});
    return true;
  } catch {
    return null;
  }
}

export const quickAcceptClassroom = async (classroomId: number) => {
  try {
    const res = await post<any>('/classrooms/quickAssignAccept', { classroomId });
    if (res.status == 200) {
      return true;
    }
    return null;
  } catch {
    return null;
  }
}


