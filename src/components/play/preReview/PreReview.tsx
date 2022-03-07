import React from "react";

import { Brick } from "model/brick";

import { useEffect } from "react";
import { rightKeyPressed } from "components/services/key";
import { isPhone } from "services/phone";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import MusicWrapper from "components/baseComponents/MusicWrapper";
import MusicAutoplay from "components/baseComponents/MusicAutoplay";

interface Props {
  brick: Brick;
  moveNext(): void;
}

const PreReview: React.FC<Props> = ({ brick, moveNext }) => {
  useEffect(() => {
    function handleMove(e: any) {
      if (rightKeyPressed(e)) {
        moveNext();
      }
    }

    document.addEventListener("keydown", handleMove, false);

    return function cleanup() {
      document.removeEventListener("keydown", handleMove, false);
    };
  });

  if (isPhone()) {
    return (
      <div className="pre-investigation pre-review">
        <MusicAutoplay url="/sounds/mixkit-fast-sweep-transition.wav" />
        <div
          className="fixed-upper-b-title"
          dangerouslySetInnerHTML={{ __html: brick.title }}
        />
        <div className="introduction-page">
          <div className="ss-phone-before-title" />
          <div className="dd-question-container">
            <SpriteIcon name="f-trending-up" className="smaller" />
            <SpriteIcon name="f-trending-up" className="bigger" />
          </div>
          <div className="title s-fade1">
            <div>Improve your score.</div>
          </div>
          <div className="ss-phone-after-title" />
          <div className="like-button green animate-v1">
            <div>
              <SpriteIcon name="check-icon" />
            </div>
            Preparation</div>
          <div className="ss-phone-between-button" />
          <div className="like-button green green-2 animate-v1">
            <div>
              <SpriteIcon name="check-icon" />
            </div>
            Investigation</div>
          <div className="ss-phone-between-button" />
          <div className="like-button green green-3 animate-v1">
            <div>
              <SpriteIcon name="check-icon" />
            </div>
            Synthesis</div>
          <div className="ss-phone-between-button" />
          <div className="like-button orange no-padding" onClick={moveNext}>
            <SpriteIcon name="arrow-right" className="absolute-arrow-left-df" />
            Review
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="brick-row-container live-container static-top-part">
      <MusicAutoplay url="/sounds/mixkit-fast-sweep-transition.wav" />
      <div className="fixed-upper-b-title q-brick-title" dangerouslySetInnerHTML={{ __html: brick.title }} />
      <div className="brick-container play-preview-panel live-page after-cover-page pre-synthesis animate-fade">
        <div className="introduction-page">
          <div className="after-cover-main-content static-top-part-inner">
            <div className="title s-fade1">
              Improve your score.
            </div>
            <div className="like-buttons-container s-fade2">
              <div className="x-center">
                <div className="like-button green">
                  <div>
                    <SpriteIcon name="check-icon" />
                  </div>
                  Preparation
                </div>
              </div>
              <div className="x-center">
                <div className="like-button green">
                  <div>
                    <SpriteIcon name="check-icon" />
                  </div>
                  Investigation
                </div>
                <div className="like-button green">
                  <div>
                    <SpriteIcon name="check-icon" />
                  </div>
                  Synthesis
                </div>
              </div>
              <div className="x-center">
                <div className="like-button orange" onClick={moveNext}>
                  <SpriteIcon name="arrow-right" className="absolute-arrow-left" />
                  Review
                </div>
              </div>
            </div>
          </div>
          <div className="new-layout-footer" style={{ display: 'none' }}>
            <div className="title-column" />
            <div className="minutes-footer" />
            <div className="footer-space" />
            <div className="new-navigation-buttons">
              <MusicWrapper startTime={0} url="/sounds/mixkit-hard-horror-hit-drum.wav">
                <div className="n-btn next" onClick={moveNext}>
                  Start Review
                  <SpriteIcon name="arrow-right" />
                </div>
              </MusicWrapper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreReview;
