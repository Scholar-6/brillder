import React from 'react';

// @ts-ignore
import MathJax from 'react-mathjax-preview'
import {parseDataToArray, isMathJax} from 'components/services/mathJaxService';
import './TextLive.scss';


interface TextProps {
  component: any;
}

const TextLive: React.FC<TextProps> = ({ component }) => {
  var arr = parseDataToArray(component.value);

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
