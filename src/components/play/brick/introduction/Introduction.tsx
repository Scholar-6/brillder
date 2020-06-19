import React from "react";
import { useHistory } from "react-router-dom";
import { Grid } from "@material-ui/core";
import sprite from "../../../../assets/img/icons-sprite.svg";

import "./Introduction.scss";
import { Brick } from "model/brick";
import MathInHtml from "components/play/brick/baseComponents/MathInHtml";
import BrickCounter from "../baseComponents/BrickCounter";
import { Moment } from "moment";
const moment = require("moment");

interface IntroductionProps {
  isPlayPreview?: boolean;
  startTime?: Moment;
  brick: Brick;
  setStartTime(startTime: any): void;
}

interface IntroductionState {
  prepExpanded: boolean;
  briefExpanded: boolean;
  otherExpanded: boolean;
}

const Introduction: React.FC<IntroductionProps> = ({ brick, ...props }) => {
  const history = useHistory();
  const [state, setState] = React.useState({
    prepExpanded: false,
    briefExpanded: true,
    otherExpanded: false,
  } as IntroductionState);

  const toggleBrief = () => {
    setState({ ...state, briefExpanded: !state.briefExpanded });
  };

  const togglePrep = () => {
    if (!props.startTime) {
      props.setStartTime(moment());
    }
    setState({ ...state, prepExpanded: !state.prepExpanded });
  };

  const startBrick = () => {
    if (!props.startTime) {
      props.setStartTime(moment());
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

  return (
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
          <div className="expend-title">
            Prep
            <img
              alt=""
              src={
                state.prepExpanded
                  ? "/feathericons/svg/chevron-down-blue.svg"
                  : "/feathericons/svg/chevron-right.svg"
              }
              onClick={togglePrep}
            />
          </div>
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
          <div className="intro-header">
            <BrickCounter isIntroPage={true} startTime={props.startTime} />
            <div className="clock">
              <div className="clock-image svgOnHover">
                <svg className="svg w100 h100 active">
                  <use href={sprite + "#clock"} />
                </svg>
              </div>
              <span className="max-length">{brick.brickLength}</span>
            </div>
          </div>
          <div className="intro-text-row">
            <p>Bricks are divided into four sections.</p>
            <ul>
              <li>Set aside around 5 minutes to prepare</li>
              <li>8 minutes for the investigation (countdown)</li>
              <li>Around 4 minutes to take in the Synthesis</li>
              <li>3 minutes to review answers (countdown)</li>
            </ul>
          </div>
          <Grid container direction="row" className="action-footer">
            <Grid container item xs={3}></Grid>
            <Grid container item xs={6} justify="center">
              <h2>Play</h2>
            </Grid>
            <Grid container item xs={3} justify="center">
              <button
                type="button"
                className="play-preview svgOnHover play-green"
                onClick={startBrick}
              >
                <svg className="svg svg-default m-l-02">
                  <use href={sprite + "#play-thin"} className="text-white" />
                </svg>
                <svg className="svg colored m-l-02">
                  <use href={sprite + "#play-thick"} className="text-white" />
                </svg>
              </button>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </Grid>
  );
};

export default Introduction;
