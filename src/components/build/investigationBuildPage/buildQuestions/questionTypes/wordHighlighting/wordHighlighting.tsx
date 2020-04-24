import React, { useEffect } from 'react'
import EditIcon from '@material-ui/icons/Edit';

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
  const [state, setState] = React.useState(data);

  useEffect(() => {
    if (!data.text) { data.text = ''; }
    if (!data.words) { data.words = []; }
    setState(data);
  }, [data]);

  const update = () => {
    setState(Object.assign({}, state));
    updateComponent(state);
  }

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
    if (state.mode === WordMode.Edit) {
      state.mode = WordMode.Input;
    } else {
      state.mode = WordMode.Edit;
      state.words = prepareWords(state.text);
    }
    update();
  }

  const updateText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (locked) { return; }
    state.text = e.target.value;
    update();
  }

  const toggleLight = (index:number) => {
    if (locked) { return; }
    state.words[index].checked = !state.words[index].checked;
    update();
  }

  const renderBox = () => {
    if (state.mode === WordMode.Edit) {
      return (
        <div className="hightlight-area">
          {
            state.words.map((word, i) =>
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
        value={state.text}
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
        <EditIcon className={state.mode ? "active" : ""} onClick={switchMode} />
      </div>
      <div className="input-container">
        {renderBox()}
      </div>
    </div>
  )
}

export default WordHighlightingComponent
