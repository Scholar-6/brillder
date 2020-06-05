import React, { useEffect } from 'react'
import EditIcon from '@material-ui/icons/Edit';

import './wordHighlighting.scss'
import { UniqueComponentProps } from '../types';
import { Word } from 'components/interfaces/word';

enum SpecialSymbols {
  LineFeed = 10,
  Space = 32,
}

export enum WordMode {
  Input,
  Edit,
}

export interface WordHighlightingData {
  text: string;
  words: Word[];
  mode: WordMode;
}

export interface WordHighlightingProps extends UniqueComponentProps {
  data: WordHighlightingData;
}

const WordHighlightingComponent: React.FC<WordHighlightingProps> = ({
  locked, data, save, updateComponent
}) => {
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

  const splitByChar = (text: string, charCode: number) => {
    return text.split(String.fromCharCode(charCode));
  }

  const prepareWords = (text: string):Word[] => {
    if (!text) {
      return [];
    }
    let splited = splitByChar(text, SpecialSymbols.LineFeed);
    let lines = splited.map(line => {
      return {text: line, isBreakLine: true, checked: false} as Word;
    });
    let words: Word[] = [];
    lines.forEach(line => {
      let lineWords = splitByChar(line.text, SpecialSymbols.Space);
      for (const index in lineWords) {
        let word = {text: lineWords[index], checked: false} as Word;
        if (parseInt(index) === lineWords.length - 1) {
          word.isBreakLine = true;
        }
        words.push(word);
      }
    });
    return words;
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
    save();
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
    save();
  }

  const renderBox = () => {
    if (state.mode === WordMode.Edit) {
      return (
        <div className="hightlight-area">
          {
            state.words ? state.words.map((word, i) =>
              <div
                key={i}
                className={word.checked ? "word active" : "word"}
                onClick={() => {toggleLight(i)}}
              >
                {word.text}
              </div>
            ) : ""
          }
        </div>
      );
    }
    return (
      <textarea
        disabled={locked}
        className="words-input"
        rows={5}
        onBlur={() => save()}
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
