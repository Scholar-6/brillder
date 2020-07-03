import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import Checkbox from "@material-ui/core/Checkbox";

import './ChooseOneAnswer.scss';
import DocumentWirisCKEditor from 'components/baseComponents/ckeditor/DocumentWirisEditor';
import QuestionImageDropzone from "../../baseComponents/QuestionImageDropzone";
import { QuestionValueType } from "../types";
import {ChooseOneAnswer} from './types';


export interface ChooseOneAnswerProps {
  locked: boolean;
  index: number;
  length: number;
  answer: ChooseOneAnswer;
  validationRequired: boolean;
  checkBoxValid: boolean;
  save(): void;
  removeFromList(index: number): void;
  onChecked(event: any, checked: boolean): void;
  update(): void;
}

const ChooseOneAnswerComponent: React.FC<ChooseOneAnswerProps> = ({
  locked, index, length, answer, validationRequired, checkBoxValid,
  removeFromList, update, save, onChecked
}) => {
  const renderDeleteButton = () => {
    if (length > 3) {
      return (
        <DeleteIcon
          className="delete-right-top-icon"
          onClick={() => removeFromList(index)}
        />
      );
    }

    return "";
  }

  const setImage = (fileName: string) => {
    if (locked) {return;}
    answer.value = "";
    answer.valueFile = fileName;
    answer.answerType = QuestionValueType.Image;
    update();
    save();
  }

  const onTextChanged = (answer: ChooseOneAnswer, value: string) => {
    if (locked) {return;}
    answer.value = value;
    answer.valueFile = "";
    answer.answerType = QuestionValueType.String;
    update();
  }

  let containerClass = "";
  let className = 'choose-one-box unique-component-box';
  if (answer.answerType === QuestionValueType.Image) {
    className+=' big-answer';
    containerClass='big-box';
  }

  console.log(validationRequired, checkBoxValid);
  let checkboxClass = "left-ckeckbox";
  if (validationRequired) {
    if (!checkBoxValid) {
      checkboxClass += " checkbox-invalid";
    }
  }

  return (
    <div className={className}>
      {renderDeleteButton()}
      <div className={"checkbox-container " + containerClass}>
        <Checkbox
          className={checkboxClass}
          disabled={locked}
          checked={answer.checked}
          onChange={onChecked}
          value={index}
        />
      </div>
      <QuestionImageDropzone
        answer={answer}
        type={answer.answerType || QuestionValueType.None}
        locked={locked}
        fileName={answer.valueFile}
        update={setImage}
      />
      <DocumentWirisCKEditor
        disabled={locked}
        data={answer.value}
        toolbar={['mathType', 'chemType']}
        placeholder="Enter Answer..."
        validationRequired={answer.answerType !== QuestionValueType.Image ? validationRequired : false}
        onBlur={() => save()}
        onChange={value => onTextChanged(answer, value)}
      />
    </div>
  );
};

export default ChooseOneAnswerComponent;
