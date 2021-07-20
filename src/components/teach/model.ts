import { User } from "model/user";
import { ClassroomApi } from "./service";

export interface MUser extends User {
  selected: boolean;
  studyClassrooms: ClassroomApi[];
  hasInvitation: boolean;
  classroom?: ClassroomApi; // for pending invitations
  selectHovered?: boolean;
}

export enum TeachActiveTab {
  Assignments,
  Students,
}

export interface TeachFilters {
  assigned: boolean;
  completed: boolean;
}
