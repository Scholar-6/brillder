import React from "react";
import { useEffect } from "react";
import queryString from 'query-string';
import { isMobile } from "react-device-detect";

import { Brick } from "model/brick";
import { rightKeyPressed } from "components/services/key";
import { isPhone } from "services/phone";
import { BrickFieldNames } from 'components/build/proposal/model';
import { PlayMode } from "../model";
import { getPrepareTime } from "../services/playTimes";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import MathInHtml from "../baseComponents/MathInHtml";
import HighlightHtml from "../baseComponents/HighlightHtml";
import BrickTitle from "components/baseComponents/BrickTitle";
import TimeProgressbar from "../baseComponents/timeProgressbar/TimeProgressbar";
import MusicWrapper from "components/baseComponents/MusicWrapper";

export interface IntroductionState {
  isStopped: boolean;
  prepExpanded: boolean;
  briefExpanded: boolean;
  duration: any;
}

interface Props {
  brick: Brick;
  briefExpanded?: boolean;
  history: any;

  endTime: any;
  setEndTime(t: any): void;

  moveNext(isResume: boolean): void;
  mode?: PlayMode;
  onHighlight?(name: BrickFieldNames, value: string): void;
}

const NewPrepPage: React.FC<Props> = ({ brick, ...props }) => {
  let initResume = false;
  const values = queryString.parse(props.history.location.search)
  if (values.resume) {
    initResume = true;
  }

  const [isResume] = React.useState(initResume);
  const [timerHidden, hideTimer] = React.useState(false);

  const [state, setState] = React.useState({
    prepExpanded: true,
    isStopped: false,
    briefExpanded: false,
    duration: null,
  } as IntroductionState);

  useEffect(() => {
    function handleMove(e: any) {
      if (rightKeyPressed(e)) {
        props.moveNext(isResume);
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
          <HighlightHtml
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
                {!timerHidden &&
                  <TimeProgressbar
                    isIntro={true}
                    onEnd={() => { }}
                    minutes={minutes}
                    endTime={props.endTime}
                    brickLength={brick.brickLength}
                    setEndTime={props.setEndTime}
                  />
                }
              </div>
              <div className="footer-space">
                {!isMobile &&
                  <div className="btn toggle-timer" onClick={() => hideTimer(!timerHidden)}>
                    {timerHidden ? 'Show Timer' : 'Hide Timer'}
                  </div>}
              </div>
              <div className="new-navigation-buttons">
                <div className="n-btn next" onClick={() => props.moveNext(isResume)}>
                  {isResume ? 'Resume' : 'Investigation'}
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
