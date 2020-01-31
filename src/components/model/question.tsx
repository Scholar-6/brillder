
export enum QuestionComponentTypeEnum{
  None = 0,
  Text = 1,
  Hint = 2,
  Quote = 3,
  Image = 4,
  Sound = 5,
  Equation = 6,

  Component= 127,
}

export const QuestionComponentType = {
  None: QuestionComponentTypeEnum.None,
  Text: QuestionComponentTypeEnum.Text,
  Hint: QuestionComponentTypeEnum.Hint,
  Quote: QuestionComponentTypeEnum.Quote,
  Image: QuestionComponentTypeEnum.Image,
  Sound: QuestionComponentTypeEnum.Sound,
  Equation: QuestionComponentTypeEnum.Equation,
  Component: QuestionComponentTypeEnum.Component,
} as any

export enum QuestionTypeEnum {
  None = 0,
  ShortAnswer = 1,
  ChooseOne = 2,
  ChooseSeveral = 3,
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
  ChooseSeveral: QuestionTypeEnum.ChooseSeveral,
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
  type: number,
  components: any[]
}
