import React, { useEffect } from 'react'

import './LineHighlightingBuild.scss'
import { UniqueComponentProps } from '../types';
import { TextareaAutosize } from '@material-ui/core';

import PageLoader from 'components/baseComponents/loaders/pageLoader';
import SpriteIcon from 'components/baseComponents/SpriteIcon';

enum LineMode {
  Input,
  Edit,
}

export interface Line {
  text: string;
  checked: boolean;
}

export interface LineHighlightingData {
  text: string;
  lines: Line[];
  mode: LineMode;
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

    let lines = text.split('\n');
    return lines.map(line => {
      return {text: line, checked: false} as Line;
    });
  }

  const switchMode = () => {
    if (locked) { return; }
    if (state.mode === LineMode.Edit) {
      state.mode = LineMode.Input;
    } else {
      state.mode = LineMode.Edit;
      state.lines = prepareLines(state.text);
    }
    update();
    save();
  }

  const updateText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (locked) { return; }
    state.text = e.target.value;
    update();
  }

  const toggleLight = (index:number) => {
    if (locked) { return; }
    state.lines[index].checked = !state.lines[index].checked;
    update();
    save();
  }

  const renderBox = () => {
    if (state.mode === LineMode.Edit) {
      if (!state.lines) {
        switchMode();
        return <PageLoader content="...Switching mode..." />;
      }
      return (
        <div className="hightlight-area">
          {
            state.lines.map((line, i) =>
              <div key={i} className={line.checked ? "line active" : "line"} onClick={() => {toggleLight(i)}}>
                {line.text}
              </div>
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
      <TextareaAutosize
        disabled={locked}
        className={className}
        onBlur={() => save()}
        value={state.text}
        onChange={updateText}
        placeholder="Enter Lines Here..."
      />
    );
  }

  return (
    <div className="line-highlight-build">
      <div className="component-title">
        <div>Enter/Paste Text Below.</div>
        <div>Use Highlighter Icon to click correct line(s).</div>
      </div>
      <div className="pencil-icon-container svgOnHover" onClick={switchMode}>
        <SpriteIcon
          name="highlighter"
          className={`w100 h100 active ${state.mode ? "text-theme-green" : "text-theme-dark-blue"}`}
        />
      </div>
      <div className="input-container">
        {renderBox()}
      </div>
    </div>
  )
}

export default LineHighlightingComponent
