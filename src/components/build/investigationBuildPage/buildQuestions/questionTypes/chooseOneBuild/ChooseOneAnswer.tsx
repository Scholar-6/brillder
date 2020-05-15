import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import Checkbox from "@material-ui/core/Checkbox";

import './ChooseOneAnswer.scss'; 
import DocumentCKEditor from "components/baseComponents/DocumentEditor";
import QuestionImageDropzone from "../../baseComponents/QuestionImageDropzone";
import { QuestionValueType } from "../types";
import {ChooseOneAnswer} from './types';
import { Grid } from "@material-ui/core";


export interface ChooseOneAnswerProps {
  locked: boolean;
  index: number;
  length: number;
  answer: ChooseOneAnswer;
  removeFromList(index: number): void;
  onChecked(event: any, checked: boolean): void;
  update(): void;
}

const ChooseOneAnswerComponent: React.FC<ChooseOneAnswerProps> = ({
  locked, index, length, answer,
  removeFromList, update, onChecked
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
  }

  const onTextChanged = (answer: ChooseOneAnswer, value: string) => {
    if (locked) {return;}
    answer.value = value;
    answer.valueFile = "";
    answer.answerType = QuestionValueType.String;
    update();
  }

  let checkboxClass = "";
  let className = 'choose-one-box unique-component-box';
  if (answer.answerType === QuestionValueType.Image) {
    className+=' big-answer';
    checkboxClass='big-box';
  }

  return (
    <div className={className}>
      {renderDeleteButton()}
      <Grid container alignContent="center" className={`checkbox-container ${checkboxClass}`}>
        <Checkbox
          className="left-ckeckbox"
          disabled={locked}
          checked={answer.checked}
          onChange={onChecked}
          value={index}
        />
      </Grid>
      <QuestionImageDropzone
        answer={answer}
        type={answer.answerType || QuestionValueType.None}
        locked={locked}
        fileName={answer.valueFile}
        update={setImage}
      />
      <DocumentCKEditor
        data={answer.value}
        toolbar={['mathType', 'chemType']}
        placeholder="Enter Answer..."
        onChange={value => onTextChanged(answer, value)}
      />
    </div>
  );
};

export default ChooseOneAnswerComponent;
