import React from 'react';
// @ts-ignore
import MathJax from 'react-mathjax-preview'
//@ts-ignore
import Desmos from 'desmos';

import { isMathJax, isLatex, parseDataToArray } from 'components/services/mathJaxService';
import YoutubeLink from './YoutubeLink';
import './YoutubeAndMath.scss'
import Katex from 'components/baseComponents/katex/Katex';

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

  const renderGraph = (el: Element) => {
    const value = JSON.parse(el.getAttribute("data-value") as string);

    const desmos = Desmos.GraphingCalculator(el, {
      fontSize: Desmos.FontSizes.VERY_SMALL,
      expressions: false,
      settingsMenu: false,
      lockViewport: true,
      pointsOfInterest: true,
      trace: true,
    });
    desmos.setState(value.graphState);

    return desmos;
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
            return <div key={i} dangerouslySetInnerHTML={{ __html: el }} />
          })
        }
      </div>
    </div>
  );
}

export default React.forwardRef((props: MathHtmlProps, ref) => <YoutubeMathDesmos innerRef={ref} {...props} />);
