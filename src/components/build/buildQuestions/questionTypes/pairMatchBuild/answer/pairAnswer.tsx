import React from "react";
import * as Y from "yjs";
import { Grid } from "@material-ui/core";
import { QuestionValueType } from '../../types';
import QuestionImageDropZone from 'components/build/baseComponents/questionImageDropzone/QuestionImageDropzone';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import QuillEditor from "components/baseComponents/quill/QuillEditor";


export interface PairAnswerProps {
  locked: boolean;
  editOnly: boolean;
  index: number;
  length: number;
  answer: Y.Map<any>;
  validationRequired: boolean;
  removeFromList(index: number): void;
  onBlur(): void;
}

const PairAnswerComponent: React.FC<PairAnswerProps> = ({
  locked, editOnly, index, length, answer, validationRequired,
  removeFromList, onBlur
}) => {
  const removeImage = () => {
    if (locked) { return; }
    answer.set("valueFile", "");
    answer.set("answerType", QuestionValueType.None);
  }

  const renderDeleteButton = () => {
    if (locked) { return; }
    if (answer.get("answerType") === QuestionValueType.Image) {
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
  if (answer.get("optionType") === QuestionValueType.Image || answer.get("answerType") === QuestionValueType.Image) {
    customClass += ' pair-image';
  }

  let isValid = null;
  if (validationRequired) {
    isValid = true;
    if ((answer.get("answerType") === QuestionValueType.String || answer.get("answerType") === QuestionValueType.None || !answer.get("answerType")) && !answer.get("value")) {
      isValid = false;
    }
  }

  if (isValid === false) {
    customClass += ' invalid-answer';
  }

  const setImage = (fileName: string) => {
    if (locked) { return; }
    answer.set("value", "");
    answer.set("valueFile", fileName);
    answer.set("answerType", QuestionValueType.Image);
  }

  return (
    <Grid container item xs={6}>
      <div className={customClass}>
        {renderDeleteButton()}
        <QuillEditor
          disabled={locked}
          sharedData={answer.get("value")}
          validate={validationRequired}
          isValid={isValid}
          toolbar={['latex']}
          placeholder={"Enter Answer " + (index + 1) + "..."}
          onBlur={() => {
            onBlur();
          }}
        />
        <QuestionImageDropZone
          answer={answer as any}
          type={answer.get("answerType") || QuestionValueType.None}
          fileName={answer.get("valueFile")}
          locked={locked}
          update={setImage}
        />
      </div>
    </Grid>
  );
};

export default PairAnswerComponent;
