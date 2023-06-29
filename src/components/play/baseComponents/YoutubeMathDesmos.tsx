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
import HtmlWithSpaces from './HtmlWithSpaces';
import SoundPlay from 'components/baseComponents/SoundPlay';
import HtmlImageWithSpaces from './HtmlImageWithSpaces';
import { renderStl } from 'services/stl';
import { isPhone } from 'services/phone';

interface MathHtmlProps {
  innerRef?: any;
  value: string;
  isPhonePreview?: boolean;
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
     
      let phone = isPhone();
      
      const stlElements = elt.getElementsByClassName("image-3d-stl");
      for(const element of Array.from(stlElements)) {
        element.innerHTML = "";
        if (phone || props.isPhonePreview) {
          renderStl(element, 200, 200);
        } else {
          renderStl(element, 700, 700);
        }
      }
    }
  /*eslint-disable-next-line*/
  }, [props.value]);

  const renderLatex = (latex: string, i: number) => {
    return <Katex latex={latex} key={i} />
  }

  if (arr.length === 0) {
    return <div>{props.value}</div>;
  }
  const isStl = (el: string) => {
    return /<div class=\"image-3d-stl\"/.test(el);
  }

  const isYoutube = (el: string) => {
    /*eslint-disable-next-line*/
    return /<iframe.*src=\"https:\/\/www.youtube\.com\/embed/.test(el);
  }

  const isSound = (el: string) => {
    return /<section (.*)class="ql-sound-custom"(.*)>/.test(el);
  }

  const isImage = (el: string) => {
    return /<img class="image-play"/.test(el);
  }

  return (
    <div className="youtube-video-session" ref={props.innerRef}>
      <div ref={renderedRef}>
        {
          arr.map((el: any, i: number) => {

            let res = isMathJax(el);
            const latex = isLatex(el);
            const sound = isSound(el);
            if (res) {
              return renderMath(el, i);
            } else if (latex) {
              return renderLatex(el, i);
            } else if (sound) {
              return <SoundPlay element={el} key={i} />
            }

            res = isYoutube(el);
            if (res) {
              return <YoutubeLink key={i} value={el} />;
            }
            res = isStl(el);
            if (res) {
            }

            const image = isImage(el);
            if (image) {
              return <HtmlImageWithSpaces key={i} index={i} value={el} />;
            }

            return <HtmlWithSpaces key={i} index={i} value={el} />;
          })
        }
      </div>
    </div>
  );
}

export default React.forwardRef((props: MathHtmlProps, ref) => <YoutubeMathDesmos innerRef={ref} {...props} />);
