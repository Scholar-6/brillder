import React from "react";
import { useHistory } from "react-router-dom";
import { Grid } from "@material-ui/core";
import sprite from "../../../../assets/img/icons-sprite.svg";

import "./Introduction.scss";
import { Brick, BrickLengthEnum } from "model/brick";
import MathInHtml from "components/play/brick/baseComponents/MathInHtml";
import TimerWithClock from "../baseComponents/TimerWithClock";
import { Moment } from "moment";
import IntroductionDetails from './IntroductionDetails';
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
      setState({ ...state, isStopped: true, prepExpanded: !state.prepExpanded });
    } else {
      setState({ ...state, isStopped: false, prepExpanded: !state.prepExpanded });
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
  }

  return (
    <div className="brick-container">
      <Grid container direction="row">
        <Grid item xs={8}>
          <div className="introduction-page">
            <div className="intro-header">
              <div className="left-brick-circle">
                <div
                  className="round-button"
                  style={{ background: `${color}` }}
                ></div>
              </div>
              <h1>{brick.title}</h1>
            </div>
            <div className="expend-title">
              Brief
            <img
                alt=""
                src={
                  state.briefExpanded
                    ? "/feathericons/svg/chevron-down-blue.svg"
                    : "/feathericons/svg/chevron-right.svg"
                }
                onClick={toggleBrief}
              />
            </div>
            {state.briefExpanded ? (
              <div className="expended-text">
                <MathInHtml value={brick.brief} />
              </div>
            ) : (
                ""
              )}
            <Grid container className="expend-title">
              <Grid className="title">Prep</Grid>
              <Grid>
                <Grid className="image" container alignContent="center">
                  <img
                    alt=""
                    src={
                      state.prepExpanded
                        ? "/feathericons/svg/chevron-down-blue.svg"
                        : "/feathericons/svg/chevron-right.svg"
                    }
                    onClick={togglePrep}
                  />
                </Grid>
              </Grid>
              <Grid className="help-prep">
                <Grid className="help-prep" container alignContent="center">
                  Expand to start the timer. Aim to spend around {timeToSpend} minutes on this section.
              </Grid>
              </Grid>
            </Grid>
            {state.prepExpanded ? (
              <div className="expended-text">
                <MathInHtml value={brick.prep} />
              </div>
            ) : (
                ""
              )}
          </div>
        </Grid>
        <Grid item xs={4}>
          <div className="introduction-info">
            <TimerWithClock
              isIntroPage={true}
              isStopped={state.isStopped}
              startTime={props.startTime}
              brickLength={brick.brickLength}
              onStop={(duration) => setDuration(duration)}
            />
            <IntroductionDetails brickLength={brick.brickLength} />
            <div className="action-footer">
              <div>&nbsp;</div>
              <div className="direction-info">
                <h3>Ready?</h3>
                <h2>Play Brick</h2>
              </div>
              <div>
                <button type="button" className="play-preview svgOnHover play-green" onClick={startBrick}>
                  <svg className="svg svg-default m-l-02">
                    <use href={sprite + "#play-thin"} />
                  </svg>
                  <svg className="svg colored m-l-02">
                    <use href={sprite + "#play-thick"} />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default IntroductionPage;
