import React, { Component } from 'react';
// @ts-ignore
import MathJax from 'react-mathjax-preview'

import { isMathJax, isLatex, parseDataToArray } from 'components/services/mathJaxService';
import YoutubeLink from './YoutubeLink';
import './YoutubeAndMath.scss'
import Katex from 'components/baseComponents/katex/Katex';
import HtmlWithSpaces from './HtmlWithSpaces';

interface MathHtmlProps {
  innerRef?: any;
  value: string;
  isSynthesisParser?: boolean;
}

class YoutubeAndMathInHtmlQuote extends Component<MathHtmlProps> {
  isYoutube(el: string) {
    /*eslint-disable-next-line*/
    return /<iframe.*src=\"https:\/\/www.youtube\.com\/embed/.test(el);
  }

  render() {
    let arr = parseDataToArray(this.props.value);

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
      <div className="youtube-video-session" ref={this.props.innerRef}>
        {
          arr.map((el: any, i: number) => {
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
            return <HtmlWithSpaces index={i} value={el} />;
          })
        }
      </div>
    );
  }
}

export default React.forwardRef((props: MathHtmlProps, ref) => <YoutubeAndMathInHtmlQuote innerRef={ref} {...props} />);
