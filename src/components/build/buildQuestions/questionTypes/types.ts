export enum QuestionValueType {
  None,
  String,
  Image,
  Sound
}

export interface UniqueComponentProps {
  locked: boolean;
  editOnly: boolean;
  data: any;
  validationRequired: boolean;
  save(): void;
  updateComponent(component: any): void;
  openSameAnswerDialog(): void;
  removeHintAt(index: number): void;
}
