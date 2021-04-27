import React, { useEffect } from 'react'

import '../style.scss';
import './wordHighlighting.scss'
import { UniqueComponentProps } from '../../types';
import { BuildWord, SpecialSymbols } from 'components/interfaces/word';
import { TextareaAutosize } from '@material-ui/core';
import { HighlightMode } from '../model';
import HighlightButton from '../components/HighlightButton';
import LineStyleDialog from './LineStyleDialog';


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
      return {text: line, isBreakLine: true, checked: false} as BuildWord;
    });
  }

  const addSpace = (words: BuildWord[], index: number) => {
    if (index >= 1) {
      words.push({text: "\u00A0", notSelectable: true} as BuildWord);
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
        let word = {text: lineStrings[index], checked: false} as BuildWord;
        addBreakLine(lineStrings, word, intIndex);
        words.push(word);
      }
    });
    return words;
  }

  const disabledEmptyWord = (word: BuildWord) => {
    if (!word.text) {
      word.notSelectable = true;
    }
  }

  const addBreakLineInTheEnd = (
    wordParts: string[], mainWord: BuildWord, partWord: BuildWord, index: number
  ) => {
    if (index === wordParts.length - 1) {
      if (mainWord.isBreakLine) {
        partWord.isBreakLine = true;
      }
    }
  }

  const addSpecialSignByCode = (words: BuildWord[], signCode: SpecialSymbols, index: number) => {
    if (index >= 1) {
      words.push({text: String.fromCharCode(signCode), notSelectable: true} as BuildWord);
    }
  }

  const splitBySpecialSign = (words: BuildWord[], signCode: SpecialSymbols) => {
    let finalWords:BuildWord[] = [];
    words.forEach(word => {
      let commas = splitByChar(word.text, signCode);
      if (commas.length >= 2) {
        for (let index in commas) {
          let loopWord = { text: commas[index] } as BuildWord;
          let intIndex = parseInt(index);
          addSpecialSignByCode(finalWords, signCode, intIndex);
          addBreakLineInTheEnd(commas, word, loopWord, intIndex);
          disabledEmptyWord(word);
          finalWords.push(loopWord);
        }
      } else {
        finalWords.push(word);
      }
    });
    return finalWords;
  }

  const prepareWords = (text: string) => {
    if (!text) { return []; }
    const lines = splitByLines(text);
    const words = splitByWords(lines);
    const wordsByCommas = splitBySpecialSign(words, SpecialSymbols.Comma);
    const wordsByDotsAndComas = splitBySpecialSign(wordsByCommas, SpecialSymbols.Dot);
    return wordsByDotsAndComas;
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

  const toggleLight = (index:number) => {
    if (locked) { return; }
    const word = state.words[index];
    if (word.notSelectable) { return; }
    state.words[index].checked = !word.checked;
    update();
    save();
  }

  const renderBox = () => {
    if (state.mode === HighlightMode.Edit) {
      return renderEditBox();
    }
    return renderTextBox();
  }

  const getWords = () => {
    let words = [];
    let i = 0;
    let i2 = state.words.length + 2;
    for (let word of state.words) {
      words.push(renderEditWord(word, i));
      if (word.isBreakLine) {
        words.push(<br key={i2} style={{width: '100%'}} />);
        i2++;
      }
      i++;
    }
    return words;
  }

  const renderEditBox = () => {
    return (
      <div className="hightlight-area">
        {
          state.words ? getWords() : ""
        }
      </div>
    );
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
      <span key={index} className={className} onClick={() => {toggleLight(index)}}>
        {word.text}
      </span>
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
        placeholder="Enter Text Here..."
      />
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

export default WordHighlightingComponent
