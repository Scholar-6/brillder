import React from 'react';

// @ts-ignore
import MathJax from 'react-mathjax-preview'
import {isLatex, isMathJax, parseSynthesisDataToArray} from 'components/services/mathJaxService';
import './TextLive.scss';
import { PlayMode } from '../model';
import HighlightHtml from '../baseComponents/HighlightHtml';
import Katex from 'components/baseComponents/katex/Katex';


interface TextProps {
  component: any;
  className?: string;

  // only for real play
  mode?: PlayMode;
}

const TextLive: React.FC<TextProps> = ({ mode, className, component }) => {
  if (mode === PlayMode.Highlighting || mode === PlayMode.UnHighlighting) {
    return (
      <HighlightHtml value={component.value} mode={mode} onHighlight={value => component.value = value} />
    );
  }

  var arr = parseSynthesisDataToArray(component.value);

  const renderMath = (data: string, i: number) => {
    return <MathJax math={data} key={i} />;
  }

  const renderLatex= (latex: string, i: number) => {
    return <Katex latex={latex} key={i} />
  }

  let classN = 'text-play';
  if (className) {
    classN += ' ' + className;
  }
  return (
    <div className={classN}>
      {
        arr.map((el:any, i:number) => {
          const res = isMathJax(el);
          const latex = isLatex(el);
          if (res) {
            return renderMath(el, i);
          } else if (latex) {
            return renderLatex(el, i);
          } else {
            return <div key={i} dangerouslySetInnerHTML={{ __html: el}} />
          }
        })
      }
    </div>
  );
}

export default TextLive;
