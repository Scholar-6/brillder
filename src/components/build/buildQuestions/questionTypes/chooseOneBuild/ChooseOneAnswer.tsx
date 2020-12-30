import React from "react";
import Checkbox from "@material-ui/core/Checkbox";

import './ChooseOneAnswer.scss';
import DocumentWirisCKEditor from 'components/baseComponents/ckeditor/DocumentWirisEditor';
import QuestionImageDropzone from "components/build/baseComponents/questionImageDropzone/QuestionImageDropzone";
import { QuestionValueType } from "../types";
import { ChooseOneAnswer } from './types';
import RemoveItemButton from "../components/RemoveItemButton";
import SoundRecord from "../sound/SoundRecord";
import DeleteDialog from "components/baseComponents/deleteBrickDialog/DeleteDialog";
import RemoveButton from "../components/RemoveButton";


export interface ChooseOneAnswerProps {
  locked: boolean;
  editOnly: boolean;
  index: number;
  length: number;
  answer: ChooseOneAnswer;
  validationRequired: boolean;
  checkBoxValid: boolean;
  save(): void;
  removeFromList(index: number): void;
  onChecked(event: any, checked: boolean): void;
  update(): void;
  onBlur(): void;
}

const ChooseOneAnswerComponent: React.FC<ChooseOneAnswerProps> = ({
  locked, editOnly, index, length, answer, validationRequired, checkBoxValid,
  removeFromList, update, save, onChecked, onBlur
}) => {
  const [clearOpen, setClear] = React.useState(false);

  const setImage = (fileName: string) => {
    if (locked) { return; }
    answer.value = "";
    answer.soundFile = "";
    answer.valueFile = fileName;
    answer.answerType = QuestionValueType.Image;
    update();
    save();
  }

  const setSound = (soundFile: string, caption: string) => {
    if (locked) { return; }
    answer.value = '';
    answer.valueFile = '';
    answer.soundFile = soundFile;
    answer.soundCaption = caption;
    answer.answerType = QuestionValueType.Sound;
    update();
    save();
  }

  const onTextChanged = (answer: ChooseOneAnswer, value: string) => {
    if (locked) { return; }
    answer.value = value;
    answer.valueFile = "";
    answer.soundFile = "";
    answer.answerType = QuestionValueType.String;
    update();
  }

  let containerClass = "";
  let className = 'choose-one-box unique-component';
  if (answer.answerType === QuestionValueType.Image) {
    className += ' big-answer';
    containerClass = 'big-box';
  }

  let checkboxClass = "left-ckeckbox";
  if (validationRequired) {
    if (!checkBoxValid) {
      checkboxClass += " checkbox-invalid";
    }
  }

  if (validationRequired) {
    if (!answer.value && (answer.answerType === QuestionValueType.String || answer.answerType === QuestionValueType.None)) {
      className += ' invalid-answer';
    }
  }

  const renderAnswerType = (answer: ChooseOneAnswer) => {
    if (answer.answerType === QuestionValueType.Sound) {
      return (
        <div className="choose-sound">
          <SoundRecord
            locked={locked}
            answer={answer}
            save={setSound}
            clear={() => onTextChanged(answer, '')}
          />
        </div>
      );
    } else if (answer.answerType === QuestionValueType.Image) {
      return (
        <div className="choose-image">
          <RemoveButton onClick={() => setClear(true)} />
          <QuestionImageDropzone
            answer={answer as any}
            type={answer.answerType || QuestionValueType.None}
            locked={locked}
            fileName={answer.valueFile}
            update={setImage}
          />
          <DeleteDialog
            isOpen={clearOpen}
            label="Delete image?"
            submit={() => onTextChanged(answer, '')}
            close={() => setClear(false)}
          />
        </div>
      );
    }
    return (
      <div className="choose-empty">
        <QuestionImageDropzone
          answer={answer as any}
          type={answer.answerType || QuestionValueType.None}
          locked={locked}
          fileName={answer.valueFile}
          update={setImage}
        />
        <DocumentWirisCKEditor
          disabled={locked}
          editOnly={editOnly}
          data={answer.value}
          toolbar={['latex', 'chemType']}
          placeholder="Enter Answer..."
          validationRequired={validationRequired}
          onBlur={() => {
            onBlur();
            save();
          }}
          onChange={value => onTextChanged(answer, value)}
        />
        <SoundRecord
          locked={locked}
          answer={answer}
          save={setSound}
          clear={() => onTextChanged(answer, '')}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      {answer.answerType !== QuestionValueType.Sound && answer.answerType !== QuestionValueType.Image &&
        <RemoveItemButton index={index} length={length} onClick={removeFromList} />
      }
      <div className={"checkbox-container " + containerClass}>
        <Checkbox
          className={checkboxClass}
          disabled={locked}
          checked={answer.checked}
          onChange={onChecked}
          value={index}
        />
      </div>
      {renderAnswerType(answer)}
    </div>
  );
};

export default ChooseOneAnswerComponent;
