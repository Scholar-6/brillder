import React, { useEffect } from "react";
import queryString from 'query-string';
import { isMobile } from 'react-device-detect';

import { AcademicLevelLabels, Brick, BrickLengthEnum } from "model/brick";
import { PlayMode } from "../model";
import { BrickFieldNames } from 'components/build/proposal/model';

import HighlightHtml from '../baseComponents/HighlightHtml';
import IntroductionDetails from "./IntroductionDetails";
import PrepareText from './PrepareText';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import HighlightQuoteHtml from "../baseComponents/HighlightQuoteHtml";
import { isPhone } from "services/phone";
import TimeProgressbarV2 from "../baseComponents/timeProgressbar/TimeProgressbarV2";
import BrickTitle from "components/baseComponents/BrickTitle";

interface IntroductionProps {
  isPlayPreview?: boolean;
  endTime?: string;
  brick: Brick;
  location: any;
  history: any;

  setEndTime(endTime: string): void;
  moveNext(): void;

  cashAttempt?(): void;

  // only real play
  mode?: PlayMode;
  onHighlight?(name: BrickFieldNames, value: string): void;
}

export interface IntroductionState {
  isStopped: boolean;
  prepExpanded: boolean;
  briefExpanded: boolean;
  duration: any;
}

const IntroductionPage: React.FC<IntroductionProps> = ({ brick, ...props }) => {
  let isPrep = props.location.pathname.slice(-5) === '/prep';
  const values = queryString.parse(props.location.search);
  let initPrepExpanded = false;
  let resume = false;
  if (values.prepExtanded === 'true' || isPrep) {
    initPrepExpanded = true;
  }
  if (values.resume === 'true') {
    resume = true;
  }
  const [state, setState] = React.useState({
    prepExpanded: initPrepExpanded,
    isStopped: false,
    briefExpanded: true,
    duration: null,
  } as IntroductionState);

  useEffect(() => {
    const interval = setInterval(() => {
      if (props.cashAttempt) {
        props.cashAttempt();
      }
    }, 1000);
    return () => clearInterval(interval);
  /*eslint-disable-next-line*/
  }, [props.endTime]);

  const toggleBrief = () => {
    setState({ ...state, briefExpanded: !state.briefExpanded });
  };

  const togglePrep = () => {
    // phone has diferent logic.
    if (isPhone()) {
      if (state.prepExpanded) {
        setState({
          ...state,
          isStopped: true,
          briefExpanded: true,
          prepExpanded: false,
        });
      } else {
        if (!isPrep) {
          // move to prep page
          props.history.push(`/play/brick/${brick.id}/prep`);
        }
        setState({
          ...state,
          isStopped: false,
          briefExpanded: false,
          prepExpanded: true,
        });
      }
      return;
    }

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

  const startBrick = () => {
    if (!state.prepExpanded) {
      togglePrep();
      return;
    }
    props.moveNext();
  };

  let color = "#B0B0AD";

  if (brick.subject) {
    color = brick.subject.color;
  }

  let timeToSpend = 5;
  if (brick.brickLength === BrickLengthEnum.S40min) {
    timeToSpend = 10;
  } else if (brick.brickLength === BrickLengthEnum.S60min) {
    timeToSpend = 15;
  }

  const renderDesktopPlayText = () => {
    if (resume) {
      return (
        <div>
          <h2>Resume</h2>
        </div>
      );
    }
    return (
      <div>
        <h3 className="ready-text">Ready?</h3>
        <h2>{state.prepExpanded ? 'Play Brick' : 'Start Prep'}</h2>
      </div>
    );
  }

  const renderPlayButton = () => {
    if (isPhone()) {
      return (
        <div className="action-footer mobile-footer-fixed-buttons">
          <SpriteIcon name={isPrep ? "arrow-right" : "play-thick"} className="mobile-next-button intro-mobile-next-button" onClick={startBrick} />
        </div>
      );
    }
    return (
      <div className="action-footer">
        <div></div>
        <div className="direction-info">
          {renderDesktopPlayText()}
        </div>
        <div>
          <button
            type="button"
            className={state.prepExpanded ? "play-preview svgOnHover play-green" : "play-preview svgOnHover play-gray"}
            onClick={startBrick}
          >
            <SpriteIcon name="play-thin" className="w80 h80 svg-default m-l-02" />
            <SpriteIcon name="play-thick" className="w80 h80 colored m-l-02" />
          </button>
        </div>
      </div>
    );
  };

  const renderMobileBriefTitle = () => {
    return (
      <div className="brief-title" style={{ marginTop: '4vh' }}>
        <span className="bold">Brief</span>
        <div className={state.briefExpanded ? "round-icon fill-green" : "round-icon fill-yellow"} onClick={toggleBrief}>
          <SpriteIcon name="circle-filled" className="circle" />
          <SpriteIcon name="arrow-down" className="arrow" />
        </div>
        {!state.briefExpanded && <span className="italic" onClick={toggleBrief}>Click to expand</span>}
      </div>
    );
  }

  const renderPrepTitle = () => {
    return (
      <div className="expand-title prep-title">
        <span>Prep</span>
        <div className="centered text-white" onClick={togglePrep}>
          <div className={state.prepExpanded ? "round-icon b-green" : "round-icon b-yellow"}>
            <SpriteIcon name="arrow-down" className="arrow" />
          </div>
        </div>
        {!state.prepExpanded && !isMobile &&
          <em className="help-prep">
            Expand to start the timer. Aim to spend around {timeToSpend} minutes on this section.
          </em>
        }
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

  const renderBrickCircle = (color: string) => {
    return (
      <div className="left-brick-circle">
        <div className="round-button" style={{ background: `${color}` }}>
          {brick.academicLevel && AcademicLevelLabels[brick.academicLevel]}
        </div>
      </div>
    );
  }

  const renderHeader = () => {
    return (
      <div className="intro-header">
        {renderBrickCircle(color)}
        <div className="intro-desktop-title">
          <BrickTitle title={brick.title} />
        </div>
      </div>
    );
  };

  const renderMobileHeader = () => {
    if (state.prepExpanded) {
      return (
        <div className="intro-header expanded-intro-header">
          <div className="vertical-center">
            {renderBrickCircle(color)}
          </div>
          <div className="r-title-container">
            <h1><BrickTitle title={brick.title} /></h1>
            <p><PrepareText brickLength={brick.brickLength} /></p>
          </div>
        </div>
      );
    }
    return renderHeader();
  };

  return (
    <div className={`brick-row-container real-introduction-page ${state.prepExpanded ? 'expanded' : ''}`}>
      <div className="brick-container">
        <div className="introduction-page">
          {renderMobileHeader()}
          <div className="introduction-info">
            {!state.prepExpanded ?
              <div>
                <IntroductionDetails brickLength={brick.brickLength} />
              </div>
              : <div className="time-container">
                <TimeProgressbarV2
                  isIntro={true}
                  onEnd={() => { }}
                  endTime={props.endTime}
                  setEndTime={props.setEndTime}
                  brickLength={brick.brickLength}
                />
              </div>}
            {renderPlayButton()}
          </div>
          <div className="introduction-content">
            {renderMobileBriefTitle()}
            {renderBriefExpandText()}
            {state.prepExpanded && renderPrepTitle()}
            {state.prepExpanded && renderPrepExpandText()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroductionPage;
