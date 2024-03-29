import React, { Component } from 'react';
// @ts-ignore
import MathJax from 'react-mathjax-preview';

import { parseDataToArray, isMathJax, isLatex } from 'components/services/mathJaxService';
import Katex from 'components/baseComponents/katex/Katex';
import HtmlWithSpaces from './HtmlWithSpaces';


interface MathHtmlProps {
  value: string;
  className?: string;
}

class MathInHtml extends Component<MathHtmlProps> {
  render() {
    const arr = parseDataToArray(this.props.value);

    const renderMath = (data: string, i: number) => {
      return <MathJax math={data} key={i} />;
    }

    const renderLatex = (latex: string, i: number) => {
      return <Katex latex={latex} key={i} />
    }


    if (arr.length === 0) {
      return <div className={this.props.className}>
        <Katex latex={this.props.value} />
      </div>;
    }

    return (
      arr.map((el: any, i: number) => {
        const res = isMathJax(el);
        const latex = isLatex(el);

        if (res) {
          return renderMath(el, i);
        } else if (latex) {
          return renderLatex(el, i);
        }

        return <HtmlWithSpaces key={i} index={i} value={el} className={this.props.className} />;
      })
    );
  }
}

export default MathInHtml;
