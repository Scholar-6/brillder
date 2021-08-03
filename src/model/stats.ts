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

export interface AssignmentAttepmtAnswer {
    answer: string;
    correct: boolean;
    marks: number;
    maxMarks: number;
}

export interface AttemptStats {
    answers: AssignmentAttepmtAnswer[];
    liveAnswers: AssignmentAttepmtAnswer[];
    score: number;
    oldScore: number;
    maxScore: number;
    percentScore: number;
}

export interface AssignmentStudent {
    attempts: AttemptStats[];
    avg_score: number;
    status: number;
    studentId: number;
    avgScore: number;
    bestScore: number;
    numberOfAttempts: number;
}

export interface ApiAssignemntStats {
    byStudent: AssignmentStudent[];
    stats: AssignmentStats;
}

export interface AssignmentWithStats extends Assignment {
    attempts: AttemptStats[];
    stats: AssignmentStats;
}

export interface ClassroomStats {
    stats: AssignmentStats;
    assignments: AssignmentWithStats[];
}
