import React, { useEffect } from "react";
import * as Y from "yjs";

import "./PlanPreview.scss";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import KeyWordsPlay from "components/build/proposal/questionnaire/brickTitle/KeywordsPlay";
import ObservableText from "./ObservableText";

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
        <ObservableText text={ybrick.get("openQuestion")} math={true} />
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
        <ObservableText text={ybrick.get("brief")} math={true} />
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
        <ObservableText text={ybrick.get("prep")} math={true} />
      </div>
    </div>
  );
};

export default PlanPreviewComponent;
