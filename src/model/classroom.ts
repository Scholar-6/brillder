import { User, UserBase } from "./user";
import { Brick, Subject } from "./brick";
import { AssignmentStudent } from "./stats";

export enum ClassroomStatus {
  Disabled,
  Active,
  Deleted
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
}

export interface Classroom {
  id: number;
  name: string;
  created: Date;
  updated: Date;
  status: ClassroomStatus;
  students: TeachStudent[];
  teachers: UserBase[];
  creator: UserBase;
  assignments: Assignment[];
}

export interface ClassroomInvitation {
  classroom: Classroom;
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
