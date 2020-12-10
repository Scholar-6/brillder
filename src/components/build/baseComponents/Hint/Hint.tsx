
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Tooltip from '@material-ui/core/Tooltip';
import sprite from "assets/img/icons-sprite.svg";
import './Hint.scss';
import DocumentWirisCKEditor from 'components/baseComponents/ckeditor/DocumentWirisEditor';
import PageLoader from 'components/baseComponents/loaders/pageLoader';
import QuillEditor from 'components/baseComponents/quill/QuillEditor';


const HtmlTooltip = withStyles((theme: any) => ({
  tooltip: {
    backgroundColor: '#193366',
    padding: '1.5vh 1vw',
    maxWidth: '17vw',
    border: 0,
    fontSize: '1vw',
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

  React.useEffect(() => {
    if(props.value) {
      setState({ ...state, value: props.value });
    }
  /*eslint-disable-next-line*/
  }, [props.value])

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
    save();
  }

  const onHintListChanged = (value: string, index: number) => {
    if (locked) { return; }
    let { list } = state;
    list[index] = value;
    onChange({ ...state, list });
    save();
  }

  const handleStatusChange = (event: React.MouseEvent<HTMLElement>, status: HintStatus) => {
    if (locked) { return; }
    setState({ ...state, status });
    onChange({ ...state, status });
    save();
  };

  const renderHintInputs = () => {
    if (state.status === HintStatus.All) {
      return (
        <div className="hint-container">
          <QuillEditor
            disabled={locked}
            data={state.value}
            toolbar={[
              'bold', 'italic', 'fontColor', 'superscript', 'subscript',
              'latex', 'chemType', 'insertTable', 'uploadImageCustom'
            ]}
            validate={validationRequired}
            onChange={onHintChanged}
          />
        </div>
      );
    }
    const answerHints: any[] = [];

    if (!props.count) {
      return <PageLoader content="...Preparing hints..." />;
    }

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
          <QuillEditor
            disabled={locked}
            data={state.list[i]}
            toolbar={[
              'bold', 'italic', 'fontColor', 'superscript', 'subscript',
              'latex', 'chemType', 'imageUploadCustom'
            ]}
            validate={validationRequired}
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
        <div className="unselectable">
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
        <div className="unselectable">
          <div className="hint-question-circle">
            <HtmlTooltip
              title={
                <React.Fragment>
                  <div>Hints written here are introduced to</div>
                  <div>the student in the Review phase.</div>
                  <div style={{marginTop: '1.2vw'}}>
                    Good hints usher the student closer to the correct answer,
                    or the correct strategy, without giving it away.
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
