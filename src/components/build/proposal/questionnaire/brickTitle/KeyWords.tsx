import React, { Component } from "react";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import * as Y from "yjs";

import './KeyWords.scss';
import { enterPressed, spaceKeyPressed } from "components/services/key";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { KeyWord } from "model/brick";
import KeyWordsPlay from "./KeywordsPlay";
import { suggestKeyword } from "services/axios/keywords";

interface KeyWordsProps {
  disabled: boolean;
  keyWords: Y.Array<any>;
  isHashtags?: boolean;
}

interface KeyWordsState {
  keyWord: string;
  optionKeyWord: any;
  options: any[];
}

class KeyWordsComponent extends Component<KeyWordsProps, KeyWordsState> {
  constructor(props: any) {
    super(props);

    this.state = {
      keyWord: '',
      optionKeyWord: null,
      options: []
    }
  }

  pushKeyword(keyword: any) {
    this.props.keyWords.push([new Y.Map(Object.entries(keyword))]);
    this.setState({ keyWord: '', optionKeyWord: null });
  }

  addKeyWord() {
    if (!this.props.disabled) {
      this.pushKeyword({ name: this.state.keyWord });
    }
  }

  addSuggestedKeyword(keyword: any) {
    if (!this.props.disabled) {
      this.pushKeyword(keyword);
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
        <Autocomplete
          options={this.state.options}
          disabled={this.props.disabled}
          value={this.state.optionKeyWord}
          getOptionLabel={(option:any) => option.name}
          onChange={(event: any, value: any) => {
            this.addSuggestedKeyword(value);
          }}
          onKeyDown={this.checkKeyword.bind(this)}
          renderInput={(params: any) => {
            params.inputProps.value = this.state.keyWord;
            console.log(params.inputProps.value);
            return <TextField
              {...params}
              disabled={this.props.disabled}
              placeholder="Keyword(s)"
              variant="outlined"
              onChange={(evt) => {
                const { value } = evt.target;
                const tempState = { keyWord: value } as KeyWordsState;
                if (value.length >= 3) {
                  suggestKeyword(value).then((res) => {
                    if (res && res.length > 0) {
                      tempState.options = res;
                    } else {
                      tempState.options = [];
                    }
                    this.setState(tempState);
                  });
                } else {
                  tempState.options = [];
                  this.setState(tempState);
                }
              }}
            />
          }}
        />
      </div>
    );
  }
}

export default KeyWordsComponent;