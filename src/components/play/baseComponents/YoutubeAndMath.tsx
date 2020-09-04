import React, { Component } from 'react';
// @ts-ignore
import MathJax from 'react-mathjax-preview'

import {parseDataToArray, isMathJax} from 'components/services/mathJaxService';
import YoutubeLink from './YoutubeLink';
import './YoutubeAndMath.scss'

interface MathHtmlProps {
  value: string;
}

class YoutubeAndMathInHtml extends Component<MathHtmlProps> {
  isYoutube(el: string) {
    if (el.indexOf('<figure class="media">') >= 0) {
      if (el.indexOf('youtube.com/watch') >= 0) {
        return true;
      }
    }
    return false;
  }

  render() {
    var arr = parseDataToArray(this.props.value);

    const renderMath = (data: string, i: number) => {
      return <MathJax math={data} key={i} />;
    }

    if (arr.length === 0) {
      return <div>{this.props.value}</div>;
    }

    return (
      <div className="youtube-video-session">
        {
          arr.map((el:any, i:number) => {
            let res = isMathJax(el);
            if (res) {
              return renderMath(el, i);
            }
            res = this.isYoutube(el);
            if (res) {
              return <YoutubeLink key={i} value={el} />;
            }
            return <div key={i} dangerouslySetInnerHTML={{ __html: el}} />
          })
        }
      </div>
    );
  }
}

export default YoutubeAndMathInHtml;
