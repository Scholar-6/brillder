import React from 'react';
// @ts-ignore
import MathJax from 'react-mathjax-preview'
//@ts-ignore
import Desmos from 'desmos';

import { isMathJax, isLatex, parseDataToArray } from 'components/services/mathJaxService';
import YoutubeLink from './YoutubeLink';
import './YoutubeAndMath.scss'
import Katex from 'components/baseComponents/katex/Katex';
import { renderGraph } from 'services/graph';

interface MathHtmlProps {
  innerRef?: any;
  value: string;
  isSynthesisParser?: boolean;
}

const YoutubeMathDesmos: React.FC<MathHtmlProps> = (props) => {
  const renderedRef = React.createRef<HTMLDivElement>();
  const [calcs, setCalcs] = React.useState<Desmos.GraphingCalculator[]>();

  const arr = parseDataToArray(props.value);

  const renderMath = (data: string, i: number) => {
    return <MathJax math={data} key={i} />;
  }

  React.useEffect(() => {
    if(renderedRef && renderedRef.current) {
      const elt = renderedRef.current;
      const elements = elt.getElementsByClassName("quill-desmos");

      calcs?.forEach((calc: any) => {
        if(calc) {
          calc.destroy();
        }
      });

      const newCalcs = [];

      for(const element of Array.from(elements)) {
        element.innerHTML = "";
        const calc = renderGraph(element);
        newCalcs.push(calc);
      }

      setCalcs(newCalcs);
    }
  /*eslint-disable-next-line*/
  }, [props.value]);

  const renderLatex = (latex: string, i: number) => {
    return <Katex latex={latex} key={i} />
  }

  if (arr.length === 0) {
    return <div>{props.value}</div>;
  }

  const isYoutube = (el: string) => {
    /*eslint-disable-next-line*/
    return /<iframe.*src=\"https:\/\/www.youtube\.com\/embed/.test(el);
  }

  return (
    <div className="youtube-video-session" ref={props.innerRef}>
      <div ref={renderedRef}>
        {
          arr.map((el: any, i: number) => {
            let res = isMathJax(el);
            const latex = isLatex(el);
            if (res) {
              return renderMath(el, i);
            } else if (latex) {
              return renderLatex(el, i);
            }
            res = isYoutube(el);
            if (res) {
              return <YoutubeLink key={i} value={el} />;
            }
            const elWithSpaces = el.replace(/ /g, '&nbsp;');
            return <div key={i} dangerouslySetInnerHTML={{ __html: elWithSpaces }} />
          })
        }
      </div>
    </div>
  );
}

export default React.forwardRef((props: MathHtmlProps, ref) => <YoutubeMathDesmos innerRef={ref} {...props} />);
