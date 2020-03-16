export interface ComponentAttempt {
  answer: any,
  correct: boolean,
  marks: number,
  maxMarks: number
}

export enum PlayStatus {
  Intro,
  Live,
  Review,
  Ending
}
