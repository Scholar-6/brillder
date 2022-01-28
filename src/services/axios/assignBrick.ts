import { post, put } from './index';

export interface AssignClassData {
  classesIds: number[];
  deadline: Date | null;
}

export interface AssignClassResult {
  success: boolean;
  result: any[];
  error: string;
}

export const assignClasses = async (brickId: number, data: AssignClassData) => {
  try {
    const result = await post<any[]>(`/brick/assignClasses/${brickId}`, data)
    return {
      success: true,
      result,
      error: ''
    } as AssignClassResult;
  } catch (e) {
    var dd = e as any;
    if (dd.response && dd.response.data) {
      return {
        success: false,
        result: [],
        error: dd.response.data
      } as AssignClassResult;
    }
    return {
      success: false,
      result: [],
      error: e
    } as AssignClassResult;
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
