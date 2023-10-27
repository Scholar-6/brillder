import { post, put } from './index';

export interface AssignClassData {
  classesIds: number[];
  sendEmail?: boolean;
}

export interface AssignClassResultV2 {
  success: boolean;
  result: {
    existing: any[];
    newAssignments: any[];
  },
  error: string;
}

export interface AssignClassResult {
  success: boolean;
  result: [],
  error: string;
}

export const assignClasses = async (brickId: number, data: AssignClassData) => {
  try {
    const result = await post<any>(`/brick/assignClasses/${brickId}`, data)
    return {
      success: true,
      result,
      error: ''
    } as AssignClassResultV2;
  } catch (e) {
    var dd = e as any;
    if (dd.response && dd.response.data) {
      return {
        success: false,
        result: {
          existing: [],
          newAssignments: []
        },
        error: dd.response.data
      } as AssignClassResultV2;
    }
    return {
      success: false,
      result: {
        existing: [],
        newAssignments: []
      },
      error: e
    } as AssignClassResultV2;
  }
}

export const sendAsignEmail = async (assignmentIds: number[], classId: number) => {
  try {
    const result = await post<any[]>(`/brick/sendAssignEmail`, {assignmentIds, classId})
    return {
      success: true,
      result,
      error: ''
    } as AssignClassResult;
  } catch (e) {
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
