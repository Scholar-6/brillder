

export enum QuestionTypeEnum {
  None = 0,
  ShortAnswer = 1,
  ChooseOne = 2,
  ChooseServeral = 3,
  VerticalShuffle = 4,
  HorizontalShuffle = 5,
  PairMatch = 6,
  Categorise = 7,
  MissingWord = 8,
  WordHighlighting = 9,
  LineHighlighting = 10
}

export const QuestionType = {
  ShortAnswer: QuestionTypeEnum.ShortAnswer,
  ChooseOne: QuestionTypeEnum.ChooseOne,
  ChooseServeral: QuestionTypeEnum.ChooseServeral,
  VerticalShuffle: QuestionTypeEnum.VerticalShuffle,
  HorizontalShuffle: QuestionTypeEnum.HorizontalShuffle,
  PairMatch: QuestionTypeEnum.PairMatch,
  Categorise: QuestionTypeEnum.Categorise,
  MissingWord: QuestionTypeEnum.MissingWord,
  WordHighlighting: QuestionTypeEnum.WordHighlighting,
  LineHighlighting: QuestionTypeEnum.LineHighlighting
} as any

export interface Question {
  id: number,
  active: boolean,
  type: number
}