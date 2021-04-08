import React from "react";
import * as Y from "yjs";
import _ from "lodash";
import Checkbox from "@material-ui/core/Checkbox";

import './ChooseOneAnswer.scss';
import QuestionImageDropzone from "components/build/baseComponents/questionImageDropzone/QuestionImageDropzone";
import { QuestionValueType } from "../types";
import RemoveItemButton from "../components/RemoveItemButton";
import SoundRecord from "../sound/SoundRecord";
import RemoveButton from "../components/RemoveButton";
import QuillEditor from "components/baseComponents/quill/QuillEditor";
import YesNoDialog from "components/build/baseComponents/dialogs/YesNoDialog";


export interface ChooseOneAnswerProps {
  locked: boolean;
  index: number;
  length: number;
  answer: Y.Map<any>;
  validationRequired: boolean;
  checkBoxValid: boolean;
  hovered?: boolean;
  removeFromList(index: number): void;
  onChecked(event: any, checked: boolean): void;
  onBlur(): void;
}

const ChooseOneAnswerComponent: React.FC<ChooseOneAnswerProps> = ({
  locked, index, length, answer, validationRequired, checkBoxValid, hovered,
  removeFromList, onChecked, onBlur
}) => {
  const getAnswerType = () =>
    (answer.get("answerType") as QuestionValueType) || QuestionValueType.None;
  const getFileName = () => answer.get("valueFile") as string;

  const [clearOpen, setClear] = React.useState(false);
  const [type, setType] = React.useState(getAnswerType());
  const [fileName, setFileName] = React.useState(getFileName());

  React.useEffect(() => {
    const observer = _.throttle((evt: any) => {
      setType(getAnswerType());
      setFileName(getFileName());
    }, 200);
    answer.observe(observer);
    return () => {
      answer.unobserve(observer);
    };
    // eslint-disable-next-line
  }, []);

  const setImage = (fileName: string, source: string, caption: string) => {
    if (locked) { return; }
    answer.set("value", "");
    answer.set("soundFile", "");
    answer.set("valueFile", fileName);
    answer.set("imageSource", source);
    answer.set("imageCaption", caption);
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
    answer.set("imageSource", "");
    answer.set("imageCaption", "");
    answer.set("soundFile", "");
    answer.set("soundCaption", "");
    answer.set("answerType", QuestionValueType.String);
    onBlur();
  }

  let containerClass = "";
  let className = 'choose-one-box unique-component';
  if (type === QuestionValueType.Image) {
    className += ' big-answer';
    containerClass = 'big-box';
  }

  let checkboxClass = "left-ckeckbox";
  if (validationRequired) {
    if (!checkBoxValid) {
      checkboxClass += " checkbox-invalid";
    }
  }

  if(hovered) {
    checkboxClass += " hovered";
  }

  if (validationRequired) {
    if (!answer.get("value") && (type === QuestionValueType.String || type === QuestionValueType.None)) {
      className += ' invalid-answer';
    }
  }

  const renderAnswerType = () => {
    if (type === QuestionValueType.Sound) {
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
    } else if (type === QuestionValueType.Image) {
      return (
        <div className="choose-image">
          <RemoveButton onClick={() => setClear(true)} />
          <QuestionImageDropzone
            answer={answer as any}
            type={type}
            locked={locked}
            fileName={fileName}
            update={setImage}
          />
          <YesNoDialog
            isOpen={clearOpen}
            title="Delete image?"
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
          type={type}
          locked={locked}
          fileName={fileName}
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
      {type !== QuestionValueType.Sound && type !== QuestionValueType.Image &&
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
