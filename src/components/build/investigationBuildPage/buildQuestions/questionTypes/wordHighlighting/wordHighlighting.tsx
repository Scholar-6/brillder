import React, { useEffect } from 'react'

import './wordHighlighting.scss'
import { UniqueComponentProps } from '../types';
import { BuildWord, SpecialSymbols } from 'components/interfaces/word';

import sprite from "../../../../../../assets/img/icons-sprite.svg";

export enum WordMode {
  Input,
  Edit,
}

export interface WordHighlightingData {
  text: string;
  words: BuildWord[];
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
    const word = state.words[index];
    if (word.notSelectable) { return; }
    state.words[index].checked = !word.checked;
    update();
    save();
  }

  const renderBox = () => {
    if (state.mode === WordMode.Edit) {
      return renderEditBox();
    }
    return renderTextBox();
  }

  const renderEditBox = () => {
    return (
      <div className="hightlight-area">
        {
          state.words ? state.words.map((word, i) =>
            renderEditWord(word, i)
          ) : ""
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
      <span key={index}>
        <span className={className} onClick={() => {toggleLight(index)}}>
          {word.text}
        </span>
        {word.isBreakLine ? <br /> : ""}
      </span>
    );
  }

  const renderTextBox = () => {
    return (
      <textarea
        disabled={locked}
        className="words-input"
        onBlur={() => save()}
        value={state.text}
        onChange={updateText}
        placeholder="Enter Words Here..."
      />
    );
  }

  return (
    <div className="word-highlight-build">
      <div className="component-title">
        <div>Enter/Paste Text Below.</div>
        <div>Use Highlighter Icon to click correct word(s).</div>
      </div>
      <div className="pencil-icon-container svgOnHover" onClick={switchMode}>
        <svg className="svg w100 h100 active">
          <use href={sprite + "#highlighter"} className={state.mode ? "text-theme-green" : "text-theme-dark-blue"} />
        </svg>
      </div>
      <div className="input-container">
        {renderBox()}
      </div>
    </div>
  )
}

export default WordHighlightingComponent
