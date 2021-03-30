import React from "react";
import * as Y from "yjs";
import _ from "lodash";

import "./SynthesisPreview.scss";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { Radio } from "@material-ui/core";
import { BrickLengthEnum } from "model/brick";
import ObservableText from "../plan/ObservableText";

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
      <div className="synthesis-text">
        <ObservableText text={data.synthesis} />
      </div>
    </div>
  );
};

export default SynthesisPreviewComponent;
