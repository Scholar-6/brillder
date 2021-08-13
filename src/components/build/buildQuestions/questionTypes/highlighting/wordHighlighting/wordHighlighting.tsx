import React, { useEffect } from 'react'

import '../style.scss';
import './wordHighlighting.scss'
import { UniqueComponentProps } from '../../types';
import { BuildWord, SpecialSymbols } from 'components/interfaces/word';
import { TextareaAutosize } from '@material-ui/core';
import { HighlightMode } from '../model';
import HighlightButton from '../components/HighlightButton';
import LineStyleDialog from './LineStyleDialog';
import PoemToggle from './PoemToggle';


export interface WordHighlightingData {
  text: string;
  isPoem: boolean;
  words: BuildWord[];
  mode: HighlightMode;
}

export interface WordHighlightingProps extends UniqueComponentProps {
  data: WordHighlightingData;
}

export const getDefaultWordHighlightingAnswer = () => {
  return { text: '', isPoem: false, words: [] };
}

const WordHighlightingComponent: React.FC<WordHighlightingProps> = ({
  locked, data, save, updateComponent, validationRequired
}) => {
  const [state, setState] = React.useState(data);
  const [isOpen, setDialog] = React.useState(false);

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

  const splitByLines = (text: string) => {
    const splited = splitByChar(text, SpecialSymbols.LineFeed);
    return splited.map(line => {
      return { text: line, isBreakLine: true, checked: false } as BuildWord;
    });
  }

  const addSpace = (words: BuildWord[], index: number) => {
    if (index >= 1) {
      words.push({ text: "\u00A0", notSelectable: true } as BuildWord);
    }
  }

  const addBreakLine = (lineStrings: string[], word: BuildWord, index: number) => {
    if (index === lineStrings.length - 1) {
      word.isBreakLine = true;
    }
  }

  const splitByWords = (lines: BuildWord[]) => {
    let words: BuildWord[] = [];
    lines.forEach(line => {
      let lineStrings = splitByChar(line.text, SpecialSymbols.Space);
      for (const index in lineStrings) {
        let intIndex = parseInt(index);
        addSpace(words, intIndex);
        let word = { text: lineStrings[index], checked: false } as BuildWord;
        addBreakLine(lineStrings, word, intIndex);
        words.push(word);
      }
    });
    return words;
  }

  const prepareWords = (text: string) => {
    if (!text) { return []; }
    const lines = splitByLines(text);
    return splitByWords(lines);
  }

  const switchMode = () => {
    if (locked) { return; }
    if (state.mode === HighlightMode.Edit) {
      state.mode = HighlightMode.Input;
    } else {
      setDialog(true);
      state.mode = HighlightMode.Edit;
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

  const toggleLight = (index: number) => {
    if (locked) { return; }
    const word = state.words[index];
    if (word.notSelectable) { return; }
    state.words[index].checked = !word.checked;
    update();
    save();
  }

  const renderEditWord = (word: BuildWord, index: number) => {
    let className = "word";
    if (word.checked) {
      className += " active";
    }
    if (word.notSelectable) {
      className += " disabled";
    }

    return (
      <span key={index} className={className} onClick={() => { toggleLight(index) }}>
        {word.text}
      </span>
    );
  }

  const getWords = () => {
    let words = [];
    let i = 0;
    let i2 = state.words.length + 2;
    for (let word of state.words) {
      words.push(renderEditWord(word, i));
      if (word.isBreakLine) {
        words.push(<br key={i2} style={{ width: '100%' }} />);
        i2++;
      }
      i++;
    }
    return words;
  }

  const renderEditBox = () => {
    return (
      <div className="hightlight-area">
        {state.words ? getWords() : ""}
      </div>
    );
  }

  const renderTextBox = () => {
    let className = "words-input";
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
        placeholder="Enter Text Here"
      />
    );
  }

  return (
    <div className="word-highlight-build">
      <div className="component-title">
        <div>Click the highlighter to select correct words</div>
      </div>
      <HighlightButton
        mode={state.mode}
        validationRequired={validationRequired}
        text={state.text}
        list={state.words}
        switchMode={switchMode}
      />
      <PoemToggle state={state} update={update} />
      <div className="input-container">
        {state.mode === HighlightMode.Edit
          ? renderEditBox()
          : renderTextBox()}
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

export default WordHighlightingComponent
