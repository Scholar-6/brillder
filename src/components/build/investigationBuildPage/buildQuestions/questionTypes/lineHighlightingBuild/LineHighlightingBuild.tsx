import React, { useEffect } from 'react'

import './LineHighlightingBuild.scss'
import { UniqueComponentProps } from '../types';

import sprite from "../../../../../../assets/img/icons-sprite.svg";
import PageLoader from 'components/baseComponents/loaders/pageLoader';

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

const LineHighlightingComponent: React.FC<LineHighlightingProps> = ({
  locked, data, save, updateComponent
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
    return (
      <textarea
        disabled={locked}
        className="lines-input"
        value={state.text}
        onBlur={() => save()}
        onChange={updateText} placeholder="Enter Lines Here..." />
    );
  }

  return (
    <div className="line-highlight-build">
      <div className="component-title">
        <div>Enter/Paste Text Below.</div>
        <div>Use Highlighter Icon to click correct line(s).</div>
      </div>
      <div className="pencil-icon-container svgOnHover" onClick={switchMode}>
        <svg className="svg w100 h100 active">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#highlighter"} className={state.mode ? "text-theme-green" : "text-theme-dark-blue"} />
        </svg>
      </div>
      <div className="input-container">
        {renderBox()}
      </div>
    </div>
  )
}

export default LineHighlightingComponent
