import React from "react";

import { Brick, BrickLengthEnum } from "model/brick";

import { useEffect } from "react";
import { rightKeyPressed } from "components/services/key";
import { isPhone } from "services/phone";
import { BrickFieldNames } from 'components/build/proposal/model';

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { PlayMode } from "../model";
import TimeProgressbar from "../baseComponents/timeProgressbar/TimeProgressbarV2";
import { getPrepareTime } from "../services/playTimes";
import DummyProgressbarCountdown from "../baseComponents/timeProgressbar/DummyTimeProgressbar";

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

  if (isPhone()) {
    return <div />;
  }

  const minutes = getPrepareTime(brick.brickLength);

  return (
    <div className="brick-row-container live-container">
      <div className="brick-container play-preview-panel live-page play-pre-prep-page">
        <div className="introduction-page">
          <div className="icon-container">й
            <SpriteIcon name="file-text" />
          </div>
          <div className="image-title">
            Spend about {minutes} minutes on this stage.
          </div>
          <div className="help-text">
            The <span className="underline">progress bar</span> will show you how much time you have spent preparing.
          </div>
          <div className="new-layout-footer" style={{ display: 'none' }}>
            <div className="title-column">
              <DummyProgressbarCountdown value={23} /> {minutes}:00
            </div>
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
