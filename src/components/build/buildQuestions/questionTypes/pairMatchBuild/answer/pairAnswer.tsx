import React from "react";
import { Grid } from "@material-ui/core";
import { QuestionValueType } from '../../types';
import { Answer } from '../types';
import QuestionImageDropZone from 'components/build/baseComponents/questionImageDropzone/QuestionImageDropzone';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import QuillEditorContainer from "components/baseComponents/quill/QuillEditorContainer";
import SoundRecord from "../../sound/SoundRecord";
import { ChooseOneAnswer } from "../../chooseOneBuild/types";


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
  locked, index, length, answer, validationRequired,
  removeFromList, update, save, onBlur
}) => {
  const onTextChanged = (answer: Answer, value: string) => {
    if (locked) { return; }
    answer.value = value;
    answer.valueFile = "";
    answer.valueSoundFile = "";
    answer.answerType = QuestionValueType.String;
    update();
    save();
  }

  const removeImage = () => {
    if (locked) { return; }
    answer.valueFile = "";
    answer.valueSoundFile = "";
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
    answer.valueSoundFile = "";
    if (fileName) {
      answer.valueFile = fileName;
    }
    answer.answerType = 2;
    update();
    save();
  }

  const setSound = (soundFile: string, caption: string) => {
    if (locked) { return; }
    answer.value = '';
    answer.valueFile = '';
    answer.valueSoundFile = soundFile;
    answer.valueSoundCaption = caption;
    answer.answerType = QuestionValueType.Sound;
    update();
    save();
  }

  const soundAnswer = {
    answerType: answer.answerType,
    soundFile: answer.valueSoundFile,
    soundCaption: answer.valueSoundCaption
  } as ChooseOneAnswer;

  if (answer.answerType === QuestionValueType.Sound) {
    return (
      <Grid container item xs={6}>
        <div className="choose-sound">
          <SoundRecord
            locked={locked}
            answer={soundAnswer}
            save={setSound}
            clear={() => onTextChanged(answer, '')}
          />
        </div>
      </Grid>
    );
  } else if (answer.answerType === QuestionValueType.Image) {
    return (
      <Grid container item xs={6}>
        <div className={customClass}>
          {renderDeleteButton()}
          <QuestionImageDropZone
            answer={answer as any}
            className="pair-image"
            type={answer.answerType || QuestionValueType.None}
            fileName={answer.valueFile}
            locked={locked}
            update={setImage}
          />
        </div>
      </Grid>
    );
  }

  return (
    <Grid container item xs={6}>
      <div className={customClass}>
        {renderDeleteButton()}
        <QuillEditorContainer
          locked={locked}
          object={answer}
          fieldName="value"
          validationRequired={validationRequired}
          toolbar={['latex']}
          isValid={isValid}
          placeholder={"Answer " + (index + 1)}
          onBlur={onBlur}
          onChange={value => onTextChanged(answer, value)}
        />
        <QuestionImageDropZone
          answer={answer as any}
          className=""
          type={answer.answerType || QuestionValueType.None}
          fileName={answer.valueFile}
          locked={locked}
          update={setImage}
        />
        <SoundRecord
          locked={locked}
          answer={soundAnswer}
          save={setSound}
          clear={() => onTextChanged(answer, '')}
        />
      </div>
    </Grid>
  );
};

export default PairAnswerComponent;
