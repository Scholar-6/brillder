import React from "react";
import * as Y from "yjs";
import Checkbox from "@material-ui/core/Checkbox";

import './ChooseOneAnswer.scss';
import QuestionImageDropzone from "components/build/baseComponents/questionImageDropzone/QuestionImageDropzone";
import { QuestionValueType } from "../types";
import RemoveItemButton from "../components/RemoveItemButton";
import SoundRecord from "../sound/SoundRecord";
import DeleteDialog from "components/baseComponents/deleteBrickDialog/DeleteDialog";
import RemoveButton from "../components/RemoveButton";
import QuillEditor from "components/baseComponents/quill/QuillEditor";


export interface ChooseOneAnswerProps {
  locked: boolean;
  editOnly: boolean;
  index: number;
  length: number;
  answer: Y.Map<any>;
  validationRequired: boolean;
  checkBoxValid: boolean;
  removeFromList(index: number): void;
  onChecked(event: any, checked: boolean): void;
  onBlur(): void;
}

const ChooseOneAnswerComponent: React.FC<ChooseOneAnswerProps> = ({
  locked, editOnly, index, length, answer, validationRequired, checkBoxValid,
  removeFromList, onChecked, onBlur
}) => {
  const [clearOpen, setClear] = React.useState(false);

  const setImage = (fileName: string) => {
    if (locked) { return; }
    answer.set("value", "");
    answer.set("soundFile", "");
    answer.set("valueFile", fileName);
    answer.set("answerType", QuestionValueType.Image);
  }

  const setSound = (soundFile: string, caption: string) => {
    if (locked) { return; }
    answer.set("value", "");
    answer.set("valueFile", "");
    answer.set("soundFile", soundFile);
    answer.set("soundCaption", caption);
    answer.set("answerType", QuestionValueType.Sound);
  }

  const setText = () => {
    if (locked) { return; }
    answer.set("value", new Y.Text());
    answer.set("valueFile", "");
    answer.set("soundFile", "");
    answer.set("answerType", QuestionValueType.String);
    onBlur();
  }

  React.useEffect(() => {
    if(answer.get("answerType") === QuestionValueType.String && !answer.get("value")) {
      answer.set("value", new Y.Text());
    } 
  }, [answer]);

  let containerClass = "";
  let className = 'choose-one-box unique-component';
  if (answer.get("answerType") === QuestionValueType.Image) {
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
    if (!answer.get("value") && (answer.get("answerType") === QuestionValueType.String || answer.get("answerType") === QuestionValueType.None)) {
      className += ' invalid-answer';
    }
  }

  const renderAnswerType = () => {
    if (answer.get("answerType") === QuestionValueType.Sound) {
      return (
        <div className="choose-sound">
          <SoundRecord
            locked={locked}
            answer={answer.toJSON()}
            save={setSound}
            clear={() => setText()}
          />
        </div>
      );
    } else if (answer.get("answerType") === QuestionValueType.Image) {
      return (
        <div className="choose-image">
          <RemoveButton onClick={() => setClear(true)} />
          <QuestionImageDropzone
            answer={answer as any}
            type={answer.get("answerType") || QuestionValueType.None}
            locked={locked}
            fileName={answer.get("valueFile")}
            update={setImage}
          />
          <DeleteDialog
            isOpen={clearOpen}
            label="Delete image?"
            submit={() => setText()}
            close={() => setClear(false)}
          />
        </div>
      );
    }
    return (
      <div className="choose-empty">
        <QuestionImageDropzone
          answer={answer as any}
          type={answer.get("answerType") || QuestionValueType.None}
          locked={locked}
          fileName={answer.get("valueFile")}
          update={setImage}
        />
        <QuillEditor
          disabled={locked}
          sharedData={answer.get("value")}
          placeholder="Enter Answer..."
          toolbar={['latex']}
          validate={validationRequired}
          onBlur={onBlur}
        />
        <SoundRecord
          locked={locked}
          answer={answer.toJSON()}
          save={setSound}
          clear={() => setText()}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      {answer.get("answerType") !== QuestionValueType.Sound && answer.get("answerType") !== QuestionValueType.Image &&
        <RemoveItemButton index={index} length={length} onClick={removeFromList} />
      }
      <div className={"checkbox-container " + containerClass}>
        <Checkbox
          className={checkboxClass}
          disabled={locked}
          checked={answer.get("checked")}
          onChange={onChecked}
          value={index}
        />
      </div>
      {renderAnswerType()}
    </div>
  );
};

export default ChooseOneAnswerComponent;
