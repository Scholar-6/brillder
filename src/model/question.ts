
export enum QuestionComponentTypeEnum {
  None = 0,
  Text = 1,
  Quote = 3,
  Image = 4,
  Sound = 5,
  Graph = 6,

  Component= 127,
}

export enum QuestionTypeEnum {
  None = 0,
  ShortAnswer = 1,
  ChooseOne = 2,
  ChooseSeveral = 3,
  VerticalShuffle = 4,
  HorizontalShuffle = 5,
  PairMatch = 6,
  Sort = 7,
  MissingWord = 8,
  WordHighlighting = 9,
  LineHighlighting = 10,
}

export const QuestionTypeObj = {
  ShortAnswer: QuestionTypeEnum.ShortAnswer,
  ChooseOne: QuestionTypeEnum.ChooseOne,
  ChooseSeveral: QuestionTypeEnum.ChooseSeveral,
  VerticalShuffle: QuestionTypeEnum.VerticalShuffle,
  HorizontalShuffle: QuestionTypeEnum.HorizontalShuffle,
  PairMatch: QuestionTypeEnum.PairMatch,
  Categorise: QuestionTypeEnum.Sort,
  MissingWord: QuestionTypeEnum.MissingWord,
  WordHighlighting: QuestionTypeEnum.WordHighlighting,
  LineHighlighting: QuestionTypeEnum.LineHighlighting,
} as any

export enum HintStatus {
  None,
  All,
  Each
}

export interface Hint {
  value: string;
  list: string[];
  status: HintStatus;
}

export interface Question {
  id: number;
  brickQuestionId: number;
  active: boolean;
  type: QuestionTypeEnum;
  hint: Hint;
  firstComponent: any;
  components: any[];
  edited?: boolean;
  contentBlocks? : string;
  order: number;
}
