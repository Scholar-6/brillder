import React, { useEffect } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import Snackbar from "@material-ui/core/Snackbar";

import "./shortAnswerBuild.scss";
import AddAnswerButton from "../../baseComponents/addAnswerButton/AddAnswerButton";
import { UniqueComponentProps } from "../types";
import DocumentWirisCKEditor from "components/baseComponents/ckeditor/DocumentWirisEditor";
import { ShrortAnswerData, ShortAnswerItem } from "./interface";
import { stripHtml } from "components/build/investigationBuildPage/questionService/ConvertService";

export interface ShortAnswerBuildProps extends UniqueComponentProps {
  data: ShrortAnswerData;
}

const ShortAnswerBuildComponent: React.FC<ShortAnswerBuildProps> = ({
  locked,
  data,
  save,
  ...props
}) => {
  const [height, setHeight] = React.useState("0%");

  useEffect(() => calculateHeight());

  if (!data.list) data.list = [{ value: "" }];

  const [state, setState] = React.useState(data);
  const [limitOverflow, setLimitOverflow] = React.useState(false);

  useEffect(() => setState(data), [data]);

  const calculateHeight = () => {
    let showButton = true;
    for (let answer of state.list) {
      if (answer.value === "") {
        showButton = false;
      }
    }
    showButton === true ? setHeight("auto") : setHeight("0%");
  };

  const update = () => {
    setState(Object.assign({}, state));
    props.updateComponent(state);
  };

  const changed = (shortAnswer: ShortAnswerItem, htmlValue: string) => {
    if (locked) return;
    shortAnswer.value = htmlValue;
    const valueString = stripHtml(htmlValue);
    update();
    const res = valueString.split(" ");
    if (res.length <= 3) {
      setLimitOverflow(false);
    } else {
      setLimitOverflow(true);
    }
  };

  const addShortAnswer = () => {
    if (locked) return;
    state.list.push({ value: "" });
    update();
    save();
  };

  const removeFromList = (index: number) => {
    if (locked) return;
    state.list.splice(index, 1);
    update();
    save();
  };

  const renderDeleteButton = (index: number) => {
    if (state.list.length > 1) {
      return (
        <DeleteIcon
        className="right-top-icon"
        onClick={() => removeFromList(index)}
      />
      )
    }
    return "";
  }

  const renderShortAnswer = (answer: ShortAnswerItem, index: number) => {
    return (
      <div className="short-answer-box" key={index}>
        {renderDeleteButton(index)}
        <DocumentWirisCKEditor
          disabled={locked}
          data={answer.value}
          toolbar={["superscript", "subscript"]}
          placeholder={"Enter Short Answer..."}
          onBlur={() => save()}
          onChange={(value) => changed(answer, value)}
        />
      </div>
    );
  };

  return (
    <div className="short-answer-build unique-component">
      {state.list.map((shortAnswer, i) => renderShortAnswer(shortAnswer, i))}
      <AddAnswerButton
        locked={locked}
        addAnswer={addShortAnswer}
        height={height}
        label="+ SHORT ANSWER"
      />
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={limitOverflow}
        onClose={() => setLimitOverflow(false)}
        action={
          <React.Fragment>
            <div>
              <span className="exclamation-mark">!</span>
              Great minds don't think exactly alike: the learner may know the
              right answer but use slightly different language, so there is a
              limit of three words for short answers.
            </div>
          </React.Fragment>
        }
      />
    </div>
  );
};

export default ShortAnswerBuildComponent;
