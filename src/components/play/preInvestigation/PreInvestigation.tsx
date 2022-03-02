import React from "react";
import { faHourglassStart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Brick } from "model/brick";

import { useEffect } from "react";
import { rightKeyPressed } from "components/services/key";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import MusicWrapper from "components/baseComponents/Music";

interface Props {
  brick: Brick;
  moveNext(): void;
}

const PreInvestigationPage: React.FC<Props> = ({ brick, moveNext }) => {
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

  return (
    <div className="brick-row-container live-container static-top-part">
      <div className="fixed-upper-b-title q-brick-title" dangerouslySetInnerHTML={{ __html: brick.title }} />
      <div className="brick-container play-preview-panel live-page after-cover-page pre-investigation animate-fade">
        <div className="introduction-page">
          <div className="after-cover-main-content static-top-part-inner">
            <div className="title s-fade1">
              Time for some questions.
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
                <div className="like-button orange" onClick={moveNext}>
                  <SpriteIcon name="arrow-right" className="absolute-arrow-left" />
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
            <div className="time-container" />
            <div className="minutes" />
            <div className="footer-space" />
            <div className="new-navigation-buttons">
              <MusicWrapper startTime={0} url="/sounds/mixkit-ominous-drums.wav">
                <div className="n-btn next" onClick={moveNext}>
                  Play Brick
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

export default PreInvestigationPage;
