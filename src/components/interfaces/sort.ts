export enum QuestionValueType {
  None,
  String,
  Image,
  Sound
}

export interface SortAnswer {
  text: string;
  value: string;
  valueFile: string;
  answerType: QuestionValueType;
  soundFile?: string;
  soundCaption?: string;
  choosen?: boolean;
}
  
export interface SortCategory {
  name: string;
  answers: SortAnswer[];
  height: string;
}
