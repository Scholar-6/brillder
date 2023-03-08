import React from 'react';

// @ts-ignore
import MathJax from 'react-mathjax-preview'
import {isLatex, isMathJax, parseSynthesisDataToArray} from 'components/services/mathJaxService';
import './TextLive.scss';
import { PlayMode } from '../model';
import HighlightHtml from '../baseComponents/HighlightHtml';
import Katex from 'components/baseComponents/katex/Katex';
import HtmlWithSpaces from '../baseComponents/HtmlWithSpaces';
import { isPhone } from 'services/phone';
import QuotePlayCustom from './QuotePlayCustom';


interface TextProps {
  component: any;
  className?: string;

  // for build phone preview
  refs?: any;

  // only for real play
  mode?: PlayMode;
}

const TextLive: React.FC<TextProps> = ({ mode, className, component, refs }) => {
  if (mode === PlayMode.Highlighting || mode === PlayMode.UnHighlighting) {
    return (
      <HighlightHtml value={component.value} mode={mode} onHighlight={value => component.value = value} />
    );
  }

  var arr = parseSynthesisDataToArray(component.value);

  const renderMath = (data: string, i: number) => {
    return <MathJax math={data} key={i} />;
  }

  const renderLatex = (latex: string, i: number) => {
    return <Katex latex={latex} key={i} />
  }

  const isBlockqouteNoBreaks = (el: string) => {
    return /<blockquote (.*)class="bq no-break"(.*)>/.test(el);
  }

  const isBlockqouteNoBreaksV2 = (el: string) => {
    return /<div class='quote-no-break-group-f43g'>/.test(el);
  }

  let classN = 'text-play';
  if (className) {
    classN += ' ' + className;
  }

  if (isPhone()) {
    const groupQuates = (arrR: string[]) => {
      let finalArr = [];
      let tempQuote = "<div class='quote-no-break-group-f43g'>";
      let isPrevQuote = false;
      for (let el of arrR) {
        let isQuote = isBlockqouteNoBreaks(el);
        if (isQuote) {
          tempQuote += el;
          isPrevQuote = true;
        } else {
          if (isPrevQuote == true) {
            tempQuote += "</div>";
            finalArr.push(tempQuote);
            tempQuote = "<div class='quote-no-break-group-f43g'>";
          }
          finalArr.push(el);
          isPrevQuote = false;
        }
      }
      return finalArr;
    }
    
    arr = groupQuates(arr);
  }

  return (
    <div className={classN} ref={refs}>
      {
        arr.map((el:any, i:number) => {
          const res = isMathJax(el);
          const latex = isLatex(el);
          if (res) {
            return renderMath(el, i);
          } else if (latex) {
            return renderLatex(el, i);
          }

          if (isPhone() && isBlockqouteNoBreaksV2(el)) {
            return <QuotePlayCustom key={i} quoteHtml={el} />;
          }

          return <HtmlWithSpaces key={i} index={i} value={el} />;
        })
      }
    </div>
  );
}

export default TextLive;
