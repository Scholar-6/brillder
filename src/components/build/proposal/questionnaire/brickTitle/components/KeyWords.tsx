import React, { Component } from "react";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { Popper } from '@material-ui/core';

import './KeyWords.scss';
import { enterPressed, spaceKeyPressed } from "components/services/key";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { KeyWord } from "model/brick";
import KeyWordsPlay from "./KeywordsPlay";
import { getKeywords } from "services/axios/brick";
import { ReactSortable } from "react-sortablejs";

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
      keyWord: '',
      allKeyWords: []
    }

    this.loadKeywords();
  }

  async loadKeywords() {
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
    }
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
        <div className={`key-words keywords-ordered ${invalid ? 'content-invalid' : ''}`}>
          {this.props.isHashtags
            ? <KeyWordsPlay keywords={this.state.keyWords} />
            : <ReactSortable
              list={this.state.keyWords as any[]}
              group={{ name: "cloning-group-name", pull: "clone" }}
              setList={newKeywords => {
                for (let i = 0; i < newKeywords.length; i++) {
                  newKeywords[i].order = i + 1; 
                }
                this.setState({keyWords: newKeywords});
                this.props.onChange(newKeywords);
               }}
            >
              {this.state.keyWords.map(this.renderKeyWord.bind(this))}
            </ReactSortable>
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
              console.log(params);
              params.inputProps.value = this.state.keyWord;
              return <TextField
                {...params}
                variant="standard"
                onChange={(e) => this.setState({ keyWord: e.target.value })}
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
