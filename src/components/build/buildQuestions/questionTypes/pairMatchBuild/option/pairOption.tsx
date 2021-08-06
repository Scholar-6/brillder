import React from "react";
import { Grid } from "@material-ui/core";
import { QuestionValueType } from '../../types';
import { Answer } from '../types';
import QuestionImageDropZone from 'components/build/baseComponents/questionImageDropzone/QuestionImageDropzone';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import QuillEditorContainer from "components/baseComponents/quill/QuillEditorContainer";
import SoundRecord from "../../sound/SoundRecord";
import { ChooseOneAnswer } from "../../chooseOneBuild/types";


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
  locked, index, answer, validationRequired, save, update
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

  const onTextChanged = (answer: Answer, value: string) => {
    if (locked) { return; }
    answer.option = value;
    answer.optionFile = "";
    answer.optionType = QuestionValueType.String;
    update();
    save();
  }

  const setImage = (fileName: string) => {
    if (locked) { return; }
    answer.option = "";
    if (fileName) {
      answer.optionFile = fileName;
    }
    answer.optionType = QuestionValueType.Image;
    update();
    save();
  }

  const setSound = (soundFile: string, caption: string) => {
    if (locked) { return; }
    answer.value = '';
    answer.valueFile = '';
    if (soundFile) {
      answer.optionSoundFile = soundFile;
    }
    answer.optionSoundCaption = caption;
    answer.optionType = QuestionValueType.Sound;
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

  const soundAnswer = {
    answerType: answer.optionType,
    soundFile: answer.optionSoundFile,
    soundCaption: answer.optionSoundCaption
  } as ChooseOneAnswer;

  // const imageAnswer = {
  //   answerType: answer.optionType,
  //   imageCaption: answer.imageCaption
  // }

  if (answer.optionType === QuestionValueType.Sound) {
    return (
      <Grid container item xs={6}>
        <div className="choose-sound bigger">
          <SoundRecord
            locked={locked}
            answer={soundAnswer}
            save={setSound}
            clear={() => onTextChanged(answer, '')}
          />
        </div>
      </Grid>
    );
  } else if (answer.optionType === QuestionValueType.Image) {
    return (
      <Grid container item xs={6}>
        <div className={customClass}>
          {renderDeleteButton()}
          <QuestionImageDropZone
            answer={answer as any}
            isOption={true}
            className="pair-image"
            type={answer.optionType || QuestionValueType.None}
            fileName={answer.optionFile}
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
        <QuillEditorContainer
          locked={locked}
          object={answer}
          fieldName="option"
          validationRequired={validationRequired}
          toolbar={['latex']}
          isValid={isValid}
          placeholder={"Option " + (index + 1) + "..."}
          onChange={value => onTextChanged(answer, value)}
        />
        <QuestionImageDropZone
          answer={answer as any}
          isOption={true}
          type={answer.optionType || QuestionValueType.None}
          fileName={answer.optionFile}
          locked={locked}
          update={setImage}
        />
        <SoundRecord
          locked={locked}
          answer={soundAnswer}
          save={setSound}
          clear={() => onTextChanged(answer, '')}
        />
        {renderDeleteButton()}
      </div>
    </Grid>
  );
};

export default PairOptionComponent;
