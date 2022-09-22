import { Subject } from "model/brick";

export interface PersonalFilters {
  draft: boolean;
  selfPublish: boolean;
}

export interface SubjectItem extends Subject {
  count: number;
}
