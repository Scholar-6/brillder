import React from "react";
import * as Y from "yjs";
import Snackbar from "@material-ui/core/Snackbar";

import "./shortAnswerBuild.scss";
import { UniqueComponentProps } from "../types";

import AddAnswerButton from "components/build/baseComponents/addAnswerButton/AddAnswerButton";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import QuillEditor from "components/baseComponents/quill/QuillEditor";
import { HintStatus } from "model/question";


export interface ShortAnswerBuildProps extends UniqueComponentProps {
  data: Y.Map<any>;
  hint: Y.Map<any>;
}

export const getDefaultShortAnswerAnswer = (ymap: Y.Map<any>) => {
  const newAnswer = () => new Y.Map(Object.entries({ value: new Y.Text() }));

  const list = new Y.Array();
  list.push([newAnswer()]);

  ymap.set("list", list);
  return ymap;
}

const ShortAnswerBuildComponent: React.FC<ShortAnswerBuildProps> = ({
  locked, editOnly, data, save, ...props
}) => {
  const [limitOverflow, setLimitOverflow] = React.useState(false);

  const newAnswer = () => new Y.Map(Object.entries({ value: new Y.Text() }));

  let list = data.get("list") as Y.Array<any>;

  const addShortAnswer = () => {
    if (locked) return;
    list.push([newAnswer()]);
  };

  if (!list) {
    getDefaultShortAnswerAnswer(data);
    list = data.get("list");
  } else if (list.length < 1) {
    addShortAnswer();
  }

  const removeFromList = (index: number) => {
    if (locked) return;
    if(list.length > 2) {
      list.delete(index, 1);
    } else if(list.length === 2) {
      list.delete(index, 1);
      if(props.hint.get("status") === HintStatus.Each) {
        props.hint.set("status", HintStatus.All);
      }
    }
  };

  const renderDeleteButton = (index: number) => {
    if (list.length > 1) {
      return (
        <button className="btn btn-transparent right-top-icon svgOnHover" onClick={() => removeFromList(index)}>
          <SpriteIcon name="trash-outline" className="active back-button theme-orange" />
        </button>
      )
    }
  }

  const renderShortAnswer = (answer: Y.Map<any>, index: number) => {
    let className = "short-answer-box";
    if (props.validationRequired) {
      if (!answer.get("value")) {
        className += ' invalid-answer';
      }
    }
    return (
      <div className={className} key={index}>
        {renderDeleteButton(index)}
        <QuillEditor
          disabled={locked}
          validate={props.validationRequired}
          sharedData={answer.get("value")}
          toolbar={["superscript", "subscript"]}
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
      {list.map((shortAnswer: Y.Map<any>, i) => renderShortAnswer(shortAnswer, i))}
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

export default React.memo(ShortAnswerBuildComponent);
