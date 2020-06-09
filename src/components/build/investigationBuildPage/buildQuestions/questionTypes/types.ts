export enum QuestionValueType {
  None,
  String,
  Image,
}

export interface UniqueComponentProps {
  locked: boolean;
  data: any;
  validationRequired: boolean;
  save(): void;
  updateComponent(component: any): void;
}
