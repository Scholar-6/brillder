import React from "react";
import { Grid } from "@material-ui/core";
import {QuestionValueType} from '../../types';
import {Answer} from '../types';
import QuestionImageDropZone from 'components/build/baseComponents/questionImageDropzone/QuestionImageDropzone';
import DocumentWirisCKEditor from 'components/baseComponents/ckeditor/DocumentWirisEditor';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import QuillEditor from "components/baseComponents/quill/QuillEditor";


export interface PairOptionProps {
  locked: boolean;
  editOnly: boolean;
  index: number;
  answer: Answer;
  validationRequired: boolean;
  save(): void;
  update(): void;
}

const PairOptionComponent: React.FC<PairOptionProps> = ({
  locked, editOnly, index, answer, validationRequired, save, update
}) => {
  const removeImage = () => {
    if (locked) { return; }
    answer.optionFile = "";
    answer.optionType = QuestionValueType.None;
    update();
    save();
  }

  const renderDeleteButton = () => {
    if (answer.optionType === QuestionValueType.Image) {
      return (
        <button className="btn btn-transparent right-top-icon svgOnHover" onClick={() => removeImage()}>
          <SpriteIcon name="trash-outline" className="active back-button theme-orange" />
        </button>
      );
    }
    return "";
  }

  const optionChanged = (answer: Answer, value: string) => {
    if (locked) { return; }
    answer.option = value;
    answer.optionFile = "";
    answer.optionType = QuestionValueType.String;
    update();
    save();
  }

  const setImage = (fileName: string) => {
    if (locked) {return;}
    answer.option = "";
    answer.optionFile = fileName;
    answer.optionType = QuestionValueType.Image;
    update();
    save();
  }

  let customClass = 'unique-component pair-match-option';
  if (answer.optionType === QuestionValueType.Image || answer.answerType === QuestionValueType.Image) {
    customClass += ' pair-image';
  }

  let isValid = null;
  if (validationRequired) {
    isValid = true;
    if ((answer.optionType === QuestionValueType.String || answer.optionType === QuestionValueType.None || !answer.optionType) && !answer.option) {
      isValid = false;
    }
  }

  if (isValid === false) {
    customClass += ' invalid-answer';
  }

  return (
    <Grid container item xs={6}>
      <div className={customClass}>
        <QuillEditor
          disabled={locked}
          data={answer.option}
          validate={validationRequired}
          toolbar={['latex']}
          isValid={isValid}
          placeholder={"Enter Option " + (index + 1) + "..."}
          onChange={value => optionChanged(answer, value)}
        />
        <QuestionImageDropZone
          answer={answer as any}
          type={answer.optionType || QuestionValueType.None}
          fileName={answer.optionFile}
          locked={locked}
          update={setImage}
        />
        {renderDeleteButton()}
      </div>
    </Grid>
  );
};

export default PairOptionComponent;
