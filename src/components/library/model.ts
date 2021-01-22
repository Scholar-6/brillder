import { AssignmentBrick } from "model/assignment";
import { Subject } from "model/brick";

export enum SortBy {
  None,
  Date,
  Score,
}

export interface SubjectAssignments {
  subject: Subject,
  assignments: AssignmentBrick[]
}
