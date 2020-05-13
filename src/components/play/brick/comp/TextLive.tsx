import React from 'react';

// @ts-ignore
import MathJax from 'react-mathjax-preview'
import './TextLive.scss';


interface TextProps {
  component: any;
}

const TextLive: React.FC<TextProps> = ({ component }) => {
  const parseData = () => {
    const res = component.value.replace(/<\/p>/gi, (s: string) => {
      return s + '\n';
    });
    return res.match(/<(.+)>.*?<\/(.+)>/g);
  }

  var arr = parseData();

  const renderMath = (data: string, i: number) => {
    return <MathJax math={data} key={i} />;
  }

  return (
    <div className="text-play">
      {
        arr ? arr.map((el:any, i:number) => {
          const res = el.indexOf('<math xmlns="http://www.w3.org/1998/Math/MathML">');
          if (res >= 0) {
            return renderMath(el, i);
          } else {
            return <div key={i} dangerouslySetInnerHTML={{ __html: el}} />
          }
        }) : ""
      }
    </div>
  );
}

export default TextLive;
