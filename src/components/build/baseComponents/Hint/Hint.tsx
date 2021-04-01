import React from 'react';
import Y from "yjs";
import * as Yjs from "yjs";
import { withStyles } from '@material-ui/core/styles';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Tooltip from '@material-ui/core/Tooltip';
import sprite from "assets/img/icons-sprite.svg";
import './Hint.scss';
import PageLoader from 'components/baseComponents/loaders/pageLoader';
import QuillEditor from 'components/baseComponents/quill/QuillEditor';
import { QuestionTypeEnum } from 'model/question';


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

export interface HintProps {
  index: number;
  locked: boolean;
  editOnly: boolean;
  hint: Y.Map<any>;
  count?: number;
  component: any;
  questionType: QuestionTypeEnum;
  validationRequired?: boolean;
}

const HintComponent: React.FC<HintProps> = ({
  index, locked, editOnly, validationRequired, ...props
}) => {
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  const handleStatusChange = (event: React.MouseEvent<HTMLElement>, status: HintStatus) => {
    if (locked) { return; }
    props.hint.set("status", status);
    forceUpdate();
  };

  const renderHintInputs = () => {
    if (!props.hint) {
      return <PageLoader content="...Preparing hints..." />;
    }

    if (props.hint.get("status") === HintStatus.All) {
      return (
        <div className="hint-container">
          <QuillEditor
            disabled={locked}
            sharedData={props.hint.get("value")}
            toolbar={[
              'bold', 'italic', 'fontColor', 'superscript', 'subscript',
              'latex', 'insertTable', 'image'
            ]}
            imageDialog={true}
            showToolbar={false}
            validate={validationRequired}
          />
        </div>
      );
    }
    const answerHints: any[] = [];

    if (!props.count) {
      return <PageLoader content="...Preparing hints..." />;
    }

    if (props.hint.toJSON().list.length < props.count) {
      let list = props.hint.get("list") as Y.Array<any>;
      const newItems = Array.from({ length: props.count - list.length }).map(() => new Yjs.Text());
      list.push(newItems);
    }

    for (let i = 0; i < props.count; i++) {
      answerHints.push(
        <div className="hint-container" key={i}>
          <div className="hint-container-label">Answer {i+1}</div>
          <QuillEditor
            disabled={locked}
            sharedData={props.hint.get("list").get(i)}
            toolbar={[
              'bold', 'italic', 'fontColor', 'superscript', 'subscript',
              'latex', 'image'
            ]}
            showToolbar={false}
            imageDialog={true}
            validate={validationRequired}
          />
        </div>
      );
    }
    return answerHints;
  }

  const renderToggleButton = () => {
    let list = props.component.get("list") as Y.Array<any>;
    if (
      !list || list.length <= 1 ||
      props.questionType === QuestionTypeEnum.WordHighlighting ||
      props.questionType === QuestionTypeEnum.LineHighlighting
    ) {
      return (
        <ToggleButtonGroup className="hint-toggle-group" value={HintStatus.All}>
          <ToggleButton className="hint-toggle-button" disabled={locked} value={HintStatus.All}>
            All Answers
          </ToggleButton>
        </ToggleButtonGroup>
      );
    }
    return (
      <ToggleButtonGroup className="hint-toggle-group" value={props.hint.get("status")} exclusive onChange={handleStatusChange}>
        <ToggleButton className="hint-toggle-button" disabled={locked} value={HintStatus.Each}>
          Each Answer
        </ToggleButton>
        <ToggleButton className="hint-toggle-button" disabled={locked} value={HintStatus.All}>
          All Answers
        </ToggleButton>
      </ToggleButtonGroup>
    );
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
          {renderToggleButton()}
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
              }
            >
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
