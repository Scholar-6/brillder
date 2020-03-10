import React from 'react';
import { Question } from "components/model/question";
import { TextField, Grid } from '@material-ui/core';

import './ShortAnswer.scss';


interface ShortAnswerProps {
  question: Question;
  component: any;
}


const ShortAnswer: React.FC<ShortAnswerProps> = ({ question, component }) => {
  let initAnswers = [];

  for (let item of component.list) {
    initAnswers.push('');
  }

  const [answers, setAnswers] = React.useState(initAnswers);
  let width = (100 - 1) / component.list.length;

  const handleChange = (e: any, index: number) => {
    let updatedAnswers = Object.assign([], answers) as string[];
    updatedAnswers[index] = e.target.value as string;
    setAnswers(updatedAnswers);
  }

  return (
    <div className="short-answer-live">
      {
        component.list.map((input: any, index: number) =>
          <div key={index} className="short-answer-input" style={{ width: `${width}%` }}>
            <Grid container justify="center">
              <TextField value={answers[index]} onChange={e => handleChange(e, index)} id="standard-basic" label={question.hint.list[index]} />
            </Grid>
          </div>
        )
      }
    </div>
  );
}

export default ShortAnswer;
