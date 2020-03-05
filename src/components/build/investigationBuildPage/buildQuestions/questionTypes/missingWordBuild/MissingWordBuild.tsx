

import React from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import { Button } from '@material-ui/core';

import './MissingWordBuild.scss'


interface Answer {
  value: string
}

export interface MissingChoice {
  before: string
  answers: Answer[]
  after: string
}

export interface MissingWordComponentProps {
  locked: boolean
  data: {
    choices: MissingChoice[]
  }
  updateComponent(component: any): void
}

const MissingWordComponent: React.FC<MissingWordComponentProps> = ({ locked, data, updateComponent }) => {
  const newAnswer = () => ({ before: "", value: "" });
  const newChoice = () => ({ before: "", answers: [newAnswer(), newAnswer(), newAnswer()], after: "" })

  if (!data.choices) {
    data.choices = [newChoice()];
  }

  const [state, setState] = React.useState(data);

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
                <input disabled={locked} value={answer.value} onChange={(event: any) => { answerChanged(answer, event) }} placeholder="Enter Answer..." />
              </div>
            );
          })
        }
        <textarea
          value={choice.after}
          onChange={(event) => {afterChanged(choice, event)}}
          disabled={locked}
          rows={3}
          placeholder="Text after choice..." ></textarea>
        <div className="button-box">
          <Button disabled={locked} className="add-answer-button" onClick={() => { addAnswer(choice) }}>
            + &nbsp;&nbsp; A &nbsp; D &nbsp; D &nbsp; &nbsp; A &nbsp; N &nbsp; S &nbsp; W &nbsp; E &nbsp; R
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="missing-word-build">
      {
        state.choices.map((choice, i) => renderChoice(choice, i))
      }
      <div className="button-box">
        <Button disabled={locked} className="add-answer-button" onClick={addChoice}>
          + &nbsp;&nbsp; A &nbsp; D &nbsp; D &nbsp; &nbsp; M &nbsp; I &nbsp; S &nbsp; S &nbsp; I &nbsp; N &nbsp; G &nbsp; &nbsp; W &nbsp; O &nbsp; R &nbsp; D
        </Button>
      </div>
    </div>
  )
}

export default MissingWordComponent
