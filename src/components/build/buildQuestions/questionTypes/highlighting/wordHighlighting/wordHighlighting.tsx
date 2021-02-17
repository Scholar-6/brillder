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
  ymap.set("mode", HighlightMode.Input);
  ymap.set("words", new Y.Array());
}

const WordHighlightingComponent: React.FC<WordHighlightingProps> = ({
  locked, data, validationRequired
}) => {
  const [isOpen, setDialog] = React.useState(false);

  useEffect(() => {
    if (!data.get("text")) { data.set("text", new Y.Text()); }
    if (!data.get("words")) { data.set("words", new Y.Array()); }
  }, [data]);

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
        let word = { text: lineStrings[index], checked: false } as BuildWord;
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
    let finalWords: BuildWord[] = [];
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

  const prepareWords = () => {
    if (!data.get("text").toString()) { return; }
    const lines = splitByLines(data.get("text").toString());
    const words = splitByWords(lines);
    const wordsByCommas = splitBySpecialSign(words, SpecialSymbols.Comma);
    const wordsByDotsAndComas = splitBySpecialSign(wordsByCommas, SpecialSymbols.Dot);
    const yarray = new Y.Array();
    yarray.push(wordsByDotsAndComas.map(word => new Y.Map(Object.entries(word))));
    data.set("words", yarray);
  }

  const switchMode = () => {
    if (locked) { return; }
    if (data.get("mode") === HighlightMode.Edit) {
      data.set("mode", HighlightMode.Input);
    } else {
      setDialog(true);
      data.set("mode", HighlightMode.Edit);
      prepareWords();
    }
  }

  const toggleLight = (index:number) => {
    if (locked) { return; }
    const word = data.get("words").get(index);
    if (word.get("notSelectable")) { return; }
    word.set("checked", !word.get("checked"));
  }

  const renderBox = () => {
    if (data.get("mode") === HighlightMode.Edit) {
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
        {word.get("text").toString()}
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

  const renderPoemToggle = () => {
    let className = 'poem-toggle';
    if (data.get("isPoem")) {
      className += ' active';
    }
    return (
      <div className={className} onClick={() => {
        data.set("isPoem", !data.get("isPoem"));
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
        mode={data.get("mode")}
        validationRequired={validationRequired}
        text={data.get("text").toJSON()}
        list={data.get("words").toJSON()}
        switchMode={switchMode}
      />
      {renderPoemToggle()}
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
