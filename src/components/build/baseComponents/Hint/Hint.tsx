
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Tooltip from '@material-ui/core/Tooltip';
import sprite from "assets/img/icons-sprite.svg";
import './Hint.scss';
import DocumentWirisCKEditor from 'components/baseComponents/ckeditor/DocumentWirisEditor';
import PageLoader from 'components/baseComponents/loaders/pageLoader';


const HtmlTooltip = withStyles((theme: any) => ({
  tooltip: {
    backgroundColor: '#193366',
    padding: '1.5vh 1vw',
    maxWidth: '17vw',
    border: 0,
    fontSize: '0.8vw',
    fontFamily: 'Brandon Grotesque Regular',
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
  editOnly: boolean;
  list: string[];
  status?: HintStatus;
  value?: string;
  count?: number;
  validationRequired?: boolean;
  save(): void;
  onChange(state: HintState): void;
}

const HintComponent: React.FC<HintProps> = ({
  index, locked, editOnly, validationRequired, onChange, save, ...props
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
    let { list } = state;
    list[index] = value;
    onChange({ ...state, list });
  }

  const handleStatusChange = (event: React.MouseEvent<HTMLElement>, status: HintStatus) => {
    if (locked) { return; }
    if (status === HintStatus.All) {
      setState({ ...state, status, list: [] });
      onChange({ ...state, status, list: [] });
    } else {
      setState({ ...state, status });
      onChange({ ...state, status });
    }
    save();
  };

  const renderHintInputs = () => {
    console.log(state, state.list, props.count);
    if (state.status === HintStatus.All || !props.count || props.count === 1) {
      return (
        <div className="hint-container">
          <DocumentWirisCKEditor
            disabled={locked}
            editOnly={editOnly}
            data={state.value}
            toolbar={[
              'bold', 'italic', 'fontColor', 'superscript', 'subscript',
              'mathType', 'chemType', 'insertTable', 'uploadImageCustom'
            ]}
            placeholder="Enter Hint..."
            validationRequired={validationRequired}
            onBlur={() => save()}
            onChange={onHintChanged}
          />
        </div>
      );
    }
    const answerHints: any[] = [];

    if (state.list.length < props.count) {
      let list = state.list;
      for (let i = 0; i < props.count; i++) {
        if (state.list.length < props.count) {
          list.push('');
        } else {
          setState({ ...state, list });
          return <PageLoader content="...Preparing hints..." />;
        }
      }
    }

    for (let i = 0; i < props.count; i++) {
      answerHints.push(
        <div className="hint-container" key={i}>
          <DocumentWirisCKEditor
            disabled={locked}
            editOnly={editOnly}
            data={state.list[i]}
            toolbar={[
              'bold', 'italic', 'fontColor', 'superscript', 'subscript',
              'mathType', 'chemType', 'imageUploadCustom'
            ]}
            placeholder="Enter Hint"
            validationRequired={validationRequired}
            onBlur={() => save()}
            onChange={(v: any) => { onHintListChanged(v, i) }}
          />
        </div>
      );
    }
    return answerHints;
  }

  return (
    <div className="hint-component">
      <div className="hint-header">
        <div>
          <div className="hint-type-text">
            <span>HINT<br />TYPE</span>
          </div>
        </div>
        <div>
          <ToggleButtonGroup className="hint-toggle-group" value={state.status} exclusive onChange={handleStatusChange}>
            <ToggleButton className="hint-toggle-button" disabled={locked} value={HintStatus.Each}>
              Each Answer
            </ToggleButton>
            <ToggleButton className="hint-toggle-button" disabled={locked} value={HintStatus.All}>
              All Answers
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div>
          <div className="hint-question-circle">
            <HtmlTooltip
              title={
                <React.Fragment>
                  <div>
                    Hints ensure that the learner has to keep
                    re-evaluating when reviewing material.
                    This is why our interface does not allow for standard true or false questions:
                    much less can be gained by a blind click at the second time of asking.
                    <div>
                      We only give teachers the correct answers.
                    </div>
                  </div>
                </React.Fragment>
            }>
              <button className="btn btn-transparent svgOnHover question-mark">
                <svg className="svg w80 h80 active">
                  {/*eslint-disable-next-line*/}
                  <use href={sprite + "#help-thin"} />
                </svg>
              </button>
            </HtmlTooltip>
          </div>
        </div>
      </div>
      <div className="hint-content">
        {renderHintInputs()}
      </div>
    </div>
  );
}

export default HintComponent
