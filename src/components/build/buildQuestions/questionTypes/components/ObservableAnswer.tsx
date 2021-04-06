import React from "react";
import * as Y from "yjs";
import _ from "lodash";

import { QuestionValueType } from "../types";

import QuestionImageDropzone from "components/build/baseComponents/questionImageDropzone/QuestionImageDropzone";
import RemoveItemButton from "./RemoveItemButton";
import QuillEditor from "components/baseComponents/quill/QuillEditor";
import RemoveImageButton from "./RemoveImageButton";

interface ObservableAnswerProps {
  isHorizontal?: boolean;
  index: number;
  list: Y.Array<any>;
  locked: boolean;
  answer: Y.Map<any>;
  validationRequired: boolean;
  removeFromList(index: number): void;
  checkSameAnswer(): void;
}

const ObservableAnswer: React.FC<ObservableAnswerProps> = ({
  locked,
  index,
  answer,
  validationRequired,
  list,
  ...props
}) => {
  const getAnswerType = () =>
    (answer.get("answerType") as QuestionValueType) || QuestionValueType.None;
  const getFileName = () => answer.get("valueFile") as string;

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
    answer.set("valueFile", fileName);
    answer.set("imageSource", source);
    answer.set("imageCaption", caption);
    answer.set("answerType", QuestionValueType.Image);
  };

  const removeImage = () => {
    if (locked) { return; }
    answer.set("value", "");
    answer.set("valueFile", "");
    answer.set("imageSource", "");
    answer.set("imageCaption", "");
    answer.set("answerType", QuestionValueType.String);
  }

  let className = "answer-box unique-component";
  if (answer.get("answerType") === QuestionValueType.Image) {
    className += " big-answer";
  }

  let isValid = null;
  if (validationRequired) {
    isValid = true;
    if (
      (answer.get("answerType") === QuestionValueType.String ||
        answer.get("answerType") === QuestionValueType.None) &&
      !answer.get("value")
    ) {
      isValid = false;
    }
  }

  if (isValid === false) {
    className += " invalid-answer";
  }

  return (
    <div className={className} key={answer.get("id")}>
      {type === QuestionValueType.Image ? (
        <RemoveImageButton onClick={removeImage} />
      ) : (
        <RemoveItemButton
          index={index}
          length={list.length}
          onClick={() => props.removeFromList(index)}
        />
      )}
      <QuestionImageDropzone
        answer={answer as any}
        type={type}
        locked={locked}
        fileName={fileName}
        update={setImage}
      />
      {type !== QuestionValueType.Image && (
        <QuillEditor
          disabled={locked}
          sharedData={answer.get("value")}
          validate={validationRequired}
          toolbar={["latex"]}
          isValid={isValid}
          placeholder={"Enter Answer " + (index + 1) + "..."}
          onBlur={props.checkSameAnswer}
        />
      )}
    </div>
  );
};

export default ObservableAnswer;
