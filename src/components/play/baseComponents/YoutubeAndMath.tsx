import React, { Component } from 'react';
// @ts-ignore
import MathJax from 'react-mathjax-preview'

import {parseDataToArray, isMathJax, parseSynthesisDataToArray, isLatex} from 'components/services/mathJaxService';
import YoutubeLink from './YoutubeLink';
import './YoutubeAndMath.scss'
import Katex from 'components/baseComponents/katex/Katex';

interface MathHtmlProps {
  value: string;
  isSynthesisParser?: boolean;
}

class YoutubeAndMathInHtml extends Component<MathHtmlProps> {
  isYoutube(el: string) {
    return /<iframe.*src=\"https:\/\/www.youtube\.com\/embed/.test(el);
  }

  render() {
    let arr = [];
    if (this.props.isSynthesisParser) {
      arr = parseSynthesisDataToArray(this.props.value);
    } else {
      arr = parseDataToArray(this.props.value);
    }

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

export default YoutubeAndMathInHtml;
