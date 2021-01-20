import axios from "axios";

import { Subject } from "../../model/brick";

export const GENERAL_SUBJECT = "General";
export const CURRENT_AFFAIRS_SUBJECT = "Current Affairs";

export interface SubjectsResult {
  data: Subject[];
}

export const loadSubjects = () => {
  return axios.get(
    process.env.REACT_APP_BACKEND_HOST + '/subjects', { withCredentials: true }
  ).then((res: SubjectsResult) => {
    return res.data;
  }).catch(error => {
    alert('Can`t get subjects');
    return null;
  });
}

export const getGeneralSubject = (subjects: Subject[]) => {
  return subjects.find(s => s.name === GENERAL_SUBJECT);
}

export const getSubjectColor = (subjects: Subject[], subjectId: number) => {
  for (const s of subjects) {
    if (s.id === subjectId) {
      return s.color;
    }
  }
  return '';
}