import React from "react";
import { Grid, Hidden } from "@material-ui/core";
import sprite from "assets/img/icons-sprite.svg";
import { isMobile } from "react-device-detect";

import "./Introduction.scss";
import { Brick, BrickLengthEnum } from "model/brick";
import TimerWithClock from "../baseComponents/TimerWithClock";
import { Moment } from "moment";
import PrepareText from './PrepareText';
import IntroductionDetails from "./IntroductionDetails";
import PrepExpandedDialog from 'components/baseComponents/prepExpandedDialog/PrepExpandedDialog'
import { PlayMode } from "../model";
import HighlightHtml from '../baseComponents/HighlightHtml';
import { BrickFieldNames } from 'components/proposal/model';
import queryString from 'query-string';
import SpriteIcon from "components/baseComponents/SpriteIcon";

const moment = require("moment");


interface IntroductionProps {
  isPlayPreview?: boolean;
  startTime?: Moment;
  brick: Brick;
  location: any;

  setStartTime(startTime: any): void;
  moveNext(): void;

  // only real play
  mode?: PlayMode;
  onHighlight?(name: BrickFieldNames, value: string): void;
}

interface IntroductionState {
  isStopped: boolean;
  prepExpanded: boolean;
  briefExpanded: boolean;
  otherExpanded: boolean;
  isPrepDialogOpen: boolean;
  duration: any;
}

const IntroductionPage: React.FC<IntroductionProps> = ({ brick, ...props }) => {
  const values = queryString.parse(props.location.search);
  let initPrepExpanded = false;
  let resume = false;
  if (values.prepExtanded === 'true') {
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
    isPrepDialogOpen: false,
    duration: null,
  } as IntroductionState);

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
        isPrepDialogOpen: false,
        prepExpanded: !state.prepExpanded,
      });
    }
  };

  const startBrick = () => {
    if (!state.prepExpanded) {
      setState({ ...state, isPrepDialogOpen: true });
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
        <div className="direction-info">
          <h2>Resume</h2>
        </div>
      );
    }
    return (
      <div className="direction-info">
        <h3>Ready?</h3>
        <h2>Play Brick</h2>
      </div>
    );
  }

  const renderPlayButton = () => {
    return (
      <div className="action-footer">
        <div></div>
        <Hidden only={["xs"]}>
          {renderDesktopPlayText()}
        </Hidden>
        <div>
          <button
            type="button"
            className={state.prepExpanded ? "play-preview svgOnHover play-green" : "play-preview svgOnHover play-gray"}
            onClick={startBrick}
          >
            <SpriteIcon name="play-thin" className="w80 h80 svg-default" />
            <SpriteIcon name="play-thick" className="w80 h80 colored" />
          </button>
        </div>
      </div>
    );
  };

  const renderBriefTitle = () => {
    return (
      <div className="expand-title">
        <span>Brief</span>
        <div className="arrow svgOnHover" onClick={toggleBrief}>
          <svg className="svg w100 h100 active">
            {/*eslint-disable-next-line*/}
            <use
              href={
                state.briefExpanded
                  ? sprite + "#arrow-down"
                  : sprite + "#arrow-right"
              }
              className="text-theme-orange"
            />
          </svg>
        </div>
      </div>
    );
  };

  const renderPrepTitle = () => {
    return (
      <div className="expand-title">
        <span>Prep</span>
        <div className="arrow svgOnHover" onClick={togglePrep}>
          <svg className="svg w100 h100 active">
            {/*eslint-disable-next-line*/}
            <use
              href={
                state.prepExpanded
                  ? sprite + "#arrow-down"
                  : sprite + "#arrow-right"
              }
              className="text-theme-orange"
            />
          </svg>
        </div>
        {!state.prepExpanded && !isMobile &&
          <em className="help-prep">
            Expand to start the timer. Aim to spend around {timeToSpend} minutes
            on this section.
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

  const renderHeader = () => {
    return (
      <div className="intro-header">
        <Hidden only={["sm", "md", "lg", "xl"]}>
          {renderTimer()}
        </Hidden>
        <div className="left-brick-circle">
          <div
            className="round-button"
            style={{ background: `${color}` }}
          ></div>
        </div>
        <h1>{brick.title}</h1>
      </div>
    );
  };

  const renderMobileHeader = () => {
    if (state.prepExpanded) {
      return (
        <div className="intro-header expanded-intro-header">
          <Hidden only={["sm", "md", "lg", "xl"]}>
            {renderTimer()}
            <div className="flex f-align-center">
              <div className="left-brick-circle">
                <div
                  className="round-button"
                  style={{ background: `${color}` }}></div>
              </div>
              <h1>{brick.title}</h1>
            </div>
          </Hidden>
          <Hidden only={["xs"]}>
            <div className="left-brick-circle">
              <div className="round-button" style={{ background: `${color}` }}></div>
            </div>
            <h1>{brick.title}</h1>
          </Hidden>
          <p><PrepareText brickLength={brick.brickLength} /></p>
        </div>
      );
    }
    return renderHeader();
  };

  return (
    <div className="brick-container">
      <Hidden only={["xs"]}>
        <Grid container direction="row">
          <Grid item sm={8} xs={12}>
            <div className="introduction-page">
              {renderHeader()}
              <div className="intro-content">
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
            {!state.prepExpanded &&
              <div>
                <Hidden only={["sm", "md", "lg", "xl"]}>
                  {renderTimer()}
                </Hidden>
                <IntroductionDetails brickLength={brick.brickLength} />
              </div>
            }
            {renderPlayButton()}
          </div>
          <div className="intro-content">
            {renderBriefTitle()}
            {renderBriefExpandText()}
            {renderPrepTitle()}
            {renderPrepExpandText()}
          </div>
        </div>
      </Hidden>
      <PrepExpandedDialog
        isOpen={state.isPrepDialogOpen}
        close={() => setState({ ...state, isPrepDialogOpen: false })}
        onSubmit={() => togglePrep()}
      />
    </div>
  );
};

export default IntroductionPage;
