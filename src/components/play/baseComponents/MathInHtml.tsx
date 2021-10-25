import React, { Component } from 'react';
// @ts-ignore
import MathJax from 'react-mathjax-preview';

import { parseDataToArray, isMathJax, isLatex } from 'components/services/mathJaxService';
import Katex from 'components/baseComponents/katex/Katex';
import HtmlWithSpaces from './HtmlWithSpaces';
import { isPhone } from 'services/phone';
import SpriteIcon from 'components/baseComponents/SpriteIcon';


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

    const isBlockqouteNoBreaks = (el: string) => {
      return /<blockquote (.*)class="bq no-break"(.*)>/.test(el);
    }

    if (arr.length === 0) {
      return <div className={this.props.className}>{this.props.value}</div>;
    }

    let prev:any = null;

    return (
      arr.map((el: any, i: number) => {
        const res = isMathJax(el);
        const latex = isLatex(el);

        if (res) {
          prev = el;
          return renderMath(el, i);
        } else if (latex) {
          prev = el;
          return renderLatex(el, i);
        }

        if (isPhone() && isBlockqouteNoBreaks(el)) {
          if (prev && isBlockqouteNoBreaks(prev)) {
            prev = el;
            return <div dangerouslySetInnerHTML={{__html: el }} />
          }

          prev = el;

          return (
            <div>
              <div className="scroll-sideways-hint">
                <SpriteIcon name="flaticon-swipe" />
                <div>Scroll sideways on each line that overflows</div>
              </div>
              <div dangerouslySetInnerHTML={{ __html: el }} />
            </div>
          );
        }

        prev = el;

        return <HtmlWithSpaces index={i} value={el} className={this.props.className} />;
      })
    );
  }
}

export default MathInHtml;
