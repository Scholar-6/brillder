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

export interface ClassroomStats {
    stats: AssignmentStats;
    assignments: Array<{
        assignmentId: number;
        attempts: AttemptStats[];
        stats: AssignmentStats;
    }>;
}