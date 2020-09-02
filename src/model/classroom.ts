import { UserBase } from "./user";
import { Brick } from "./brick";

export enum ClassroomStatus {
    Disabled,
    Active,
    Deleted
}

export interface StudentStatus {
    studentId: number;
    status: number;
}

export interface Assignment {
    id: number;
    brick: Brick;
    assignedDate: string;

    studentStatus: StudentStatus[];
    studentStatusCount: {
      0: number;
      1: number;
      2: number;
    }
}

export interface Classroom {
    id: number;
    name: string;
    created: Date;
    updated: Date;
    status: ClassroomStatus;
    students: UserBase[];
    teachers: UserBase[];
    creator: UserBase;
    assignments: Assignment[];
}

export interface TeachClassroom extends Classroom {
    active: boolean;
}