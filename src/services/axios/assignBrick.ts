import {post} from './index';

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
