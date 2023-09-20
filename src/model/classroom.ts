import { User, UserBase } from "./user";
import { Brick, Subject } from "./brick";
import { AssignmentStudent } from "./stats";
import { AssignmentBrick } from "./assignment";

export enum ClassroomStatus {
  Disabled,
  Active,
  Deleted,
  Archived
}

export enum StudentAssignmentStatus {
  Completed = 2
}

export interface StudentStatus {
  studentId: number;
  status: StudentAssignmentStatus;
  numberOfAttempts: number;
  avgScore: number;
}

export interface Assignment {
  id: number;
  brick: Brick;
  deadline: string;
  assignedDate: string;

  byStudent?: any[];

  student?: User;
  isArchived: boolean;

  classroom?: any;

  studentStatus: StudentStatus[];
  byStatus: any;
  studentStatusCount: {
    0: number;
    1: number;
    2: number;
  }
}

export interface TeachStudent extends UserBase {
  studentResult: AssignmentStudent | undefined;
  studentStatus: StudentStatus | undefined;
  remindersCounter?: number;
  completedCount: number;
}

export interface Classroom {
  id: number;
  name: string;
  created: Date;
  updated: Date;
  status: ClassroomStatus;
  students: TeachStudent[];
  teachers: UserBase[];
  teacher: UserBase;
  creator: UserBase;
  code: string;
  assignments: Assignment[];
  assignmentsBrick: AssignmentBrick[];
}

export interface ClassroomInvitation {
  classroom: Classroom;
  sentBy: UserBase;
}

export interface BrickInvitation {
  brick: Brick;
  sentBy: UserBase;
}

export interface StudentStatus {
  studentId: number;
  status: StudentAssignmentStatus;
  bestScore: number;
  remindersCounter?: number;
}

export interface TeachClassroom extends Classroom {
  active: boolean;
  subjectId: number;
  subject: Subject;
  isClass?: boolean;
  studentsCount: number;
  studentsInvitationsCount: number;
  assignmentsCount: string;
  archivedAssignmentsCount: string;
  studentsInvitations: any[];
}

export interface TeachClassroomInvitation {
  name: string;
  created: string;
  id: number;
  status: number;
  subject: Subject;
  subjectId: number;
  updated: string;
}
