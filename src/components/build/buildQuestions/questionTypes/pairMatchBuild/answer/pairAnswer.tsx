import React from "react";
import { Grid } from "@material-ui/core";
import { QuestionValueType } from '../../types';
import { Answer } from '../types';
import QuestionImageDropZone from 'components/build/baseComponents/questionImageDropzone/QuestionImageDropzone';
import DocumentWirisCKEditor from 'components/baseComponents/ckeditor/DocumentWirisEditor';
import SpriteIcon from "components/baseComponents/SpriteIcon";


export interface PairAnswerProps {
  locked: boolean;
  editOnly: boolean;
  index: number;
  length: number;
  answer: Answer;
  validationRequired: boolean;
  removeFromList(index: number): void;
  save(): void;
  update(): void;
  onBlur(): void;
}

const PairAnswerComponent: React.FC<PairAnswerProps> = ({
  locked, editOnly, index, length, answer, validationRequired,
  removeFromList, update, save, onBlur
}) => {
  const answerChanged = (answer: Answer, value: string) => {
    if (locked) { return; }
    answer.value = value;
    answer.valueFile = "";
    answer.answerType = QuestionValueType.String;
    update();
  }

  const removeImage = () => {
    if (locked) { return; }
    answer.valueFile = "";
    answer.answerType = QuestionValueType.None;
    update();
    save();
  }

  const renderDeleteButton = () => {
    if (locked) { return; }
    if (answer.answerType === QuestionValueType.Image) {
      return (
        <button className="btn btn-transparent right-top-icon svgOnHover" onClick={() => removeImage()}>
          <SpriteIcon name="trash-outline" className="active back-button theme-orange" />
        </button>
      );
    }

    if (length > 3) {
      return (
        <button className="btn btn-transparent right-top-icon svgOnHover" onClick={() => removeFromList(index)}>
          <SpriteIcon name="trash-outline" className="active back-button theme-orange" />
        </button>
      );
    }
    return "";
  }

  let customClass = 'unique-component pair-match-answer';
  if (answer.optionType === QuestionValueType.Image || answer.answerType === QuestionValueType.Image) {
    customClass += ' pair-image';
  }

  let isValid = null;
  if (validationRequired) {
    isValid = true;
    if ((answer.answerType === QuestionValueType.String || answer.answerType === QuestionValueType.None || !answer.answerType) && !answer.value) {
      isValid = false;
    }
  }

  if (isValid === false) {
    customClass += ' invalid-answer';
  }

  const setImage = (fileName: string) => {
    if (locked) { return; }
    answer.value = "";
    answer.valueFile = fileName;
    answer.answerType = 2;
    update();
    save();
  }

  return (
    <Grid container item xs={6}>
      <div className={customClass}>
        {renderDeleteButton()}
        <DocumentWirisCKEditor
          disabled={locked}
          editOnly={editOnly}
          data={answer.value}
          isValid={isValid}
          toolbar={['latex']}
          placeholder={"Enter Answer " + (index + 1) + "..."}
          onBlur={() => {
            onBlur();
            save();
          }}
          onChange={value => answerChanged(answer, value)}
        />
        <QuestionImageDropZone
          answer={answer as any}
          type={answer.answerType || QuestionValueType.None}
          fileName={answer.valueFile}
          locked={locked}
          update={setImage}
        />
      </div>
    </Grid>
  );
};

export default PairAnswerComponent;
