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
import HighlightQuoteHtml from "../baseComponents/HighlightQuoteHtml";
import TimeProgressbarV2 from "../baseComponents/timeProgressbar/TimeProgressbarV2";
import { getPrepareTime } from "../services/playTimes";
import BrickTitle from "components/baseComponents/BrickTitle";


export interface IntroductionState {
  isStopped: boolean;
  prepExpanded: boolean;
  briefExpanded: boolean;
  duration: any;
}

interface Props {
  brick: Brick;
  briefExpanded?: boolean;

  moveNext(): void;
  mode?: PlayMode;
  onHighlight?(name: BrickFieldNames, value: string): void;
}

const NewPrepPage: React.FC<Props> = ({ brick, ...props }) => {
  const [state, setState] = React.useState({
    prepExpanded: true,
    isStopped: false,
    briefExpanded: false,
    duration: null,
  } as IntroductionState);

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

  const toggleBrief = () => {
    setState({ ...state, briefExpanded: !state.briefExpanded });
  };

  const togglePrep = () => {
    if (state.prepExpanded) {
      setState({
        ...state,
        isStopped: true,
        briefExpanded: true,
        prepExpanded: false,
      });
    } else {
      setState({
        ...state,
        isStopped: false,
        briefExpanded: false,
        prepExpanded: true,
      });
    }
  };

  const renderBriefTitle = () => {
    return (
      <div className="expand-title brief-title" style={{ marginTop: '4vh' }}>
        <span>Brief</span>
        <div className="centered text-white" onClick={toggleBrief}>
          <div className={state.briefExpanded ? "round-icon b-green" : "round-icon b-yellow"}>
            <SpriteIcon name="arrow-down" className="arrow" />
          </div>
          {!state.briefExpanded && <span className="italic">Click to expand</span>}
        </div>
      </div>
    );
  };

  const renderPrepTitle = () => {
    return (
      <div className="expand-title prep-title">
        <span>Prep</span>
        <div className="centered text-white" onClick={togglePrep}>
          <div className={state.prepExpanded ? "round-icon b-green" : "round-icon b-yellow"}>
            <SpriteIcon name="arrow-down" className="arrow" />
          </div>
        </div>
      </div>
    );
  };

  const renderBriefExpandText = () => {
    if (state.briefExpanded) {
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
    }
    return "";
  };

  const renderPrepExpandText = () => {
    if (state.prepExpanded) {
      return (
        <div className="expanded-text prep-box">
          <HighlightQuoteHtml
            value={brick.prep}
            mode={props.mode}
            onHighlight={value => {
              if (props.onHighlight) {
                props.onHighlight(BrickFieldNames.prep, value)
              }
            }}
          />
        </div>
      );
    }
    return "";
  };

  const minutes = getPrepareTime(brick.brickLength);

  return (
    <div className="brick-row-container live-container">
      <div className="fixed-upper-b-title"><BrickTitle title={brick.title} /></div>
      <div className="brick-container play-preview-panel live-page play-brief-page new-prep-page">
        <div className="introduction-page">
          <div className="scrollable">
            <div>
              <div className="open-question">
                <MathInHtml value={brick.openQuestion} />
              </div>
              <div className="introduction-content">
                {renderBriefTitle()}
                {renderBriefExpandText()}
                {renderPrepTitle()}
                {renderPrepExpandText()}
              </div>
            </div>
            <div className="new-layout-footer" style={{ display: 'none' }}>
              <div className="time-container">
                <TimeProgressbarV2 isIntro={true} setEndTime={() => { }} minutes={minutes} onEnd={() => { }} brickLength={brick.brickLength} />
              </div>
              <div className="footer-space" />
              <div className="new-navigation-buttons">
                <div className="n-btn next" onClick={props.moveNext}>
                  Investigation
                  <SpriteIcon name="arrow-right" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPrepPage;
