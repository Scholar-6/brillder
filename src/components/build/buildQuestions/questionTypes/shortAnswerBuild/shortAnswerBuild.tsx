import React, { useEffect } from "react";
import Snackbar from "@material-ui/core/Snackbar";

import "./shortAnswerBuild.scss";
import { UniqueComponentProps } from "../types";
import { ShortAnswerData, ShortAnswerItem } from "./interface";

import { stripHtml } from "components/build/questionService/ConvertService";
import DocumentWirisCKEditor from "components/baseComponents/ckeditor/DocumentWirisEditor";
import AddAnswerButton from "components/build/baseComponents/addAnswerButton/AddAnswerButton";
import SpriteIcon from "components/baseComponents/SpriteIcon";


export interface ShortAnswerBuildProps extends UniqueComponentProps {
  data: ShortAnswerData;
}

export const getDefaultShortAnswerAnswer = () => {
  return { list: [{ value: "" }] };
}

const ShortAnswerBuildComponent: React.FC<ShortAnswerBuildProps> = ({
  locked, editOnly, data, save, ...props
}) => {
  if (!data.list) data.list = getDefaultShortAnswerAnswer().list;

  const [state, setState] = React.useState(data);
  const [limitOverflow, setLimitOverflow] = React.useState(false);

  useEffect(() => setState(data), [data]);

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
        <button className="btn btn-transparent right-top-icon svgOnHover" onClick={() => removeFromList(index)}>
          <SpriteIcon name="trash-outline" className="active back-button theme-orange" />
        </button>
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
          validationRequired={props.validationRequired}
          editOnly={editOnly}
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
      <div className="component-title">
        Take care to choose an unambiguous answer. <br/>
        Specify the required form and whether an article is expected.
      </div>
      {state.list.map((shortAnswer, i) => renderShortAnswer(shortAnswer, i))}
      <AddAnswerButton
        locked={locked}
        addAnswer={addShortAnswer}
        height="auto"
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
