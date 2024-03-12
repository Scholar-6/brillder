
import { Brick } from 'model/brick';
import {get, post} from './index';
import { sendSixthformError } from 'components/play/services/errorService';

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

  predicedStrength: number | string;
}

export const getSixthformSubjects = async () => {
  try {
    const subjects = await get<SixthformSubject[]>(`/sixth-form-choices/suggested-subjects`);
    return subjects;
  } catch {
    sendSixthformError('Failed to get subjects');
    return null;
  }
}

export const getSixthformSubjects2 = async () => {
  try {
    return await get<SixthformSubject[]>(`/sixth-form-choices/suggested-subjects2`);
  } catch {
    sendSixthformError('Failed to get subjects 2');
    return null;
  }
}

export const saveSixthformAnswer = async (answer: string, step: number) => {
  try {
    return await post<SixthformCalcResult>(`/sixth-form-choices/answer`, { answer: { answer, step }});
  } catch {
    sendSixthformError('Failed to save answers');
    return null;
  }
}

export const getSixthformAnswers = async () => {
  try {
    return await get<SixthformAnswer[]>(`/sixth-form-choices/answers`);
  } catch {
    sendSixthformError('Failed to get sixthform answers');
    return null;
  }
}

export const getSixthformSchools = async () => {
  try {
    return await get<any[]>(`/sixth-form-choices/schools`);
  } catch {
    sendSixthformError('Failed to get schools');
    return null;
  }
}

export const setSixthformSubjectChoice = async (subject: any) => {
  try {
    return await post<any[]>(`/sixth-form-choices/userSubject`, { subject });
  } catch {
    sendSixthformError('Failed to set subject type');
    return null;
  }
}

export const getKeyStage4Subjects = async () => {
  try {
    return await get<KeyStage4Subject[]>(`/sixth-form-choices/key-stage4-subjects`);
  } catch {
    sendSixthformError('Failed to get key 4 subjects');
    return null;
  }
}