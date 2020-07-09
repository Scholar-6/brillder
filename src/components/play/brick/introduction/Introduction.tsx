import React from "react";
import { useHistory } from "react-router-dom";
import { Grid, Hidden } from "@material-ui/core";
import sprite from "../../../../assets/img/icons-sprite.svg";

import "./Introduction.scss";
import { Brick, BrickLengthEnum } from "model/brick";
import MathInHtml from "components/play/brick/baseComponents/MathInHtml";
import TimerWithClock from "../baseComponents/TimerWithClock";
import { Moment } from "moment";
import PrepareText from './PrepareText';
import IntroductionDetails from "./IntroductionDetails";
import YoutubeAndMathInHtml from "components/play/brick/baseComponents/YoutubeAndMath";
const moment = require("moment");

interface IntroductionProps {
  isPlayPreview?: boolean;
  startTime?: Moment;
  brick: Brick;
  setStartTime(startTime: any): void;
}

interface IntroductionState {
  isStopped: boolean;
  prepExpanded: boolean;
  briefExpanded: boolean;
  otherExpanded: boolean;
  duration: any;
}

const IntroductionPage: React.FC<IntroductionProps> = ({ brick, ...props }) => {
  const history = useHistory();
  const [state, setState] = React.useState({
    prepExpanded: false,
    isStopped: false,
    briefExpanded: true,
    otherExpanded: false,
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
        prepExpanded: !state.prepExpanded,
      });
    }
  };

  const startBrick = () => {
    if (!props.startTime) {
      props.setStartTime(moment());
    } else if (state.isStopped && state.duration) {
      let time = moment().subtract(state.duration);
      props.setStartTime(time);
    }
    if (props.isPlayPreview) {
      history.push(`/play-preview/brick/${brick.id}/live`);
    } else {
      history.push(`/play/brick/${brick.id}/live`);
    }
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

  const renderPlayButton = () => {
    return (
      <div className="action-footer">
        <div>&nbsp;</div>
        <div className="direction-info">
          <h3>Ready?</h3>
          <h2>Play Brick</h2>
        </div>
        <div>
          <button
            type="button"
            className={state.prepExpanded ? "play-preview svgOnHover play-green": "play-preview svgOnHover play-gray"}
            onClick={startBrick}
          >
            <svg className="svg svg-default m-l-02">
              <use href={sprite + "#play-thin"} />
            </svg>
            <svg className="svg colored m-l-02">
              <use href={sprite + "#play-thick"} />
            </svg>
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
            <use
              href={
                state.briefExpanded
                  ? sprite + "#arrow-down"
                  : sprite + "#arrow-right"
              }
              className="text-theme-dark-blue"
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
            <use
              href={
                state.prepExpanded
                  ? sprite + "#arrow-down"
                  : sprite + "#arrow-right"
              }
              className="text-theme-dark-blue"
            />
          </svg>
        </div>
        {!state.prepExpanded ? (
          <span className="help-prep">
            Expand to start the timer. Aim to spend around {timeToSpend} minutes
            on this section.
          </span>
        ) : (
          ""
        )}
      </div>
    );
  };

  const renderBriefExpandText = () => {
    if (state.briefExpanded) {
      return (
        <div className="expanded-text">
          <MathInHtml value={brick.brief} />
        </div>
      );
    }
    return "";
  };

  const renderPrepExpandText = () => {
    if (state.prepExpanded) {
      return (
        <div className="expanded-text">
          <YoutubeAndMathInHtml value={brick.prep} />
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
          </Hidden>
          <div className="left-brick-circle">
            <div
              className="round-button"
              style={{ background: `${color}` }}
            ></div>
          </div>
          <h1>{brick.title}</h1>
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
              {renderBriefTitle()}
              {renderBriefExpandText()}
              {renderPrepTitle()}
              {renderPrepExpandText()}
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

            {!state.prepExpanded ? (
              <IntroductionDetails brickLength={brick.brickLength} />
            ) : (
              ""
            )}
            {renderPlayButton()}
          </div>
          {renderBriefTitle()}
          {renderBriefExpandText()}
          {renderPrepTitle()}
          {renderPrepExpandText()}
        </div>
      </Hidden>
    </div>
  );
};

export default IntroductionPage;
