import { UserBase } from "./user";
import { Brick } from "./brick";

export enum ClassroomStatus {
    Disabled,
    Active,
    Deleted
}

export interface Assignment {
    id: number;
    brick: Brick;
    assignedDate: string;
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