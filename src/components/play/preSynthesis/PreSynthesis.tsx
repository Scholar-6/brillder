import React from "react";
import { faHourglassStart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Brick } from "model/brick";

import { useEffect } from "react";
import { rightKeyPressed } from "components/services/key";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import routes from "../routes";
import MusicAutoplay from "components/baseComponents/MusicAutoplay";

interface Props {
  brick: Brick;
  history: any;
}

const PreSynthesis: React.FC<Props> = ({ brick, ...props }) => {
  const moveNext = () => props.history.push(routes.playSynthesis(brick));

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
      <MusicAutoplay url="/sounds/mixkit-fast-sweep-transition.wav" />
      <div className="fixed-upper-b-title q-brick-title" dangerouslySetInnerHTML={{ __html: brick.title }} />
      <div className="brick-container play-preview-panel live-page after-cover-page pre-synthesis animate-fade">
        <div className="introduction-page">
          <div className="after-cover-main-content static-top-part-inner">
            <div className="title s-fade1">
              Deepen your understanding.
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
                <div className="like-button orange" onClick={moveNext}>
                  <SpriteIcon name="arrow-left" className="absolute-arrow-right" />
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
            <div className="title-column" />
            <div className="minutes-footer" />
            <div className="footer-space" />
            <div className="new-navigation-buttons">
              <div className="n-btn next" onClick={moveNext}>
                Read Synthesis
                <SpriteIcon name="arrow-right" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreSynthesis;
