
import {get} from './index';

export enum UserSubjectChoice {
  Maybe, // null or 0 or undefined
  Definetly,
  NotForMe
}

export interface SixthformSubject {
  id: number;  
  isALevel: boolean;
  isAcademic: boolean;
  isVocational: boolean;
  userChoice?: UserSubjectChoice;
  score: number;
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
