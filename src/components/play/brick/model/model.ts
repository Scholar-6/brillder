export interface ComponentAttempt<T> {
  answer: T;
  correct: boolean;
  marks: number;
  maxMarks: number;
  attempted: boolean;
  // only for pair match and shuffle attempts
  dragged?: boolean;
}

export enum PlayStatus {
  Intro,
  Live,
  Review,
  Ending
}
