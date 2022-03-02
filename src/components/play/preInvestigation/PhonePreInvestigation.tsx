import React from "react";
import { faHourglassStart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Brick } from "model/brick";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import MusicAutoplay from "components/baseComponents/MusicAutoplay";

interface Props {
  brick: Brick;
  moveNext(): void;
}

const PreInvestigationPage: React.FC<Props> = ({ brick, moveNext }) => {
  return (
    <div className="pre-investigation">
      <MusicAutoplay url="/sounds/mixkit-fast-sweep-transition.wav" />
      <div
        className="fixed-upper-b-title"
        dangerouslySetInnerHTML={{ __html: brick.title }}
      />
      <div className="introduction-page">
        <div className="ss-phone-before-title" />
        <div className="dd-question-container">
          <div className="dd-first">?</div>
          <div className="dd-second">?</div>
          <div className="dd-third">?</div>
        </div>
        <div className="title s-fade1">
          <div>Time for some questions.</div>
        </div>
        <div className="ss-phone-after-title" />
        <div className="like-button green animate-v1">
          <div>
            <SpriteIcon name="check-icon" />
          </div>
          Preparation
        </div>
        <div className="ss-phone-between-button" />
        <div className="like-button orange" onClick={moveNext}>
          <SpriteIcon name="arrow-right" className="absolute-arrow-left-df" />
          <FontAwesomeIcon icon={faHourglassStart} className="glass-icon-dd" />
          Investigation
        </div>
        <div className="ss-phone-between-button" />
        <div className="like-button animate-v1">Synthesis</div>
        <div className="ss-phone-between-button" />
        <div className="like-button animate-v1">Review</div>
      </div>
    </div>
  );
};

export default PreInvestigationPage;
