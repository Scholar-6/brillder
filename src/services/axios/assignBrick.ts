import {post, put} from './index';

export interface AssignClassData {
  classesIds: number[];
  deadline: Date | null;
}

export const assignClasses = async (brickId: number, data: AssignClassData) => {
  try {
    return await post<any[]>(`/brick/assignClasses/${brickId}`, data)
  } catch {
    return false;
  }
}

export const changeDeadline = async (assignmentId: number, deadline: string) => {
  try {
    await put<any[]>(`/brick/assignment/${assignmentId}/updatedeadline/${deadline}`, {})
    return true;
  } catch {
    return false;
  }
}
