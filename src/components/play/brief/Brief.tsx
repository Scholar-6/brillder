import React from "react";

import { Brick } from "model/brick";

import { useEffect } from "react";
import { rightKeyPressed } from "components/services/key";
import { isPhone } from "services/phone";
import { BrickFieldNames } from 'components/build/proposal/model';

import SpriteIcon from "components/baseComponents/SpriteIcon";
import MathInHtml from "../baseComponents/MathInHtml";
import HighlightHtml from "../baseComponents/HighlightHtml";
import { PlayMode } from "../model";
import FixedHelpers from "./FixedHelpers";

interface Props {
  brick: Brick;

  moveNext(): void;
  mode?: PlayMode;
  onHighlight?(name: BrickFieldNames, value: string): void;
}

const BriefPage: React.FC<Props> = ({ brick, ...props }) => {
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

  const renderBriefTitle = () => {
    return (
      <div className="expand-title brief-title" style={{ marginTop: '4vh' }}>
        <span>Brief</span>
        <div className="centered text-white">
          <div className="round-icon b-green">
            <SpriteIcon name="arrow-down" className="arrow" />
          </div>
        </div>
      </div>
    );
  };

  const renderBriefExpandText = () => {
    return (
      <div className="expanded-text">
        <HighlightHtml
          value={brick.brief}
          mode={props.mode}
          onHighlight={value => {
            if (props.onHighlight) {
              props.onHighlight(BrickFieldNames.brief, value)
            }
          }}
        />
      </div>
    );
  };

  return (
    <div className="brick-row-container live-container">
      <div className="fixed-upper-b-title">
        {brick.title}
      </div>
      <div className="brick-container play-preview-panel live-page play-brief-page">
        <div className="introduction-page">
          <div className="open-question">
            <MathInHtml value={brick.openQuestion} />
          </div>
          <div className="introduction-content">
            {renderBriefTitle()}
            {renderBriefExpandText()}
          </div>
          <div className="new-layout-footer" style={{ display: 'none' }}>
            <div className="title-column">
              Now you’re ready for preparatory tasks
            </div>
            <img alt="" className="footer-arrow" src="/images/play-arrows/BriefArrow.svg" />
            <div className="new-navigation-buttons">
              <div className="n-btn next" onClick={props.moveNext}>
                Next
                <SpriteIcon name="arrow-right" />
              </div>
            </div>
          </div>
        </div>
        <FixedHelpers />
      </div>
    </div>
  );
};

export default BriefPage;
