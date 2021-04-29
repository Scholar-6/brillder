import React from "react";

// @ts-ignore
import MathJax from "react-mathjax-preview";
import {
  isMathJax, parseSynthesisDataToArray, isLatex
} from "components/services/mathJaxService";
import "./SynthesisPreview.scss";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { Radio } from "@material-ui/core";
import { BrickLengthEnum } from "model/brick";
import Katex from "components/baseComponents/katex/Katex";
import { stripHtml } from "components/build/questionService/ConvertService";

interface SynthesisPreviewData {
  synthesis: string;
  brickLength: BrickLengthEnum;
}

interface SynthesisPreviewProps {
  data: SynthesisPreviewData;
}

const SynthesisPreviewComponent: React.FC<SynthesisPreviewProps> = ({
  data
}) => {
  console.log(data.synthesis, stripHtml(data.synthesis))
  if (!data.synthesis || !stripHtml(data.synthesis)) {
    const {brickLength} = data;
    return (
      <div className="phone-preview-component synthesis-preview">
        <div className="synthesis-title" style={{ textAlign: "center" }}>
          Synthesis
        </div>
        <div className="italic preview-text">
          This will appear after learners have
          played through the Investigation and
          should help them improve their score
          in the Review phase.
        </div>
        <div className="clock-container">
          <SpriteIcon name="clock" className="clock" />
        </div>
        <div className={`radio-container ${brickLength === BrickLengthEnum.S20min ? 'active' : ''}`}>
          <Radio disabled checked={brickLength === BrickLengthEnum.S20min} />
          <div>
            20 (4 mins for this section)
            approx. 600-800 words
          </div>
        </div>
        <div className={`radio-container ${brickLength === BrickLengthEnum.S40min ? 'active' : ''}`}>
          <Radio disabled checked={brickLength === BrickLengthEnum.S40min} />
          <div>
            40 (8 mins for this section)
            approx. 1200-1600 words
          </div>
        </div>
        <div className={`radio-container ${brickLength === BrickLengthEnum.S60min ? 'active' : ''}`}>
          <Radio disabled checked={brickLength === BrickLengthEnum.S60min} />
          <div>
            60 (12 mins for this section)
            approx. 1800-2000 words
          </div>
        </div>
      </div>
    );
  }

  var arr = parseSynthesisDataToArray(data.synthesis);

  const renderMath = (data: string, i: number) => {
    return <MathJax math={data} key={i} />;
  };

  const renderLatex = (latex: string, i: number) => {
    return <Katex latex={latex} key={i} />
  }

  return (
    <div className="phone-preview-component synthesis-preview">
      <div className="synthesis-title" style={{ textAlign: "center" }}>
        Synthesis
      </div>
      <div className="synthesis-text">
        {arr.map((el: any, i: number) => {
          const res = isMathJax(el);
          const latex = isLatex(el);
          if (res) {
            return renderMath(el, i);
          } else if (latex) {
            return renderLatex(el, i);
          } else {
            return <div key={i} dangerouslySetInnerHTML={{ __html: el }} />;
          }
        })}
      </div>
    </div>
  );
};

export default SynthesisPreviewComponent;
