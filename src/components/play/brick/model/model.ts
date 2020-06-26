export interface ComponentAttempt {
  answer: any;
  correct: boolean;
  marks: number;
  maxMarks: number;
  attempted: boolean;
}

export enum PlayStatus {
  Intro,
  Live,
  Review,
  Ending
}
