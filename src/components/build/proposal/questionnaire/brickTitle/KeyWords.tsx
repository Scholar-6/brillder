import React, { Component } from "react";
import * as Y from "yjs";

import './KeyWords.scss';
import { enterPressed, spaceKeyPressed } from "components/services/key";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { KeyWord } from "model/brick";
import KeyWordsPlay from "./KeywordsPlay";

interface KeyWordsProps {
  disabled: boolean;
  keyWords: Y.Array<any>;
  isHashtags?: boolean;
}

interface KeyWordsState {
  keyWord: string;
}

class KeyWordsComponent extends Component<KeyWordsProps, KeyWordsState> {
  constructor(props: any) {
    super(props);

    this.state = {
      keyWord: ''
    }
  }

  addKeyWord() {
    if (!this.props.disabled) {
      this.props.keyWords.push([new Y.Map(Object.entries({ name: this.state.keyWord }))]);
      this.setState({ keyWord: '' });
    }
  }

  checkKeyword(e: React.KeyboardEvent<HTMLInputElement>) {
    let pressed = enterPressed(e) || spaceKeyPressed(e);
    if (pressed) {
      this.addKeyWord();
    }
  }

  removeKeyWord(i: number) {
    if (i > -1 && !this.props.disabled) {
      this.props.keyWords.delete(i, 1);
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
    return (
      <div className="key-words">
        {this.props.isHashtags
          ? <KeyWordsPlay keywords={this.props.keyWords.toJSON()} />
          : this.props.keyWords.toJSON().map(this.renderKeyWord.bind(this))
        }
        <input disabled={this.props.disabled} value={this.state.keyWord} placeholder="Keyword(s)" onKeyDown={this.checkKeyword.bind(this)} onChange={e => this.setState({ keyWord: e.target.value })} />
      </div>
    );
  }
}

export default KeyWordsComponent;
