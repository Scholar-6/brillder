import React from "react";
import * as Y from "yjs";

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
import { toRenderJSON } from "services/SharedTypeService";

interface SynthesisPreviewData {
  synthesis: Y.Text;
  brickLength: BrickLengthEnum;
}

interface SynthesisPreviewProps {
  data: SynthesisPreviewData;
}

const EmptySynthesis: React.FC<any> = ({ brickLength }) => {
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
          approx. 300-500 words
        </div>
      </div>
      <div className={`radio-container ${brickLength === BrickLengthEnum.S40min ? 'active' : ''}`}>
        <Radio disabled checked={brickLength === BrickLengthEnum.S40min} />
        <div>
          40 (8 mins for this section)
          approx. 600-800 words
        </div>
      </div>
      <div className={`radio-container ${brickLength === BrickLengthEnum.S60min ? 'active' : ''}`}>
        <Radio disabled checked={brickLength === BrickLengthEnum.S60min} />
        <div>
          60 (12 mins for this section)
          approx. 900-1200 words
        </div>
      </div>
    </div>
  );
}

interface SynthesisProps {
  synthesis: Y.Text;
}

interface SynthesisState {
  synthesis: string;
}

class RenderSynthesisContent extends React.Component<SynthesisProps, SynthesisState> {
  constructor(props: any) {
    super(props);

    this.state = {
      synthesis: toRenderJSON(this.props.synthesis)
    }

    setInterval(() => {
      let newSynthesis = toRenderJSON(this.props.synthesis);
      console.log(newSynthesis);
      if (newSynthesis.length !== this.state.synthesis.length) {
        this.setState({synthesis: newSynthesis});
      }
    }, 200);
  }

  renderMath(data: string, i: number) {
    return <MathJax math={data} key={i} />;
  };

  renderLatex(latex: string, i: number) {
    return <Katex latex={latex} key={i} />
  }

  render() {
    const arr = parseSynthesisDataToArray(this.state.synthesis);

    return (
      <div className="synthesis-text">
        {arr.map((el: any, i: number) => {
          const res = isMathJax(el);
          const latex = isLatex(el);
          if (res) {
            return this.renderMath(el, i);
          } else if (latex) {
            return this.renderLatex(el, i);
          } else {
            return <div key={i} dangerouslySetInnerHTML={{ __html: el }} />;
          }
        })}
      </div>
    )
  };
}

const SynthesisPreviewComponent: React.FC<SynthesisPreviewProps> = ({
  data
}) => {
  if (!data.synthesis) {
    return <EmptySynthesis brickLength={data.brickLength} />;
  }

  return (
    <div className="phone-preview-component synthesis-preview">
      <div className="synthesis-title" style={{ textAlign: "center" }}>
        Synthesis
      </div>
      <RenderSynthesisContent synthesis={data.synthesis} />
    </div>
  );
};

export default SynthesisPreviewComponent;
