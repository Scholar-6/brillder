
import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { Grid } from '@material-ui/core';

import './Hint.scss';


export enum HintStatus {
  None,
  All,
  Each
}

export interface HintState {
  status: HintStatus
  value: string
  list: string[]
}

export interface HintProps {
  status?: HintStatus,
  value?: string,
  count?: number,
  onChange(state: HintState): void
}

const HintComponent: React.FC<HintProps> = ({ onChange, ...props }) => {
  let initState = {
    status: HintStatus.None,
    value: '',
    list: []
  } as HintState;

  if (props.value) {
    initState.value = props.value;
  }

  if (props.status) {
    initState.status = props.status;
  }

  const [state, setState] = React.useState(initState);

  const allChecked = () => {
    setState({ ...state, status: HintStatus.All });
    onChange({ ...state, status: HintStatus.All });
  }

  const eachChecked = () => {
    setState({ ...state, status: HintStatus.Each });
    onChange({ ...state, status: HintStatus.Each });
  }

  const onHintChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, value: event.target.value });
    onChange({ ...state, value: event.target.value });
  }

  const onHintListChanged = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    onChange({ ...state, value: event.target.value });
  }

  const handleStatusChange = (event: React.MouseEvent<HTMLElement>, status: HintStatus) => {
    console.log(status, typeof status)
    setState({...state, status});
  };

  const renderHintInputs = () => {
    if (state.status === HintStatus.All || !props.count || props.count === 1) {
      return (
        <Grid container item xs={12}>
          <input className="hint-input-text" value={state.value} onChange={onHintChanged} placeholder="Enter Hint..."></input>
        </Grid>
      );
    }
    const answerHints: any[] = [];

    for (let i = 0; i < props.count; i++) {
      answerHints.push(
        <Grid container item xs={12}>
          <input className="hint-input-text" value={state.list[i]} onChange={onHintChanged} placeholder="Enter Hint..."></input>
        </Grid>
      );
    }
    return answerHints;
  }

  return (
    <div className="hint-component">
      <Grid container direction="row">
        <Grid container item xs={3} alignContent="center">
          <Grid className="hint-type-text" style={{ width: '100%' }}>
            <div>H I N T</div>
            <div>T Y P E</div>
          </Grid>
        </Grid>
        <Grid container item xs={7} justify="flex-start" alignContent="center">
          <ToggleButtonGroup className="hint-toggle-group" value={state.status} exclusive onChange={handleStatusChange}>
            <ToggleButton value={HintStatus.Each}>
              Each Answer
            </ToggleButton>
            <ToggleButton value={HintStatus.All}>
              All Answers
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid container item xs={2} alignContent="center" justify="flex-end">
          <span className="hint-type"><span className="question-mark">?</span></span>
        </Grid>
      </Grid>
      {renderHintInputs()}
    </div>
  );
}

export default HintComponent
