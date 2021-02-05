import React, { useEffect } from 'react';
import * as Y from "yjs";
import DeleteIcon from '@material-ui/icons/Delete';
import Checkbox from '@material-ui/core/Checkbox';

import './MissingWordBuild.scss'
import { UniqueComponentProps } from '../types';
import validator from '../../../questionService/UniqueValidator'
import { generateId, showSameAnswerPopup } from '../service/questionBuild';

import AddAnswerButton from 'components/build/baseComponents/addAnswerButton/AddAnswerButton';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import QuillEditor from 'components/baseComponents/quill/QuillEditor';


interface Answer {
  value: string;
  checked: boolean;
}

export interface MissingChoice {
  before: string;
  answers: Answer[];
  after: string;
  height: string;
}

export interface MissingWordComponentProps extends UniqueComponentProps {
  data: Y.Map<any>;
}

export const getDefaultMissingWordAnswer = (ymap: Y.Map<any>) => {
  const newAnswer = () => new Y.Map(Object.entries({ value: new Y.Text(), checked: false, id: generateId() }));
  const newChoice = () => {
    const answers = new Y.Array();
    answers.push([newAnswer(), newAnswer(), newAnswer()]);
    return new Y.Map(Object.entries({ before: new Y.Text(), answers, after: new Y.Text(), height: "0%", id: generateId() }));
  };

  const choices = new Y.Array();
  choices.push([newChoice()]);
  ymap.set("choices", choices);
}

const MissingWordComponent: React.FC<MissingWordComponentProps> = ({
  locked, data, validationRequired, save, updateComponent, openSameAnswerDialog
}) => {
  const [height, setHeight] = React.useState('0%');
  useEffect(() => calculateHeight());

  const newAnswer = () => new Y.Map(Object.entries({ value: new Y.Text(), checked: false, id: generateId() }));
  const newChoice = () => {
    const answers = new Y.Array();
    answers.push([newAnswer(), newAnswer(), newAnswer()]);
    return new Y.Map(Object.entries({ before: new Y.Text(), answers, after: new Y.Text(), height: "0%", id: generateId() }));
  };

  let choices = data.get("choices") as Y.Array<any>;

  if (!choices) {
    getDefaultMissingWordAnswer(data);
    choices = data.get("choices");
  }

  const calculateHeight = () => {
    let showButton = true;
    choices.forEach((choice: Y.Map<any>) => {
      let autoHeight = true;
      choice.get("answers").forEach((answer: Y.Map<any>) => {
        if (answer.get("value").toString() === "") {
          showButton = false;
          autoHeight = false;
        }
      });
      if(autoHeight && choice.get("height") !== "auto") {
        choice.set("height", "auto");
      } else if (!autoHeight && choice.get("height") !== "0%") {
        choice.set("height", "0%");
      }
    });
    showButton === true ? setHeight('auto') : setHeight('0%');
  }

  const addAnswer = (choice: Y.Map<any>) => {
    choice.get("answers").push([newAnswer()]);
  }

  const removeAnswer = (choice: Y.Map<any>, index: number) => {
    choice.get("answers").delete(index);
  }

  const addChoice = () => {
    choices.push([newChoice()]);
  }

  const removeChoice = (index: number) => {
    choices.delete(index);
  }

  const onChecked = (choice: Y.Map<any>, event: any) => {
    if (locked) { return; }
    const index = event.target.value;
    choice.get("answers").forEach((answer: Y.Map<any>) => {
      if(answer.get("checked") !== false) {
        answer.set("checked", false);
      }
    });
    choice.get("answers").get(index).set("checked", true);
  }

  const getInputClass = (answer: Y.Map<any>) => {
    let name = "input-answer";
    if (validationRequired && !answer.get("value").toString()) {
      name += " invalid";
    }
    return name;
  }

  const getAnswerClass = (answer: Y.Map<any>) => {
    let name = "";
    if (validationRequired && !answer.get("value").toString()) {
      name += " invalid-answer";
    }
    return name;
  }

  const renderChoice = (choice: Y.Map<any>, key: number) => {
    let checkBoxValid = !!validator.getChecked(choice.get("answers").toJSON());

    return (
      <div className="choose-several-box" key={choice.get("id")}>
        <QuillEditor
          className="textarea"
          toolbar={[]}
          sharedData={choice.get("before")}
          disabled={locked}
          placeholder="Text before missing word..." />
        {
          (choices.length > 1)
            && <button className="btn btn-transparent right-top-icon svgOnHover" onClick={() => removeChoice(key)}>
              <SpriteIcon name="trash-outline" className="active back-button theme-orange" />
            </button>
        }
        {
          choice.get("answers").map((answer: Y.Map<any>, i: number) => {
            return (
              <div style={{ position: 'relative' }} className={getAnswerClass(answer)} key={answer.get("id")}>
                {
                  (choice.get("answers").length > 3) && <DeleteIcon className="right-top-icon" onClick={() => removeAnswer(choice, i)} />
                }
                <Checkbox
                  className={`left-ckeckbox ${(validationRequired && !checkBoxValid) ? "checkbox-invalid" : ""}`}
                  disabled={locked}
                  checked={answer.get("checked")}
                  onChange={(e) => onChecked(choice, e)} value={i}
                />
                <QuillEditor
                  toolbar={[]}
                  placeholder="Enter Answer..."
                  className={getInputClass(answer)}
                  disabled={locked}
                  sharedData={answer.get("value")}
                  onBlur={() => {
                    showSameAnswerPopup(i, choice.get("answers").toJSON(), openSameAnswerDialog);
                  }}
                />
              </div>
            );
          })
        }
        <QuillEditor
          className="textarea"
          toolbar={[]}
          sharedData={choice.get("after")}
          disabled={locked}
          placeholder="Text after missing word..."
        />
        <AddAnswerButton
          locked={locked} addAnswer={() => { addAnswer(choice) }} height={choice.get("height")}
          label="+ ANSWER"
        />
      </div>
    );
  }

  return (
    <div className="missing-word-build unique-component">
      <div className="component-title">
        Tick Correct Answer
      </div>
      {
        choices.map((choice: Y.Map<any>, i) => renderChoice(choice, i))
      }
      <AddAnswerButton
        locked={locked} addAnswer={addChoice} height={height}
        label="+ MISSING WORD"
      />
    </div>
  )
}

export default MissingWordComponent
