export interface ComponentAttempt {
  answer: any,
  correct: boolean,
  marks: number,
  maxMarks: number
}

export enum PlayStatus {
  Live,
  Review
}
