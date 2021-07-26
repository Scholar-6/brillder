import React from "react";

import { Brick } from "model/brick";

import { useEffect } from "react";
import { rightKeyPressed } from "components/services/key";
import { BrickFieldNames } from 'components/build/proposal/model';

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { PlayMode } from "../model";
import { getPrepareTime } from "../services/playTimes";
import DummyProgressbarCountdown from "../baseComponents/timeProgressbar/DummyTimeProgressbar";
import BrickTitle from "components/baseComponents/BrickTitle";
import { isPhone } from "services/phone";

interface Props {
  brick: Brick;

  moveNext(): void;
  mode?: PlayMode;
  onHighlight?(name: BrickFieldNames, value: string): void;
}

const PrePrepPage: React.FC<Props> = ({ brick, ...props }) => {
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

  const minutes = getPrepareTime(brick.brickLength);

  return (
    <div className="brick-row-container live-container">
      <div className="fixed-upper-b-title">
        <BrickTitle title={brick.title} />
      </div>
      <div className="brick-container play-preview-panel live-page play-pre-prep-page">
        <div className="introduction-page">
          <div className="icon-container">
            <SpriteIcon name="file-text" />
          </div>
          <div className="image-title">
            Spend about {minutes} minutes on this stage.
          </div>
          <div className="help-text">
            The <span className="underline">progress bar</span> will show you how much time you have spent preparing.
          </div>
          {isPhone() ? <div className="fe-arrow-container">
            <SpriteIcon name="play-red-arrow" />
          </div> : <SpriteIcon name="pre-prep-arrow" className="fe-arrow" />
          }
          <div className="new-layout-footer" style={{ display: 'none' }}>
            <div className="title-column">
              <DummyProgressbarCountdown value={50} />
            </div>
            <div className="minutes-footer">
              {minutes}:00
            </div>
            <div className="footer-space" />
            <div className="new-navigation-buttons">
              <div className="n-btn next" onClick={props.moveNext}>
                Start Prep
                <SpriteIcon name="arrow-right" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrePrepPage;
