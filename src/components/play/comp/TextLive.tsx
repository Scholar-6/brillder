import React from 'react';

// @ts-ignore
import MathJax from 'react-mathjax-preview'
import {isMathJax, parseSynthesisDataToArray} from 'components/services/mathJaxService';
import './TextLive.scss';
import { PlayMode } from '../model';
import HighlightHtml from '../baseComponents/HighlightHtml';


interface TextProps {
  component: any;

  // only for real play
  mode?: PlayMode;
}

const TextLive: React.FC<TextProps> = ({ mode, component }) => {
  if (mode === PlayMode.Highlighting || mode === PlayMode.UnHighlighting) {
    return (
      <HighlightHtml value={component.value} mode={mode} onHighlight={value => component.value = value} />
    );
  }

  var arr = parseSynthesisDataToArray(component.value);

  const renderMath = (data: string, i: number) => {
    return <MathJax math={data} key={i} />;
  }

  return (
    <div className="text-play">
      {
        arr.map((el:any, i:number) => {
          const res = isMathJax(el);
          if (res) {
            return renderMath(el, i);
          } else {
            return <div key={i} dangerouslySetInnerHTML={{ __html: el}} />
          }
        })
      }
    </div>
  );
}

export default TextLive;
