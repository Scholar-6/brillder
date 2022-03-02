import React, { useEffect } from "react";
import { faHourglassStart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Brick } from "model/brick";
import { rightKeyPressed } from "components/services/key";
import { isPhone } from "services/phone";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import MusicAutoplay from "components/baseComponents/MusicAutoplay";

interface Props {
  brick: Brick;
  moveNext(): void;
}

const SectionsPage: React.FC<Props> = ({ brick, ...props }) => {
  useEffect(() => {
    function handleMove(e: any) {
      if (rightKeyPressed(e)) {
        props.moveNext();
      }
    }

    document.addEventListener("keydown", handleMove, false);

    return function cleanup() {
      document.removeEventListener("keydown", handleMove, false);
    };
  });

  if (isPhone()) {
    return (
      <div className="pre-investigation pre-synthesis">
        <MusicAutoplay url="/sounds/mixkit-fast-sweep-transition.wav" />
        <div className="fixed-upper-b-title" dangerouslySetInnerHTML={{ __html: brick.title }} />
        <div className="introduction-page">
          <div className="ss-phone-before-brain" />
          <div className="ss-phone-before-title" />
          <div className="title s-fade1">
            A brick has four sections.
          </div>
          <div className="ss-phone-after-title" />
          <div className="like-button orange animate-v1">
            <SpriteIcon name="arrow-right" className="absolute-arrow-left-de" />
            Preparation
          </div>
          <div className="ss-phone-between-button" />
          <div className="like-button animate-v1">
            Investigation
          </div>
          <div className="ss-phone-between-button" />

          <div className="like-button no-padding" onClick={props.moveNext}>
            Synthesis
          </div>
          <div className="ss-phone-between-button" />
          <div className="like-button animate-v1">Review</div>
          <div className="ss-phone-after-buttons" />
        </div>
      </div>
    );
  }

  return (
    <div className="brick-row-container live-container">
      <MusicAutoplay url="/sounds/mixkit-fast-sweep-transition.wav" />
      <div className="fixed-upper-b-title text-white q-brick-title" dangerouslySetInnerHTML={{ __html: brick.title }} />
      <div className="brick-container play-preview-panel live-page after-cover-page animate-fade">
        <div className="introduction-page">
          <div className="after-cover-main-content">
            <div className="title s-fade1">
              A brick has four sections.
            </div>
            <div className="like-buttons-container s-fade2">
              <div className="x-center">
                <div className="like-button orange" onClick={props.moveNext}>
                  <SpriteIcon name="arrow-right" className="absolute-arrow-left" />
                  Preparation
                </div>
              </div>
              <div className="x-center">
                <div className="like-button">
                  <FontAwesomeIcon icon={faHourglassStart} className="glass-icon-dd" />
                  Investigation
                </div>
                <div className="like-button">
                  Synthesis
                </div>
              </div>
              <div className="x-center">
                <div className="like-button">
                  <FontAwesomeIcon icon={faHourglassStart} className="glass-icon-dd" />
                  Review
                </div>
              </div>
            </div>
          </div>
          <div className="new-layout-footer" style={{ display: 'none' }}>
            <div className="title-column">
            </div>
            <div className="new-navigation-buttons">
              <div className="n-btn next" onClick={props.moveNext}>
                Next
                <SpriteIcon name="arrow-right" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionsPage;
