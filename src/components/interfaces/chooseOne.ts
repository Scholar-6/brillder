export enum QuestionValueType {
  None,
  String,
  Image,
}

export interface ChooseOneChoice {
  index: number;
  value: string;
  valueFile: string;
  answerType: QuestionValueType;
  checked: boolean;
}
