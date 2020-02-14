
import React from 'react';
import Checkbox from '@material-ui/core/Checkbox'; 

import './Hint.scss';
import { Grid, FormControlLabel } from '@material-ui/core';

interface HintState {
  allAnswers: boolean,
  eachAnswer: boolean,
  hint: string
}

export interface HintProps {
  allAnswers: boolean,
  eachAnswer: boolean,
  hint: string,
  onChange(state: HintState): void
}

const HintComponent: React.FC<HintProps> = (props) => {
  let initState = {
    allAnswers: false,
    eachAnswer: false,
    hint: ""
  } as HintState;

  if (props.hint) {
    initState.hint = props.hint
  }

  if (props.allAnswers) {
    initState.allAnswers = props.allAnswers;
  }

  if (props.eachAnswer) {
    initState.eachAnswer = props.eachAnswer;
  }

  const [state, setState] = React.useState(initState);

  const allChecked = () => {
    setState({...state, allAnswers: true, eachAnswer: false});
    props.onChange({...state, allAnswers: true, eachAnswer: false});
  }

  const eachChecked = () => {
    setState({...state, allAnswers: false, eachAnswer: true});
    props.onChange({...state, allAnswers: false, eachAnswer: true});
  }

  const onHintChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({...state, hint: event.target.value});
    props.onChange({...state, hint: event.target.value});
  }

  return (
    <div className="hint-component">
      <Grid container justify="space-between" item xs={12}>
        <span className="hint-type">Hint Type* <span className="question-mark">?</span></span>
        <FormControlLabel
          control= {
            <Checkbox checked={state.allAnswers} onChange={allChecked} value="allAnswers" />
          }
          label="All Answers"
        />
        <FormControlLabel
          control= {
            <Checkbox checked={state.eachAnswer} onChange={eachChecked} value="eachAnswer" />
          }
          label="Each Answer"
        />
      </Grid>
      <Grid container justify="space-between" item xs={12}>
        <input className="hint-input-text" value={state.hint} onChange={onHintChanged} placeholder="Enter Hint..."></input>
      </Grid>
    </div>
  );
}

export default HintComponent
