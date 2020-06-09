export enum QuestionValueType {
  None,
  String,
  Image,
}

export interface SortAnswer {
  value: string;
  valueFile: string;
  type: QuestionValueType;
  choosen?: boolean;
}
  
export interface SortCategory {
  name: string;
  answers: SortAnswer[];
  height: string;
}
