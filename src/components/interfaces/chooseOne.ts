import { MainImageProps } from "components/build/buildQuestions/components/Image/model";

export enum QuestionValueType {
  None,
  String,
  Image,
  Sound
}

export interface ChooseOneChoice extends MainImageProps {
  index: number;
  value: string;
  valueFile: string;
  answerType: QuestionValueType;
  soundFile: string;
  checked: boolean;
}
