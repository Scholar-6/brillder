import React from "react";

import { Brick } from "model/brick";

import { useEffect } from "react";
import { rightKeyPressed } from "components/services/key";
import { isPhone } from "services/phone";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import DummyProgressbarCountdown from "../baseComponents/timeProgressbar/DummyTimeProgressbar";
import { getReviewTime } from "../services/playTimes";

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
          <div className="like-button green animate-v1">
            <div>
              <SpriteIcon name="check-icon" />
            </div>
            Investigation</div>
          <div className="ss-phone-between-button" />
          <div className="like-button green animate-v1">
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

  const minutes = getReviewTime(brick.brickLength);

  return (
    <div className="brick-row-container live-container static-top-part">
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
            <div className="title-column">
              <DummyProgressbarCountdown value={100} deadline={true} />
            </div>
            <div className="minutes-footer">
              {minutes}:00
            </div>
            <div className="footer-space" />
            <div className="new-navigation-buttons">
              <div className="n-btn next" onClick={moveNext}>
                Start Review
                <SpriteIcon name="arrow-right" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreReview;
