import React, { useEffect } from 'react';
import * as Y from "yjs";

import '../style.scss';
import './wordHighlighting.scss'
import { UniqueComponentProps } from '../../types';
import { BuildWord, SpecialSymbols } from 'components/interfaces/word';
import { TextareaAutosize } from '@material-ui/core';
import { HighlightMode } from '../model';
import HighlightButton from '../components/HighlightButton';
import LineStyleDialog from './LineStyleDialog';
import QuillEditor from 'components/baseComponents/quill/QuillEditor';

export interface WordHighlightingData {
  text: string;
  isPoem: boolean;
  words: BuildWord[];
  mode: HighlightMode;
}

export interface WordHighlightingProps extends UniqueComponentProps {
  data: Y.Map<any>;
}

export const getDefaultWordHighlightingAnswer = (ymap: Y.Map<any>) => {
  ymap.set("text", new Y.Text());
  ymap.set("isPoem", false);
  ymap.set("words", new Y.Array());
}

const WordHighlightingComponent: React.FC<WordHighlightingProps> = ({
  locked, data, validationRequired
}) => {
  const [mode, setMode] = React.useState(HighlightMode.Input);
  const [isOpen, setDialog] = React.useState(false);

  console.log(data);

  useEffect(() => {
    if (!data.get("text")) { data.set("text", new Y.Text()); }
    if (!data.get("words")) { data.set("words", new Y.Array()); }
  }, [data]);

  const splitByChar = (text: string, charCode: number) => {
    return text.split(String.fromCharCode(charCode));
  }

  const splitByLines = (text: string) => {
    const splited = splitByChar(text, SpecialSymbols.LineFeed);
    const yarray = new Y.Array();
    const lines = splited.map(line => {
      return new Y.Map(Object.entries({text: line, isBreakLine: true, checked: false}));
    });
    yarray.push(lines);
    return yarray;
  }

  const addSpace = (words: Y.Array<any>, index: number) => {
    if (index >= 1) {
      words.push([new Y.Map(Object.entries({text: "\u00A0", notSelectable: true}))]);
    }
  }

  const addBreakLine = (lineStrings: string[], word: Y.Map<any>, index: number) => {
    if (index === lineStrings.length - 1) {
      word.set("isBreakLine", true);
    }
  }

  const splitByWords = (lines: Y.Array<any>) => {
    let words = new Y.Array();
    lines.forEach((line: Y.Map<any>) => {
      let lineStrings = splitByChar(line.get("text"), SpecialSymbols.Space);
      for (const index in lineStrings) {
        let intIndex = parseInt(index);
        addSpace(words, intIndex);
        let word = new Y.Map(Object.entries({text: lineStrings[index], checked: false}));
        addBreakLine(lineStrings, word, intIndex);
        words.push([word]);
      }
    });
    return words;
  }

  const disabledEmptyWord = (word: Y.Map<any>) => {
    if (!word.get("text")) {
      word.set("notSelectable", true);
    }
  }

  const addBreakLineInTheEnd = (
    wordParts: string[], mainWord: Y.Map<any>, partWord: Y.Map<any>, index: number
  ) => {
    if (index === wordParts.length - 1) {
      if (mainWord.get("isBreakLine")) {
        partWord.set("isBreakLine", true);
      }
    }
  }

  const addSpecialSignByCode = (words: Y.Array<any>, signCode: SpecialSymbols, index: number) => {
    if (index >= 1) {
      words.push([new Y.Map(Object.entries({text: String.fromCharCode(signCode), notSelectable: true}))]);
    }
  }

  const splitBySpecialSign = (words: Y.Array<any>, signCode: SpecialSymbols) => {
    let finalWords = new Y.Array();
    words.forEach((word: Y.Map<any>) => {
      let commas = splitByChar(word.get("text"), signCode);
      if (commas.length >= 2) {
        for (let index in commas) {
          let loopWord = new Y.Map(Object.entries({ text: commas[index] }));
          let intIndex = parseInt(index);
          addSpecialSignByCode(finalWords, signCode, intIndex);
          addBreakLineInTheEnd(commas, word, loopWord, intIndex);
          disabledEmptyWord(word);
          finalWords.push([loopWord]);
        }
      } else {
        finalWords.push([word]);
      }
    });
    return finalWords;
  }

  const prepareWords = () => {
    if (!data.get("text").toString()) { return; }
    const lines = splitByLines(data.get("text").toString());
    const words = splitByWords(lines);
    const wordsByCommas = splitBySpecialSign(words, SpecialSymbols.Comma);
    const wordsByDotsAndComas = splitBySpecialSign(wordsByCommas, SpecialSymbols.Dot);
    data.set("words", wordsByDotsAndComas);
    console.log(data.get("words").toJSON());
  }

  const switchMode = () => {
    if (locked) { return; }
    if (mode === HighlightMode.Edit) {
      setMode(HighlightMode.Input);
    } else {
      setDialog(true);
      setMode(HighlightMode.Edit);
      prepareWords();
    }
  }

  const toggleLight = (index:number) => {
    if (locked) { return; }
    const word = data.get("words").get(index);
    if (word.get("notSelectable")) { return; }
    data.get("words").get(index).set("checked", !word.checked);
  }

  const renderBox = () => {
    if (mode === HighlightMode.Edit) {
      return renderEditBox();
    }
    return renderTextBox();
  }

  const getWords = () => {
    let words: any[] = [];
    let i = 0;
    let i2 = data.get("words").length + 2;
    data.get("words").forEach((word: Y.Map<any>) => {
      words.push(renderEditWord(word, i));
      if (word.get("isBreakLine")) {
        words.push(<br key={i2} style={{width: '100%'}} />);
        i2++;
      }
      i++;
    });
    return words;
  }

  const renderEditBox = () => {
    return (
      <div className="hightlight-area">
        {
          data.get("words") ? getWords() : ""
        }
      </div>
    );
  }

  const renderEditWord = (word: Y.Map<any>, index: number) => {
    let className = "word";
    if (word.get("checked")) {
      className += " active";
    }
    if (word.get("notSelectable")) {
      className += " disabled";
    }

    return (
      <span key={index} className={className} onClick={() => {toggleLight(index)}}>
        {word.get("text")}
      </span>
    );
  }

  const renderTextBox = () => {
    let className = "words-input";
    if (validationRequired && !data.get("text")) {
      className += " content-invalid"
    }
    return (
      <QuillEditor
        toolbar={[]}
        disabled={locked}
        className={className}
        sharedData={data.get("text")}
        placeholder="Enter Text Here..."
      />
    );
  }

  return (
    <div className="word-highlight-build">
      <div className="component-title">
        <div>Click the highlighter to select correct words</div>
      </div>
      <HighlightButton
        mode={mode}
        validationRequired={validationRequired}
        text={data.get("text").toJSON()}
        list={data.get("words").toJSON()}
        switchMode={switchMode}
      />
      <div className="input-container">
        {renderBox()}
      </div>
      <LineStyleDialog isOpen={isOpen}
        submit={v => {
          data.set("isPoem", v);
          setDialog(false);
        }}
        value={data.get("isPoem")}
      />
    </div>
  )
}

export default WordHighlightingComponent
