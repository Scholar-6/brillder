
import { Brick } from 'model/brick';
import {get} from './index';

export enum UserSubjectChoice {
  Maybe, // null or 0 or undefined
  Definetly,
  NotForMe
}

export interface SixthformAnswer {
  step: number;
  saveTime: number;
  answer: any;
}

export interface SixthformCalcResult {
  answer: SixthformAnswer;
  subjects: SixthformSubject[];
  subjectScores: SixthformSubject[];
}

export interface SixthformSubject {
  id: number;  
  isTLevel: boolean;
  isALevel: boolean;
  isAcademic: boolean;
  isVocational: boolean;
  description: string;
  facilitatingSubject: string;
  userChoice?: UserSubjectChoice;
  subjectGroup: string;
  oftenWith: string;
  candidates: number;
  score: number;
  name: string;

  brick?: Brick;
  attempt?: any;

  isEmpty?: boolean;
  expanded?: boolean;
}

export interface KeyStage4Subject {
  id: number;
  name: string;
  isVocational: boolean;
  isGCSE: boolean;
  isPopular: boolean;
  selected: boolean;

  predicedStrength: number;
}

export const getSixthformSubjects = async () => {
  try {
    const subjects = await get<SixthformSubject[]>(`/sixth-form-choices/suggested-subjects3`);
    return subjects;
  } catch {
    return null;
  }
}
