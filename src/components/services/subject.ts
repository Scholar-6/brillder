import { Subject } from "../../model/brick";

export const GENERAL_SUBJECT = "General & Topical";
export const CURRENT_AFFAIRS_SUBJECT = "Current Affairs";

export interface SubjectsResult {
  data: Subject[];
}

export const getGeneralSubject = (subjects: Subject[]) => {
  return subjects.find(s => s.name === GENERAL_SUBJECT);
}

export const getSubjectColor = (subjects: Subject[], subjectId: number) => {
  for (const s of subjects) {
    if (s.id === subjectId) {
      if (s.name === GENERAL_SUBJECT) {
        return '#001c58';
      }
    
      return s.color;
    }
  }
  return '';
}