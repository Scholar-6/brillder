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
import SpriteIcon from 'components/baseComponents/SpriteIcon';


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

  let classN = 'text-play';
  if (className) {
    classN += ' ' + className;
  }

  let prev:any = null;

  return (
    <div className={classN} ref={refs}>
      {
        arr.map((el:any, i:number) => {
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
              <div key={i}>
                <div className="scroll-sideways-hint">
                  <SpriteIcon name="flaticon-swipe" />
                  <div>Scroll sideways on each line that overflows</div>
                </div>
                <div dangerouslySetInnerHTML={{ __html: el }} />
              </div>
            );
          }

          prev = el;
          return <HtmlWithSpaces key={i} index={i} value={el} />;
        })
      }
    </div>
  );
}

export default TextLive;
