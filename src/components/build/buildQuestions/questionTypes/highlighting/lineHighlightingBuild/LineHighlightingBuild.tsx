import React, { useEffect } from 'react'

import '../style.scss';
import './LineHighlightingBuild.scss'
import { UniqueComponentProps } from '../../types';

import PageLoader from 'components/baseComponents/loaders/pageLoader';
import { HighlightMode } from '../model';
import HighlightButton from '../components/HighlightButton';
import LineStyleDialog from '../wordHighlighting/LineStyleDialog';
import { htmlChildren, stripHtml } from 'components/build/questionService/ConvertService';
import QuillEditor from 'components/baseComponents/quill/QuillEditor';


export interface Line {
  text: string;
  checked: boolean;
}

export interface LineHighlightingData {
  text: string;
  lines: Line[];
  isPoem: boolean;
  mode: HighlightMode;
}

export interface LineHighlightingProps extends UniqueComponentProps {
  data: LineHighlightingData;
}

export const getDefaultLineHighlightingAnswer = () => {  
  return { text: '', lines: [] };
}

const LineHighlightingComponent: React.FC<LineHighlightingProps> = ({
  locked, data, validationRequired, save, updateComponent
}) => {
  const [state, setState] = React.useState(data);
  const [isOpen, setDialog] = React.useState(false);

  useEffect(() => {
    if (!data.text) { data.text = ''; }
    if (!data.lines) { data.lines = []; }
    setState(data);
  }, [data]);

  const update = () => {
    setState(Object.assign({}, state));
    updateComponent(state);
  }

  const prepareLines = (text: string):Line[] => {
    if (!text) { return []; }
    const lines = htmlChildren(text);
    return lines.map(line => {
      return {text: line, checked: false} as Line;
    });
  }

  const switchMode = () => {
    if (locked) { return; }
    if (state.mode === HighlightMode.Edit) {
      state.mode = HighlightMode.Input;
    } else {
      setDialog(true);
      state.mode = HighlightMode.Edit;
      state.lines = prepareLines(state.text);
    }
    update();
    save();
  }

  const updateText = (text: string) => {
    if (locked) { return; }
    state.text = text;
    update();
  }

  const toggleLight = (index:number) => {
    if (locked) { return; }
    state.lines[index].checked = !state.lines[index].checked;
    update();
    save();
  }

  const renderBox = () => {
    if (state.mode === HighlightMode.Edit) {
      if (!state.lines) {
        switchMode();
        return <PageLoader content="...Switching mode..." />;
      }
      return (
        <div className="hightlight-area">
          {
            state.lines.map((line, i) =>
              <div key={i} className={line.checked ? "line active" : "line"} onClick={() => {toggleLight(i)}} dangerouslySetInnerHTML={{__html: line.text}} />
            )
          }
        </div>
      );
    }
    let className = "lines-input";
    if (validationRequired && !state.text) {
      className += " content-invalid"
    }
    return (
      <QuillEditor
        disabled={locked}
        data={state.text}
        className={className}
        allowTables={true}
        isValid={!!stripHtml(data.text)}
        toolbar={[
          'bold', 'italic', 'fontColor'
        ]}
        placeholder="Introduce your question"
        imageDialog={true}
        onChange={updateText}
      />/*
      <TextareaAutosize
        disabled={locked}
        className={className}
        onBlur={() => save()}
        
        value={state.text}
        onChange={updateText}
        placeholder="Enter or Paste Text"
      />*/
    );
  }

  const renderPoemToggle = () => {
    let className = 'poem-toggle';
    if (state.isPoem) {
      className += ' active';
    }
    return (
      <div className={className} onClick={() => {
        state.isPoem = !state.isPoem;
        update();
      }}>
        br
      </div>
    );
  }

  return (
    <div className="line-highlight-build">
      <div className="component-title">
        <div>Click the highlighter to select correct lines</div>
      </div>
      <HighlightButton
        mode={state.mode}
        validationRequired={validationRequired}
        text={state.text}
        list={state.lines}
        switchMode={switchMode}
      />
      {renderPoemToggle()}
      <div className="input-container">
        {renderBox()}
      </div>
      <LineStyleDialog isOpen={isOpen}
        submit={v => {
          state.isPoem = v;
          update();
          setDialog(false);
        }}
        value={data.isPoem}
      />
    </div>
  )
}

export default LineHighlightingComponent
