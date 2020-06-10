export enum QuestionValueType {
  None,
  String,
  Image,
}

export interface ChooseOneChoice {
  value: string;
  valueFile: string;
  answerType: QuestionValueType;
  checked: boolean;
}
