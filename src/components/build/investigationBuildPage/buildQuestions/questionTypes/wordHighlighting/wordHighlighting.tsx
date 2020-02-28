import React from 'react'
import EditIcon from '@material-ui/icons/Edit';
import { Button } from '@material-ui/core';

import './wordHighlighting.scss'

export enum WordMode {
  Input,
  Edit,
}

export interface Word {
  text: string,
  checked: boolean,
}

export interface WordHighlightingData {
  text: string;
  words: Word[];
  mode: WordMode;
}

export interface WordHighlightingProps {
  locked: boolean
  data: WordHighlightingData
  updateComponent(component: any): void
}

const WordHighlightingComponent: React.FC<WordHighlightingProps> = ({ locked, data, updateComponent }) => {
  const prepareWords = (text: string):Word[] => {
    if (!text) {
      return [];
    }
    let words = text.split(' ');
    return words.map(word => {
      return {text: word, checked: false} as Word;
    });
  }

  const switchMode = () => {
    if (locked) { return; }
    if (data.mode === WordMode.Edit) {
      data.mode = WordMode.Input;
    } else {
      data.mode = WordMode.Edit;
      data.words = prepareWords(data.text);
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
    data.words[index].checked = !data.words[index].checked;
    updateComponent(data);
  }

  const renderBox = () => {
    if (data.mode === WordMode.Edit) {
      return (
        <div className="hightlight-area">
          {
            data.words.map((word, i) =>
              <div key={i} style={{display: 'inline-block', marginRight: '5px', background: word.checked ? 'green' : 'inherit'}} onClick={() => {toggleLight(i)}}>
                {word.text}
              </div>
            )
          }
        </div>
      );
    }
    return (
      <textarea
        disabled={locked}
        className="words-input"
        rows={5}
        value={data.text}
        onChange={updateText}
        placeholder="Enter Words Here..." />
    );
  }

  return (
    <div className="word-highlight-build">
      <div className="component-title">
        <div>Enter/Paste Text Below.</div>
        <div>Use Highlighter Icon to click correct word(s).</div>
      </div>
      <div className="pencil-icon-container">
        <EditIcon className={data.mode ? "active" : ""} onClick={switchMode} />
      </div>
      <div className="input-container">
        {renderBox()}
      </div>
      <div className="button-box">
        <Button disabled={locked} className="add-answer-button" onClick={() => {}}>Convert to Click and Correct?</Button>
      </div>
    </div>
  )
}

export default WordHighlightingComponent
