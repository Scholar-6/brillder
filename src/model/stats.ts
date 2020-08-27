import { Assignment } from "./classroom";

export interface AssignmentStats {
    avgScore: number;
    maxScore: number;
    minScore: number;
    quartiles: {
        lower: number,
        median: number,
        upper: number,
    };
}

export interface AttemptStats {
    score: number;
    maxScore: number;
}

export interface AssignmentWithStats extends Assignment {
    attempts: AttemptStats[];
    stats: AssignmentStats;
}

export interface ClassroomStats {
    stats: AssignmentStats;
    assignments: AssignmentWithStats[];
}