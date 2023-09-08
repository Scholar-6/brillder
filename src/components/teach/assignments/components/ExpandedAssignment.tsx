import { Assignment } from "model/classroom";

export interface BookData {
  open: boolean;
  student: any;
  assignment: Assignment | null;
}