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

interface PlanPreviewProps {
  ybrick: Y.Map<any>;
}


const PlanPreviewComponent: React.FC<PlanPreviewProps> = ({ybrick}) => {
  return (
    <div className="phone-preview-component synthesis-preview">
      <div className="synthesis-title" style={{ textAlign: "center" }}>
      </div>
    </div>
  );
};

export default PlanPreviewComponent;
