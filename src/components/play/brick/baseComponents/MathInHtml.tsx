import React, { Component } from 'react';
// @ts-ignore
import MathJax from 'react-mathjax-preview'

import {parseDataToArray, isMathJax} from 'components/services/mathJaxService';


interface MathHtmlProps {
  value: string;
}

class MathInHtml extends Component<MathHtmlProps> {
  render() {
    var arr = parseDataToArray(this.props.value);

    const renderMath = (data: string, i: number) => {
      return <MathJax math={data} key={i} />;
    }

    if (arr.length === 0) {
      return <div>{this.props.value}</div>;
    }

    return (
      <div>
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
}

export default MathInHtml;
