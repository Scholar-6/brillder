import React, { Component } from "react";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { Popper } from '@material-ui/core';

import './KeyWords.scss';
import { enterPressed, spaceKeyPressed } from "components/services/key";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { KeyWord } from "model/brick";
import KeyWordsPlay from "./KeywordsPlay";
import { getKeywords, getSuggestedKeywords } from "services/axios/brick";

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
  allKeyWords: KeyWord[];
  timeout: number | NodeJS.Timeout;
}

const PopperCustom = function (props: any) {
  return (<Popper {...props} className="keywords-poopper" />)
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
      timeout: -1,
      keyWord: '',
      allKeyWords: []
    }
  }

  async suggestKeywords() {
    /*
    const keywords = await getKeywords();
    if (keywords) {
      const sorted = keywords.sort((a, b) => {
        const al = a.name.toUpperCase();
        const bl = b.name.toUpperCase();
        if (al < bl) { return -1; }
        if (al > bl) { return 1; }
        return 0;
      });
      this.setState({ allKeyWords: sorted });
    }*/
  }

  checkIfPresent(keyWord: string) {
    for (let keyword of this.state.keyWords) {
      if (keyword.name.trim() === keyWord.trim()) {
        return true;
      }
    }
    return false;
  }

  addKeyWord(keyword: string) {
    if (this.props.disabled) { return; }

    const present = this.checkIfPresent(keyword);
    if (present) {
      this.setState({ keyWord: '' })
      return;
    }

    const { keyWords } = this.state;
    keyWords.push({ name: keyword });
    this.setState({ keyWord: '', keyWords });
    this.props.onChange(keyWords);
  }

  checkKeyword(e: any) {
    let pressed = enterPressed(e) || spaceKeyPressed(e);
    if (pressed) {
      const value = e.target.value;
      this.addKeyWord(value);
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
          <Autocomplete
            freeSolo
            value={null}
            options={this.state.allKeyWords}
            onChange={(e: any, v: any) => this.addKeyWord(v.name)}
            noOptionsText="Sorry, try typing something else"
            className="subject-autocomplete"
            PopperComponent={PopperCustom}
            getOptionLabel={(option: any) => option.name}
            renderInput={(params: any) => {
              params.inputProps.value = this.state.keyWord;
              return <TextField
                {...params}
                variant="standard"
                onChange={async (e) => {
                  const value = e.target.value;
                  console.log('changed');

                  clearTimeout(this.state.timeout);

                  const timeout = setTimeout(async () => {
                    console.log('get data');
                    const keysRes = await getSuggestedKeywords(value);
                    if (keysRes) {
                      this.setState({ allKeyWords: keysRes });
                    }
                  },200);

                  this.setState({ timeout, keyWord: value });
                }}
                onKeyDown={this.checkKeyword.bind(this)}
                label=""
                placeholder="Type keyword "
              />
            }}
          />
          <div className="hover-area flex-center">
            <SpriteIcon name="help-circle-custom" />
            <div className="hover-content">
              Keywords are best thought of as likely search terms, and are ultimately curated by Publishers for each subject. For multi-word keywords, separate words with a hyphen, eg. ‘19th-Century’
            </div>
          </div>
        </div>
        {overflowKey && <div className="text-orange">The tag ❝{overflowKey.name}❞ is too long; the maximum length is {MaxKeywordLength} characters.</div>}
      </div>
    );
  }
}

export default KeyWordsComponent;
