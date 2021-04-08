import React from "react";
import * as Y from "yjs";
import { Grid } from "@material-ui/core";
import { QuestionValueType } from "../../types";
import QuestionImageDropZone from "components/build/baseComponents/questionImageDropzone/QuestionImageDropzone";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import QuillEditor from "components/baseComponents/quill/QuillEditor";

export interface PairOptionProps {
  locked: boolean;
  index: number;
  answer: Y.Map<any>;
  validationRequired: boolean;
  onBlur(): void;
}

const PairOptionComponent: React.FC<PairOptionProps> = ({
  locked,
  index,
  answer,
  validationRequired,
  onBlur,
}) => {
  const optionType = answer.get("optionType");

  const removeImage = () => {
    if (locked) {
      return;
    }
    answer.set("optionFile", "");
    answer.set("optionType", QuestionValueType.None);
  };

  const renderDeleteButton = () => {
    if (optionType === QuestionValueType.Image) {
      return (
        <button
          className="btn btn-transparent right-top-icon svgOnHover"
          onClick={() => removeImage()}
        >
          <SpriteIcon
            name="trash-outline"
            className="active back-button theme-orange"
          />
        </button>
      );
    }
    return "";
  };

  const setImage = (fileName: string) => {
    if (locked) {
      return;
    }
    answer.set("optionFile", fileName);
    answer.set("optionType", QuestionValueType.Image);
  };

  let customClass = "unique-component pair-match-option";
  if (
    optionType === QuestionValueType.Image ||
    answer.get("answerType") === QuestionValueType.Image
  ) {
    customClass += " pair-image";
  }

  let isValid = null;
  if (validationRequired) {
    isValid = true;
    if (
      (optionType === QuestionValueType.String ||
        optionType === QuestionValueType.None ||
        !optionType) &&
      !answer.get("option")
    ) {
      isValid = false;
    }
  }

  if (isValid === false) {
    customClass += " invalid-answer";
  }

  return (
    <Grid container item xs={6}>
      <div className={customClass}>
        {optionType !== QuestionValueType.Image && (
          <QuillEditor
            disabled={locked}
            sharedData={answer.get("option")}
            validate={validationRequired}
            toolbar={["latex"]}
            isValid={isValid}
            placeholder={"Enter Option " + (index + 1) + "..."}
            onBlur={onBlur}
          />
        )}
        <QuestionImageDropZone
          answer={answer as any}
          type={optionType || QuestionValueType.None}
          fileName={answer.get("optionFile")}
          locked={locked}
          update={setImage}
        />
        {renderDeleteButton()}
      </div>
    </Grid>
  );
};

export default PairOptionComponent;
