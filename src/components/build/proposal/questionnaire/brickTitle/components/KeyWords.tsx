import React, { Component } from "react";

import './KeyWords.scss';
import { enterPressed, spaceKeyPressed } from "components/services/key";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { KeyWord } from "model/brick";
import KeyWordsPlay from "./KeywordsPlay";

export const MaxKeywordLength = 35;

interface KeyWordsProps {
  disabled: boolean;
  isHashtags?: boolean;
  keyWords: KeyWord[];
  validate?: boolean;
  onChange(keyWords: KeyWord[]): void;
}

interface KeyWordsState {
  keyWords: KeyWord[];
  keyWord: string;
}

class KeyWordsComponent extends Component<KeyWordsProps, KeyWordsState> {
  constructor(props: any) {
    super(props);

    let keyWords = [];
    if (props.keyWords) {
      keyWords = props.keyWords;
    }

    this.state = {
      keyWords,
      keyWord: ''
    }
  }

  checkIfPresent() {
    const { keyWord } = this.state;
    for (let keyword of this.state.keyWords) {
      if (keyword.name.trim() === keyWord.trim()) {
        return true;
      }
    }
    return false;
  }

  addKeyWord() {
    if (this.props.disabled) { return; }

    const present = this.checkIfPresent();
    if (present) {
      this.setState({ keyWord: '' });
      return;
    }

    const { keyWords } = this.state;
    keyWords.push({ name: this.state.keyWord });
    this.setState({ keyWord: '', keyWords });
    this.props.onChange(keyWords);
  }

  checkKeyword(e: React.KeyboardEvent<HTMLInputElement>) {
    let pressed = enterPressed(e) || spaceKeyPressed(e);
    if (pressed) {
      this.addKeyWord();
    }
  }

  removeKeyWord(i: number) {
    if (i > -1 && !this.props.disabled) {
      const { keyWords } = this.state;
      keyWords.splice(i, 1);
      this.setState({ keyWords });
      this.props.onChange(keyWords);
    }
  }

  renderKeyWord(k: KeyWord, i: number) {
    return (
      <div key={i} className='key-word'>
        {k.name}
        <SpriteIcon name="cancel-custom" onClick={() => this.removeKeyWord(i)} />
      </div>
    )
  }

  render() {
    let overflowKey = null;
    let invalid = false;
    if (this.props.validate && this.state.keyWords.length === 0) {
      invalid = true;
    }
    for (let k of this.state.keyWords) {
      if (k.name.length >= MaxKeywordLength) {
        invalid = true;
        overflowKey = k;
      }
    }
    return (
      <div>
        <div className={`key-words ${invalid ? 'content-invalid' : ''}`}>
          {this.props.isHashtags
            ? <KeyWordsPlay keywords={this.state.keyWords} />
            : this.state.keyWords.map(this.renderKeyWord.bind(this))
          }
          <input disabled={this.props.disabled} value={this.state.keyWord} placeholder="Keyword(s)"
            onKeyDown={this.checkKeyword.bind(this)}
            onChange={e => {
              this.setState({ keyWord: e.target.value })
            }}
          />
        </div>
        {overflowKey && <div className="text-orange">The tag {overflowKey.name} is too long; the maximum length is {MaxKeywordLength} characters.</div>}
      </div>
    );
  }
}

export default KeyWordsComponent;
