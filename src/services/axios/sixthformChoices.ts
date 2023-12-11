
import {get} from './index';

export interface SixthformSubject {
  id: number;  
  isALevel: boolean;
  isAcademic: boolean;
  isVocational: boolean;
  name: string;
}

export const getSixthformSubjects = async () => {
  try {
    const subjects = await get<SixthformSubject[]>(`/sixth-form-choices/suggested-subjects`);
    return subjects;
  } catch {
    return null;
  }
}
