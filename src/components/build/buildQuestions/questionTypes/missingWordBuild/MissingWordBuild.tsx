import React, { useEffect } from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import Checkbox from '@material-ui/core/Checkbox';

import './MissingWordBuild.scss'
import { UniqueComponentProps } from '../types';
import validator from '../../../questionService/UniqueValidator'
import { showSameAnswerPopup } from '../service/questionBuild';

import AddAnswerButton from 'components/build/baseComponents/addAnswerButton/AddAnswerButton';
import SpriteIcon from 'components/baseComponents/SpriteIcon';


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
  };
}

export const getDefaultMissingWordAnswer = () => {
  const newAnswer = () => ({ value: "", checked: false });
  const newChoice = () => ({ before: "", answers: [newAnswer(), newAnswer(), newAnswer()], after: "", height: "0%" })

  return { choices: [newChoice()] };
}

const MissingWordComponent: React.FC<MissingWordComponentProps> = ({
  locked, data, validationRequired, save, updateComponent, openSameAnswerDialog
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

  const answerChanged = (answer: any, event: any) => {
    answer.value = event.target.value;
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
    update();
    save();
  }

  const beforeChanged = (choice: MissingChoice, event: any) => {
    choice.before = event.target.value;
    update();
  }

  const afterChanged = (choice: MissingChoice, event: any) => {
    choice.after = event.target.value;
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
    if (validationRequired && !answer.value) {
      name += " invalid";
    }
    return name;
  }

  const getAnswerClass = (answer: any) => {
    let name = "";
    if (validationRequired && !answer.value) {
      name += " invalid-answer";
    }
    return name;
  }

  const renderChoice = (choice: MissingChoice, key: number) => {
    let checkBoxValid = !!validator.getChecked(choice.answers);

    return (
      <div className="choose-several-box" key={key}>
        <textarea
          value={choice.before}
          onChange={(event) => { beforeChanged(choice, event) }}
          disabled={locked}
          rows={3}
          placeholder="Text before missing word..."></textarea>
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
                  (choice.answers.length > 3) && <DeleteIcon className="right-top-icon" onClick={() => removeAnswer(choice, i)} />
                }
                <Checkbox
                  className={`left-ckeckbox ${(validationRequired && !checkBoxValid) ? "checkbox-invalid" : ""}`}
                  disabled={locked}
                  checked={answer.checked}
                  onChange={(e) => onChecked(choice, e)} value={i}
                />
                <input
                  placeholder="Enter Answer..."
                  className={getInputClass(answer)}
                  disabled={locked}
                  value={answer.value}
                  onChange={(event: any) => {
                    answerChanged(answer, event);
                  }}
                  onBlur={() => {
                    showSameAnswerPopup(i, choice.answers, openSameAnswerDialog);
                  }}
                />
              </div>
            );
          })
        }
        <textarea
          value={choice.after}
          disabled={locked}
          rows={3}
          placeholder="Text after missing word..."
          onChange={(event) => { afterChanged(choice, event) }}>
        </textarea>
        <AddAnswerButton
          locked={locked} addAnswer={() => { addAnswer(choice) }} height={choice.height}
          label="+ ANSWER"
        />
      </div>
    );
  }

  return (
    <div className="missing-word-build">
      <div className="component-title">
        Tick Correct Answer
      </div>
      {
        state.choices.map((choice, i) => renderChoice(choice, i))
      }
      <AddAnswerButton
        locked={locked} addAnswer={addChoice} height={height}
        label="+ MISSING WORD"
      />
    </div>
  )
}

export default MissingWordComponent
