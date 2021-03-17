import React from "react";
import { Grid, Hidden } from "@material-ui/core";
import { Moment } from "moment";
import queryString from 'query-string';
import { isMobile } from 'react-device-detect';

import { AcademicLevelLabels, Brick, BrickLengthEnum } from "model/brick";
import { PlayMode } from "../model";
import { BrickFieldNames } from 'components/build/proposal/model';

import TimerWithClock from "../baseComponents/TimerWithClock";
import HighlightHtml from '../baseComponents/HighlightHtml';
import IntroductionDetails from "./IntroductionDetails";
import PrepareText from './PrepareText';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import MathInHtml from "../baseComponents/MathInHtml";
import { useEffect } from "react";
import { rightKeyPressed } from "components/services/key";
import HighlightQuoteHtml from "../baseComponents/HighlightQuoteHtml";
import { isPhone } from "services/phone";
import TimeProgressbarV2 from "../baseComponents/timeProgressbar/TimeProgressbarV2";

const moment = require("moment");
interface IntroductionProps {
  isPlayPreview?: boolean;
  startTime?: Moment;
  brick: Brick;
  location: any;
  history: any;

  setStartTime(startTime: any): void;
  moveNext(): void;

  // only real play
  mode?: PlayMode;
  onHighlight?(name: BrickFieldNames, value: string): void;
}

export interface IntroductionState {
  isStopped: boolean;
  prepExpanded: boolean;
  briefExpanded: boolean;
  otherExpanded: boolean;
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
    otherExpanded: false,
    duration: null,
  } as IntroductionState);

  useEffect(() => {
    function handleMove(e: any) {
      if (rightKeyPressed(e)) {
        startBrick();
      }
    }

    document.addEventListener("keydown", handleMove, false);

    return function cleanup() {
      document.removeEventListener("keydown", handleMove, false);
    };
  });

  const toggleBrief = () => {
    setState({ ...state, briefExpanded: !state.briefExpanded });
  };

  const togglePrep = () => {
    if (!props.startTime) {
      props.setStartTime(moment());
    }

    if (!state.prepExpanded && state.duration) {
      let time = moment().subtract(state.duration);
      props.setStartTime(time);
    }

    // phone has diferent logic.
    if (isPhone()) {
      if (state.prepExpanded) {
        setState({
          ...state,
          isStopped: true,
          briefExpanded: true,
          prepExpanded: !state.prepExpanded,
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
          prepExpanded: !state.prepExpanded,
        });
      }
      return;
    }

    if (state.prepExpanded) {
      setState({
        ...state,
        isStopped: true,
        prepExpanded: !state.prepExpanded,
      });
    } else {
      setState({
        ...state,
        isStopped: false,
        prepExpanded: !state.prepExpanded,
      });
    }
  };

  const startBrick = () => {
    if (!state.prepExpanded) {
      togglePrep();
      return;
    }
    if (!props.startTime) {
      props.setStartTime(moment());
    } else if (state.isStopped && state.duration) {
      let time = moment().subtract(state.duration);
      props.setStartTime(time);
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

  const setDuration = (duration: any) => {
    setState({ ...state, duration });
  };

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
        <h2>Play Brick</h2>
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

  const renderTimer = () => {
    return (
      <TimerWithClock
        isArrowUp={true}
        isStopped={state.isStopped}
        startTime={props.startTime}
        brickLength={brick.brickLength}
        onStop={(duration) => setDuration(duration)}
      />
    );
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
        <Hidden only={["sm", "md", "lg", "xl"]}>
          {renderBrickCircle(color)}
        </Hidden>
        <div className="intro-desktop-title">{brick.title}</div>
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
            <h1>{brick.title}</h1>
            <p><PrepareText brickLength={brick.brickLength} /></p>
          </div>
        </div>
      );
    }
    return renderHeader();
  };

  return (
    <div className="brick-row-container real-introduction-page">
      <div className="brick-container">
        <Hidden only={["xs"]}>
          <Grid container direction="row">
            <Grid item sm={8} xs={12}>
              {renderBrickCircle(color)}
              <div className="introduction-page">
                {renderHeader()}
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
            </Grid>
            <Grid item sm={4} xs={12}>
              <div className="introduction-info">
                {renderTimer()}
                <IntroductionDetails brickLength={brick.brickLength} />
                {renderPlayButton()}
              </div>
            </Grid>
          </Grid>
        </Hidden>
        <Hidden only={["sm", "md", "lg", "xl"]}>
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
                startTime={props.startTime}
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
        </Hidden>
      </div>
    </div>
  );
};

export default IntroductionPage;
