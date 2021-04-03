import React from "react";

import { Brick } from "model/brick";

import { useEffect } from "react";
import { rightKeyPressed } from "components/services/key";
import { isPhone } from "services/phone";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import TypingLabel from "components/baseComponents/TypingLabel";

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
    return <div />;
  }

  return (
    <div className="brick-row-container live-container">
      <div className="fixed-upper-b-title text-white q-brick-title" dangerouslySetInnerHTML={{ __html: brick.title }} />
      <div className="brick-container play-preview-panel live-page after-cover-page">
        <div className="introduction-page">
          <div className="after-cover-main-content">
            <div className="title">
              <TypingLabel label="A brick has four sections." onEnd={() => {}} />
            </div>
            <div className="like-buttons-container">
              <div className="x-center">
                <div className="like-button orange" onClick={props.moveNext}>Preparation</div>
              </div>
              <div className="x-center">
                <div className="like-button">Investigation</div><div className="like-button">Synthesis</div>
              </div>
              <div className="x-center">
                <div className="like-button">Review</div>
              </div>
            </div>
            <div className="footer">
              The Preparation phase <span className="underline-border">briefs</span> you, and presents some <span className="underline-border">tasks to get you thinking.</span>
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
