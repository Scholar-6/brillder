import React, { useEffect } from 'react'
import Checkbox from '@material-ui/core/Checkbox';

import './MissingWordBuild.scss'
import { UniqueComponentProps } from '../types';
import validator from '../../../questionService/UniqueValidator'
import { showSameAnswerPopup } from '../service/questionBuild';

import AddAnswerButton from 'components/build/baseComponents/addAnswerButton/AddAnswerButton';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import MissingWordQuill from 'components/baseComponents/quill/MissingWordQuill';
import { stripHtml } from 'components/build/questionService/ConvertService';


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
  data: {
    choices: MissingChoice[];
    isPoem?: boolean;
  };
}

export const getDefaultMissingWordAnswer = () => {
  const newAnswer = () => ({ value: "", checked: false });
  const newChoice = () => ({ before: "", answers: [newAnswer(), newAnswer(), newAnswer()], after: "", height: "0%" })

  return { choices: [newChoice()] };
}

const MissingWordComponent: React.FC<MissingWordComponentProps> = ({
  locked, data, validationRequired, save, updateComponent, openSameAnswerDialog, removeHintAt
}) => {
  const [height, setHeight] = React.useState('0%');
  useEffect(() => calculateHeight());

  const newAnswer = () => ({ value: "", checked: false });
  const newChoice = () => ({ before: "", answers: [newAnswer(), newAnswer(), newAnswer()], after: "", height: "0%" })

  if (!data.choices) {
    data.choices = getDefaultMissingWordAnswer().choices;
  }

  const [state, setState] = React.useState(data);

  useEffect(() => { setState(data) }, [data]);

  const calculateHeight = () => {
    let showButton = true;
    for (let choice of state.choices) {
      choice.height = "auto";
      for (let answer of choice.answers) {
        if (answer.value === "") {
          showButton = false;
          choice.height = "0%";
        }
      }
    }
    showButton === true ? setHeight('auto') : setHeight('0%');
    setState(state);
  }

  const update = () => {
    setState(Object.assign({}, state));
    updateComponent(state);
  }

  const answerChanged = (answer: any, v: string) => {
    answer.value = v;
    update();
  }

  const addAnswer = (choice: MissingChoice) => {
    choice.answers.push(newAnswer());
    update();
    save();
  }

  const removeAnswer = (choice: MissingChoice, index: number) => {
    choice.answers.splice(index, 1);
    update();
    save();
  }

  const addChoice = () => {
    state.choices.push(newChoice());
    update();
    save();
  }

  const removeChoice = (index: number) => {
    state.choices.splice(index, 1);
    removeHintAt(index);
    update();
    save();
  }

  const beforeChanged = (choice: MissingChoice, v: string) => {
    choice.before = v;
    update();
  }

  const afterChanged = (choice: MissingChoice, v: string) => {
    choice.after = v;
    update();
  }

  const onChecked = (choice: MissingChoice, event: any) => {
    if (locked) { return; }
    const index = event.target.value;
    for (let answer of choice.answers) {
      answer.checked = false;
    }
    choice.answers[index].checked = true;
    update();
    save();
  }

  const getInputClass = (answer: any) => {
    let name = "input-answer";
    if (validationRequired && !stripHtml(answer.value)) {
      name += " invalid";
    }
    return name;
  }

  const getAnswerClass = (answer: any) => {
    let name = "";
    if (validationRequired && !stripHtml(answer.value)) {
      name += " invalid-answer";
    }
    return name;
  }

  const renderChoice = (choice: MissingChoice, key: number) => {
    let checkBoxValid = !!validator.getChecked(choice.answers);

    return (
      <div className="choose-several-box" key={key}>
        <MissingWordQuill
          data={choice.before}
          className="missing-big-text"
          toolbar={['bold', 'italic', 'latex']}
          onChange={v => beforeChanged(choice, v)}
          disabled={locked}
          placeholder="Text before missing word"
        />
        {
          (state.choices.length > 1)
          && <button className="btn btn-transparent right-top-icon svgOnHover" onClick={() => removeChoice(key)}>
            <SpriteIcon name="trash-outline" className="active back-button theme-orange" />
          </button>
        }
        {
          choice.answers.map((answer, i) => {
            return (
              <div style={{ position: 'relative' }} className={getAnswerClass(answer)} key={i}>
                {
                  (choice.answers.length > 3) && <SpriteIcon name="trash-outline" className="right-top-icon" onClick={() => removeAnswer(choice, i)} />
                }
                <Checkbox
                  className={`left-ckeckbox ${(validationRequired && !checkBoxValid) ? "checkbox-invalid" : ""}`}
                  disabled={locked}
                  checked={answer.checked}
                  onChange={(e) => onChecked(choice, e)} value={i}
                />
                <MissingWordQuill
                  placeholder="Enter Answer"
                  toolbar={['bold', 'italic', 'latex']}
                  className={getInputClass(answer)}
                  disabled={locked}
                  data={answer.value}
                  onChange={v => {
                    answerChanged(answer, v);
                  }}
                  onBlur={() => {
                    showSameAnswerPopup(i, choice.answers, openSameAnswerDialog);
                  }}
                />
              </div>
            );
          })
        }
        <MissingWordQuill
          data={choice.after}
          className="missing-big-text"
          toolbar={['bold', 'italic', 'latex']}
          onChange={v => afterChanged(choice, v)}
          disabled={locked}
          placeholder="Text after missing word"
        />
        <AddAnswerButton
          locked={locked} addAnswer={() => { addAnswer(choice) }} height={choice.height}
          label="Add an answer option"
        />
      </div>
    );
  }

  const renderPoemToggle = () => {
    let className = 'poem-toggle';
    if (data.isPoem) {
      className += ' active';
    }
    return (
      <div className={className} onClick={() => {
        data.isPoem = !data.isPoem;
        update();
        save();
      }}>
        br
      </div>
    );
  }

  return (
    <div className="missing-word-build">
      <div className="component-title">
        <div className="flex-center">
          <SpriteIcon name="feacher-check-square" />
          <div>Tick Correct Answer</div>
          {renderPoemToggle()}
        </div>
      </div>
      {
        state.choices.map((choice, i) => renderChoice(choice, i))
      }
      <AddAnswerButton
        locked={locked} addAnswer={addChoice} height={height}
        label="Add a new sentence"
      />
    </div>
  )
}

export default MissingWordComponent
