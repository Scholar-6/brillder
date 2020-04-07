
import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { Grid } from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import './Hint.scss';


export enum HintStatus {
  None,
  All,
  Each
}

export interface HintState {
  index: number,
  status: HintStatus
  value: string
  list: string[]
}

export interface HintProps {
  index: number,
  locked: boolean,
  list: string[],
  status?: HintStatus,
  value?: string,
  count?: number,
  onChange(state: HintState): void
}

const HintComponent: React.FC<HintProps> = ({ index, onChange, locked, ...props }) => {
  let initState = {
    status: HintStatus.All,
    value: '',
    index,
    list: []
  } as HintState;

  if (props.value) {
    initState.value = props.value;
  }

  if (props.list) {
    initState.list = props.list;
  }

  if (props.status) {
    initState.status = props.status;
  }

  const [state, setState] = React.useState(initState);

  if (state.index !== index) {
    setState(initState);
  }

  if (state.status !== initState.status) {
    setState(initState);
  }

  const onHintChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (locked) { return; }
    setState({ ...state, value: event.target.value });
    onChange({ ...state, value: event.target.value });
  }

  const onHintListChanged = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (locked) { return; }
    let {list} = state;
    list[index] = event.target.value;
    onChange({ ...state, list });
  }

  const handleStatusChange = (event: React.MouseEvent<HTMLElement>, status: HintStatus) => {
    if (locked) { return; }
    setState({...state, status});
    onChange({...state, status});
  };

  const renderHintInputs = () => {
    if (state.status === HintStatus.All || !props.count || props.count === 1) {
      return (
        <Grid container item xs={12}>
          <input disabled={locked} className="hint-input-text" value={state.value} onChange={onHintChanged} placeholder="Enter Hint..."></input>
        </Grid>
      );
    }
    const answerHints: any[] = [];

    if (state.list.length < props.count) {
      let list = state.list;
      for (let i = 0; i < props.count; i++) {
        if (state.list.length < props.count) {
          list.push('');
          
        } else {
          setState({...state, list});
          return <div>...Preparing hints...</div>
        }
      }
    }

    for (let i = 0; i < props.count; i++) {
      answerHints.push(
        <Grid key={i} container item xs={12}>
          <input
            disabled={locked}
            className="hint-input-text"
            value={state.list[i]}
            onChange={(e) => {onHintListChanged(e, i)}}
            placeholder="Enter Hint..."/>
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
            <ToggleButton className="hint-toggle-button" disabled={locked} value={HintStatus.Each}>
              Each Answer
            </ToggleButton>
            <ToggleButton className="hint-toggle-button" disabled={locked} value={HintStatus.All}>
              All Answers
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid container item xs={2} alignContent="center" justify="flex-end" style={{position: 'relative'}}>
          <FiberManualRecordIcon className="hint-question-circle" />
          <Grid container alignContent="center" justify="center" className="hint-type">
            <span className="question-mark">?</span>
          </Grid>
        </Grid>
      </Grid>
      {renderHintInputs()}
    </div>
  );
}

export default HintComponent
