export enum PairBoxType {
  None,
  String,
  Image,
}

export interface Answer {
  checked: boolean;
  value: string;
  valueFile: string;
  answerType?: PairBoxType; 
  option: string;
  optionFile: string;
  optionType?: PairBoxType;
}
