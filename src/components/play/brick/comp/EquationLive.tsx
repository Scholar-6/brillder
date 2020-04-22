import React from 'react';
// @ts-ignore
import MathJax from 'react-mathjax'

import './EquationLive.scss';


interface EquationProps {
  component: any;
}

const EquationLive: React.FC<EquationProps> = ({ component }) => {
  if (!component.value) {
    return <div></div>;
  }

  var arr = component.value.match(/<(.+)>.*?<\/(.+)>/g);

  function extractContent(s: string) {
    var span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
  }

  const renderLaTex = (el: string) => {
    let text = extractContent(el);
    text = text.slice(2, text.length - 1);
    return (
      <MathJax.Provider>
        <MathJax.Node formula={text} />
      </MathJax.Provider>
    );
  }

  return (
    <div>
      {
        arr ? arr.map((el:any, i:number) => {
          var res = el.indexOf('<span class="math-tex">');
          if (res >= 0) {
            return renderLaTex(el);
          } else {
            return <div dangerouslySetInnerHTML={{ __html: el}} />
          }
        }) : ""
      }
    </div>
  );
}

export default EquationLive;
