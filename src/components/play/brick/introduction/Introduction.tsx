import React from "react";
import { useHistory } from "react-router-dom";
import { Grid } from "@material-ui/core";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import "./Introduction.scss";
import { Brick } from "model/brick";
import MathInHtml from "components/play/brick/baseComponents/MathInHtml";
import BrickCounter from "../baseComponents/BrickCounter";
import { Moment } from "moment";

interface IntroductionProps {
  isPlayPreview?: boolean;
  startTime?: Moment;
  brick: Brick;
}

interface IntroductionState {
  prepExpanded: boolean;
  briefExpanded: boolean;
  otherExpanded: boolean;
}

const Introduction: React.FC<IntroductionProps> = ({ brick, ...props }) => {
  const history = useHistory();
  const [state, setState] = React.useState({
    prepExpanded: true,
    briefExpanded: true,
    otherExpanded: false,
  } as IntroductionState);

  const toggleBrief = () => {
    setState({ ...state, briefExpanded: !state.briefExpanded });
  };

  const togglePrep = () => {
    setState({ ...state, prepExpanded: !state.prepExpanded });
  };

  const startBrick = () => {
    if (props.isPlayPreview) {
      history.push(`/play-preview/brick/${brick.id}/live`);
    } else {
      history.push(`/play/brick/${brick.id}/live`);
    }
  };

  return (
    <Grid container direction="row" justify="center">
      <div className="brick-container">
        <Grid container direction="row">
          <Grid item xs={8}>
            <div className="introduction-page">
              <div>
                <h1>{brick.title}</h1>
              </div>
              <ExpansionPanel
                expanded={state.briefExpanded === true}
                onChange={toggleBrief}
              >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <h2>Brief</h2>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <div style={{ width: "100%" }}>
                    <MathInHtml value={brick.brief} />
                  </div>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel
                expanded={state.prepExpanded === true}
                onChange={togglePrep}
              >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <h2>Prep</h2>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <div style={{ width: "100%" }}>
                    <MathInHtml value={brick.prep} />
                  </div>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className="introduction-info">
              <Grid container direction="row">
                <Grid item xs={8}>
                  <BrickCounter startTime={props.startTime} />
                </Grid>
                <Grid item xs={4}>
                  <img
                    alt=""
                    className="clock-image"
                    src="/feathericons/svg/blue-clock.svg"
                  />
                  <span className="max-length">{brick.brickLength}</span>
                </Grid>
              </Grid>
              <Grid container direction="row" className="intro-text-row">
                <div className="first-intro-row">
                  Bricks are divided into four sections.
                </div>
                <ul>
                  <li>Set aside around 5 minutes to prepare</li>
                  <li>8 minutes for the investigation (countdown)</li>
                  <li>Around 4 minutes to take in the Synthesis</li>
                  <li>3 minutes to review answers (countdown)</li>
                </ul>
              </Grid>
              <Grid container direction="row" alignContent="center">
                Play
                <button style={{ padding: "20px" }} onClick={startBrick}>
                  Play
                </button>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </div>
    </Grid>
  );
};

export default Introduction;
