

import React, { useEffect } from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import Checkbox from '@material-ui/core/Checkbox'; 

import './MissingWordBuild.scss'
import AddAnswerButton from '../../baseComponents/addAnswerButton/AddAnswerButton';


interface Answer {
  value: string
  checked: boolean
}

export interface MissingChoice {
  before: string
  answers: Answer[]
  after: string
  height: string
}

export interface MissingWordComponentProps {
  locked: boolean
  data: {
    choices: MissingChoice[]
  }
  updateComponent(component: any): void
}

const MissingWordComponent: React.FC<MissingWordComponentProps> = ({ locked, data, updateComponent }) => {
  const [height, setHeight] = React.useState('0%');
  useEffect(() => calculateHeight());

  const newAnswer = () => ({ value: "", checked: false });
  const newChoice = () => ({ before: "", answers: [newAnswer(), newAnswer(), newAnswer()], after: "", height: "0%" })

  if (!data.choices) {
    data.choices = [newChoice()];
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
  }

  const removeAnswer = (choice: MissingChoice, index: number) => {
    choice.answers.splice(index, 1);
    update();
  }

  const addChoice = () => {
    state.choices.push(newChoice());
    update();
  }

  const removeChoice = (index: number) => {
    state.choices.splice(index, 1);
    update();
  }

  const beforeChanged = (choice: MissingChoice, event: any) => {
    choice.before = event.target.value;
    update();
  }

  const afterChanged = (choice: MissingChoice, event: any) => {
    choice.after = event.target.value;
    update();
  }

  const onChecked = (choice: MissingChoice, event:any) => {
    if (locked) { return; }
    const index = event.target.value;
    for (let answer of choice.answers) {
      answer.checked = false;
    }
    choice.answers[index].checked = true;
    update();
  }

  const renderChoice = (choice: MissingChoice, key: number) => {
    return (
      <div className="choose-several-box" key={key}>
        <textarea
          value={choice.before}
          onChange={(event) => {beforeChanged(choice, event)}}
          disabled={locked}
          rows={3}
          placeholder="Text before choice..."></textarea>
        {
          (state.choices.length > 1) ? <DeleteIcon className="right-top-icon" onClick={() => removeChoice(key)} /> : ""
        }
        {
          choice.answers.map((answer, key) => {
            return (
              <div style={{position: 'relative'}} key={key}>
                {
                  (choice.answers.length > 3) ? <DeleteIcon className="right-top-icon" onClick={() => removeAnswer(choice, key)} /> : ""
                }
                <Checkbox className="left-ckeckbox" disabled={locked} checked={answer.checked} onChange={(e) => onChecked(choice, e)} value={key} />
                <input
                  className="input-answer"
                  disabled={locked}
                  value={answer.value}
                  onChange={(event: any) => { answerChanged(answer, event) }}
                  placeholder="Enter Answer..."
                />
              </div>
            );
          })
        }
        <textarea
          value={choice.after}
          onChange={(event) => {afterChanged(choice, event)}}
          disabled={locked}
          rows={3}
          placeholder="Text after choice..." >
        </textarea>
        <AddAnswerButton
          locked={locked} addAnswer={() => { addAnswer(choice) }} height={choice.height}
          label="+ &nbsp;&nbsp; A &nbsp; N &nbsp; S &nbsp; W &nbsp; E &nbsp; R"
        />
      </div>
    );
  }

  return (
    <div className="missing-word-build">
      {
        state.choices.map((choice, i) => renderChoice(choice, i))
      }
      <AddAnswerButton
        locked={locked} addAnswer={addChoice} height={height}
        label="+ &nbsp;&nbsp; M &nbsp; I &nbsp; S &nbsp; S &nbsp; I &nbsp; N &nbsp; G &nbsp; &nbsp; W &nbsp; O &nbsp; R &nbsp; D"
      />
    </div>
  )
}

export default MissingWordComponent
