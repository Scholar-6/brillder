import React from "react";

// @ts-ignore
import MathJax from "react-mathjax-preview";
import {
  isMathJax, parseSynthesisDataToArray
} from "components/services/mathJaxService";
import "./SynthesisPreview.scss";

interface SynthesisPreviewProps {
  data: string;
}

const SynthesisPreviewComponent: React.FC<SynthesisPreviewProps> = ({
  data,
}) => {
  var arr = parseSynthesisDataToArray(data);

  const renderMath = (data: string, i: number) => {
    return <MathJax math={data} key={i} />;
  };

  return (
    <div className="phone-preview-component synthesis-preview">
      <div className="synthesis-title" style={{ textAlign: "center" }}>
        Synthesis
      </div>
      <div className="synthesis-text">
        {arr.map((el: any, i: number) => {
          const res = isMathJax(el);
          if (res) {
            return renderMath(el, i);
          } else {
            return <div key={i} dangerouslySetInnerHTML={{ __html: el }} />;
          }
        })}
      </div>
    </div>
  );
};

export default SynthesisPreviewComponent;
