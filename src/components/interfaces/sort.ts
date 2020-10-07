export enum QuestionValueType {
  None,
  String,
  Image,
}

export interface SortAnswer {
  text: string;
  value: string;
  valueFile: string;
  answerType: QuestionValueType;
  choosen?: boolean;
}
  
export interface SortCategory {
  name: string;
  answers: SortAnswer[];
  height: string;
}
