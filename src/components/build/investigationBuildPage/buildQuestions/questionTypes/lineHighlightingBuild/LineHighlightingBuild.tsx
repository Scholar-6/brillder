import React from 'react'
import EditIcon from '@material-ui/icons/Edit';
import { Button } from '@material-ui/core';

import './LineHighlightingBuild.scss'

enum LineMode {
  Input,
  Edit,
}

export interface Line {
  text: string,
  checked: boolean,
}

export interface LineHighlightingData {
  text: string;
  lines: Line[];
  mode: LineMode;
}

export interface LineHighlightingProps {
  locked: boolean
  data: LineHighlightingData
  updateComponent(component: any): void
}

const LineHighlightingComponent: React.FC<LineHighlightingProps> = ({ locked, data, updateComponent }) => {
  const prepareLines = (text: string):Line[] => {
    if (!text) { return []; }

    let lines = text.split('\n');
    return lines.map(line => {
      return {text: line, checked: false} as Line;
    });
  }

  const switchMode = () => {
    if (locked) { return; }
    if (data.mode === LineMode.Edit) {
      data.mode = LineMode.Input;
    } else {
      data.mode = LineMode.Edit;
      data.lines = prepareLines(data.text);
    }
    updateComponent(data);
  }

  const updateText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (locked) { return; }
    data.text = e.target.value;
    updateComponent(data);
  }

  const toggleLight = (index:number) => {
    if (locked) { return; }
    data.lines[index].checked = !data.lines[index].checked;
    updateComponent(data);
  }

  const renderBox = () => {
    if (data.mode === LineMode.Edit) {
      return (
        <div className="hightlight-area">
          {
            data.lines.map((line, i) =>
              <div key={i} style={{background: line.checked ? 'green' : 'inherit'}} onClick={() => {toggleLight(i)}}>
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
        rows={5}
        value={data.text}
        onChange={updateText} placeholder="Enter lines here..." />
    );
  }

  return (
    <div className="line-highlight-build">
      <div className="component-title">
        <div>Enter/Paste Text Below.</div>
        <div>Use Highlighter Icon to click correct line(s).</div>
      </div>
      <div className="pencil-icon-container">
        <EditIcon className={data.mode ? "active" : ""} onClick={switchMode} />
      </div>
      <div className="input-container">
        {renderBox()}
      </div>
      <div className="button-box">
        <Button className="add-answer-button" onClick={() => {}}>Convert to Click and Correct?</Button>
      </div>
    </div>
  )
}

export default LineHighlightingComponent
