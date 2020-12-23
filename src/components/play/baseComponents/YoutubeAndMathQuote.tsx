import React, { Component } from 'react';
// @ts-ignore
import MathJax from 'react-mathjax-preview'

import {parseDataToArray, isMathJax, parseSynthesisDataToArray, isLatex, parseDataToArrayQuote} from 'components/services/mathJaxService';
import YoutubeLink from './YoutubeLink';
import './YoutubeAndMath.scss'
import Katex from 'components/baseComponents/katex/Katex';

interface MathHtmlProps {
  value: string;
  isSynthesisParser?: boolean;
}

class YoutubeAndMathInHtmlQuote extends Component<MathHtmlProps> {
  isYoutube(el: string) {
    if (el.indexOf('<figure class="media">') >= 0) {
      if (el.indexOf('youtube.com/watch') >= 0) {
        return true;
      }
    }
    return false;
  }

  render() {
    let arr = parseDataToArrayQuote(this.props.value);

    const renderMath = (data: string, i: number) => {
      return <MathJax math={data} key={i} />;
    }

    const renderLatex = (latex: string, i: number) => {
      return <Katex latex={latex} key={i} />
    }

    if (arr.length === 0) {
      return <div>{this.props.value}</div>;
    }

    return (
      <div className="youtube-video-session">
        {
          arr.map((el:any, i:number) => {
            let res = isMathJax(el);
            const latex = isLatex(el);
            if (res) {
              return renderMath(el, i);
            } else if (latex) {
              return renderLatex(el, i);
            } 
            res = this.isYoutube(el);


            if (res) {
              return <YoutubeLink key={i} value={el} />;
            }
            return <div key={i} dangerouslySetInnerHTML={{ __html: el}} />
          })
        }
      </div>
    );
  }
}

export default YoutubeAndMathInHtmlQuote;
