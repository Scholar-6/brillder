import React from "react";

import { Brick } from "model/brick";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import MusicAutoplay from "components/baseComponents/MusicAutoplay";

interface Props {
  brick: Brick;
  moveNext(): void;
}

const PhonePreSynthesisPage: React.FC<Props> = ({ brick, moveNext }) => {
  return (
    <div className="pre-investigation pre-synthesis">
      <MusicAutoplay url="/sounds/mixkit-fast-sweep-transition.wav" />
      <div className="fixed-upper-b-title" dangerouslySetInnerHTML={{ __html: brick.title }} />
      <div className="introduction-page">
        <div className="ss-phone-before-brain" />
        <div className="ss-brain-container s-fade-1">
          <SpriteIcon name="brain" className="ss-brain" />
        </div>
        <div className="ss-phone-before-title" />
        <div className="title s-fade1">
          Deepen your understanding.
        </div>
        <div className="ss-phone-after-title" />
        <div className="like-button green animate-v1">
          <div>
            <SpriteIcon name="check-icon" />
          </div>
          Preparation
        </div>
        <div className="ss-phone-between-button" />
        <div className="like-button green green-2 animate-v1">
          <div>
            <SpriteIcon name="check-icon" />
          </div>
          Investigation
        </div>
        <div className="ss-phone-between-button" />

        <div className="like-button orange no-padding" onClick={moveNext}>
          <SpriteIcon name="arrow-right" className="absolute-arrow-left-df" />
          Synthesis
        </div>
        <div className="ss-phone-between-button" />
        <div className="like-button animate-v1">Review</div>
        <div className="ss-phone-after-buttons" />
      </div>
    </div>
  );
};

export default PhonePreSynthesisPage;
