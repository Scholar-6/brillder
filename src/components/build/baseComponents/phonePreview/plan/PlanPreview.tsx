import React from "react";
import * as Y from "yjs";

// @ts-ignore
import MathJax from "react-mathjax-preview";
import {
  isMathJax, parseSynthesisDataToArray, isLatex
} from "components/services/mathJaxService";
import "./PlanPreview.scss";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { Radio } from "@material-ui/core";
import { BrickLengthEnum } from "model/brick";
import Katex from "components/baseComponents/katex/Katex";
import { toRenderJSON } from "services/SharedTypeService";
import KeyWordsPlay from "components/build/proposal/questionnaire/brickTitle/KeywordsPlay";

interface PlanPreviewProps {
  data: {
    ybrick: Y.Map<any>;
  }
}

const PlanPreviewComponent: React.FC<PlanPreviewProps> = ({ data }) => {
  const { ybrick } = data;

  return (
    <div className="phone-preview-component plan-preview">
      <div className="title" style={{ textAlign: "center" }}>
        {ybrick.get("title").toString()}
      </div>
      <KeyWordsPlay keywords={ybrick.get("keywords").toJSON()} />
      <div>
        {ybrick.get("openQuestion").toString()}
      </div>
      <div className="expand-title brief-title" style={{ marginTop: '4vh' }}>
        <span>Brief</span>
        <div className="centered text-white">
          <div className="round-icon b-green">
            <SpriteIcon name="arrow-down" className="arrow" />
          </div>
        </div>
      </div>
      <div>
        {ybrick.get("brief").toString()}
      </div>
      <div className="expand-title prep-title" style={{ marginTop: '4vh' }}>
        <span>Prep</span>
        <div className="centered text-white">
          <div className="round-icon b-green">
            <SpriteIcon name="arrow-down" className="arrow" />
          </div>
        </div>
      </div>
      <div>
        {ybrick.get("brief").toString()}
      </div>
    </div>
  );
};

export default PlanPreviewComponent;
