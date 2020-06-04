
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { Grid } from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import Tooltip from '@material-ui/core/Tooltip';

import './Hint.scss';
import DocumentWirisCKEditor from 'components/baseComponents/ckeditor/DocumentWirisEditor';


const HtmlTooltip = withStyles((theme:any) => ({
  tooltip: {
    backgroundColor: '#193366',
    padding: '1.5vh 1vw',
    maxWidth: '17vw',
    border: 0,
  },
}))(Tooltip);

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
  index: number;
  locked: boolean;
  list: string[];
  status?: HintStatus;
  value?: string;
  count?: number;
  validationRequired?: boolean;
  save(): void;
  onChange(state: HintState): void;
}

const HintComponent: React.FC<HintProps> = ({
  index, locked, validationRequired, onChange, save, ...props
}) => {
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

  const onHintChanged = (value: string) => {
    if (locked) { return; }
    setState({ ...state, value });
    onChange({ ...state, value });
  }

  const onHintListChanged = (value: string, index: number) => {
    if (locked) { return; }
    let {list} = state;
    list[index] = value;
    onChange({ ...state, list });
  }

  const handleStatusChange = (event: React.MouseEvent<HTMLElement>, status: HintStatus) => {
    if (locked) { return; }
    if (status === HintStatus.All) {
      setState({...state, status, list: []});
      onChange({...state, status, list: []});
    } else {
      setState({...state, status});
      onChange({...state, status});
    }
    save();
  };

  const renderHintInputs = () => {
    if (state.status === HintStatus.All || !props.count || props.count === 1) {
      return (
        <Grid container item xs={12} className="hint-container">
          <DocumentWirisCKEditor
            data={state.value}
            toolbar={['bold', 'italic', 'fontColor', 'mathType', 'chemType', 'insertTable']}
            placeholder="Enter Hint..."
            validationRequired={validationRequired}
            onBlur={() => save()}
            onChange={onHintChanged}
          />
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
        <Grid key={i} container item xs={12} className="hint-container">
          <DocumentWirisCKEditor
            data={state.list[i]}
            toolbar={['bold', 'italic', 'fontColor', 'mathType', 'chemType',]}
            placeholder="Enter Hint"
            validationRequired={validationRequired}
            onBlur={() => save()}
            onChange={(v:any) => {onHintListChanged(v, i)}}
          />
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
            <HtmlTooltip
              title={
                <React.Fragment>
                  <div className="hint-question-mark-hover-title">
                    <span className="question-mark">?</span>
                    Hints ensure that the learner has to keep
                    re-evaluating when reviewing material.
                    This is why our interface does not allow for standard true or false questions:
                    much less can be gained by a blind click at the second time of asking.
                    <div>
                      We only give teachers the correct answers.
                    </div>
                  </div>
                </React.Fragment>
              }
            >
              <span className="question-mark">?</span>
            </HtmlTooltip>
          </Grid>
        </Grid>
      </Grid>
      {renderHintInputs()}
    </div>
  );
}

export default HintComponent
