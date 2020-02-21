
import React from 'react';
import Checkbox from '@material-ui/core/Checkbox'; 

import { Grid, FormControlLabel } from '@material-ui/core';

import './Hint.scss';


export enum HintStatus {
  None,
  All,
  Each
}

export interface HintState {
  status: HintStatus
  value: string
}

export interface HintProps {
  status?: HintStatus,
  value?: string,
  onChange(state: HintState): void
}

const HintComponent: React.FC<HintProps> = ({onChange, ...props}) => {
  let initState = {
    status: HintStatus.None,
    value: ''
  } as HintState;

  if (props.value) {
    initState.value = props.value;
  }

  if (props.status) {
    initState.status = props.status;
  }

  const [state, setState] = React.useState(initState);

  const allChecked = () => {
    setState({...state, status: HintStatus.All});
    onChange({...state, status: HintStatus.All});
  }

  const eachChecked = () => {
    setState({...state, status: HintStatus.Each});
    onChange({...state, status: HintStatus.Each});
  }

  const onHintChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({...state, value: event.target.value});
    onChange({...state, value: event.target.value});
  }

  return (
    <div className="hint-component">
      <Grid container justify="space-between" item xs={12}>
        <span className="hint-type">Hint Type* <span className="question-mark">?</span></span>
        <FormControlLabel
          control= {
            <Checkbox checked={state.status === HintStatus.All} onChange={allChecked} value="allAnswers" />
          }
          label="All Answers"
        />
        <FormControlLabel
          control= {
            <Checkbox checked={state.status === HintStatus.Each} onChange={eachChecked} value="eachAnswer" />
          }
          label="Each Answer"
        />
      </Grid>
      <Grid container justify="space-between" item xs={12}>
        <input className="hint-input-text" value={state.value} onChange={onHintChanged} placeholder="Enter Hint..."></input>
      </Grid>
    </div>
  );
}

export default HintComponent
