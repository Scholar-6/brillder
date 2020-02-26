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
  data: WordHighlightingData
  updateComponent(component: any): void
}

const WordHighlightingComponent: React.FC<WordHighlightingProps> = ({ data, updateComponent }) => {
  const prepareWords = (text: string):Word[] => {
    let words = text.split(' ');
    return words.map(word => {
      return {text: word, checked: false} as Word;
    });
  }

  const switchMode = () => {
    if (data.mode == WordMode.Edit) {
      data.mode = WordMode.Input;
    } else {
      data.mode = WordMode.Edit;
      data.words = prepareWords(data.text);
    }
    updateComponent(data);
  }

  const updateText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    data.text = e.target.value;
    updateComponent(data);
  }

  const toggleLight = (index:number) => {
  }

  const renderBox = () => {
    if (data.mode == WordMode.Edit) {
      let words = data.text.split(' ');
      return <div className="hightlight-area">{words.map((word, i) => <div style={{display: 'inline-block', marginRight: '5px'}} onClick={() => {toggleLight(i)}}>{word}</div>)}</div>;
    }
    return (
      <textarea className="words-input" rows={5} value={data.text} onChange={updateText} placeholder="Enter words here..." />
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
        <Button className="add-answer-button" onClick={() => {}}>Convert to Click and Correct?</Button>
      </div>
    </div>
  )
}

export default WordHighlightingComponent
