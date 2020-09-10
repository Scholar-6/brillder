import React from "react";
import { Grid, Hidden } from "@material-ui/core";
import { CircularProgressbar } from "react-circular-progressbar";

import "./Ending.scss";
import { Brick } from "model/brick";
import { PlayStatus } from "../model";
import { BrickAttempt } from "../model";
import EndingStepper from './EndingStepper';
import sprite from "assets/img/icons-sprite.svg";
import Clock from "../baseComponents/Clock";
import { getPlayPath, getAssignQueryString } from "../service";
import { useLocation } from "react-router-dom";

interface EndingProps {
  status: PlayStatus;
  brick: Brick;
  history: any;
  brickAttempt: BrickAttempt;
  saveAttempt(): void;
}

const EndingPage: React.FC<EndingProps> = ({
  status,
  brick,
  brickAttempt,
  history,
  saveAttempt,
}) => {
  const attempts = brickAttempt.answers;
  const location = useLocation();
  const [minCurrentScore, setMinScore] = React.useState(0);
  const [maxCurrentScore, setMaxScore] = React.useState(0);
  const [currentScore, setCurrentScore] = React.useState(0);

  const playPath = getPlayPath(false, brick.id);

  if (status === PlayStatus.Live) {
    history.push(`${playPath}/intro${getAssignQueryString(location)}`);
  }

  const endBrick = () => saveAttempt();

  const oldScore = brickAttempt.oldScore ? brickAttempt.oldScore : 0;
  const { score, maxScore } = brickAttempt;
  const currentPScore = Math.round(((score + oldScore) * 50) / maxScore);
  const minPScore = Math.round((oldScore * 100) / maxScore);
  const maxPScore = Math.round((score * 100) / maxScore);

  setTimeout(() => {
    setMinScore((oldScore * 100) / maxScore);
    setMaxScore((score * 100) / maxScore);
    setCurrentScore(Math.round((oldScore + score) * 50 / maxScore));
  }, 400);

  const renderProgressBars = () => {
    return (
      <div className="question-live-play">
        <Grid
          container
          justify="center"
          alignContent="center"
          className="circle-progress-container"
        >
          <CircularProgressbar
            className="circle-progress-first"
            strokeWidth={4}
            counterClockwise={true}
            value={minCurrentScore}
          />
          <Grid
            container
            justify="center"
            alignContent="center"
            className="score-circle"
          >
            <CircularProgressbar
              className="circle-progress-second"
              counterClockwise={true}
              strokeWidth={4}
              value={maxCurrentScore}
            />
          </Grid>
          <Grid
            container
            justify="center"
            alignContent="center"
            className="score-circle"
          >
            <CircularProgressbar
              className="circle-progress-third"
              counterClockwise={true}
              strokeWidth={4}
              value={currentScore}
            />
          </Grid>
          <Grid
            container
            justify="center"
            alignContent="center"
            className="score-circle"
          >
            <div>
              <div className="score-precentage">{currentPScore}%</div>
              <div className="score-number">{oldScore}/{maxScore}</div>
              <div className="score-number">{score}/{maxScore}</div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }

  const renderFooter = () => {
    return (
      <div className="action-footer">
        <div></div>
        <div className="direction-info">
          <h2>Summary</h2>
        </div>
        <div>
          <button
            type="button"
            className="play-preview svgOnHover play-green"
            onClick={endBrick}
          >
            <svg className="svg w80 h80 active m-l-02">
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#arrow-right"} />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Hidden only={['xs']}>
        <div className="brick-container play-preview-panel ending-page">
          <Grid container direction="row">
            <Grid item xs={8}>
              <div className="introduction-page">
                <h1 className="title">Final Score : Agg.</h1>
                {renderProgressBars()}
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="introduction-info">
                <div className="intro-header">
                  <div>Range: {minPScore}%-{maxPScore}%</div>
                  <Clock brickLength={brick.brickLength} />
                </div>
                <div className="intro-text-row">
                  <EndingStepper
                    questions={brick.questions}
                    attempts={attempts}
                    handleStep={() => { }}
                  />
                </div>
                {renderFooter()}
              </div>
            </Grid>
          </Grid>
        </div>
      </Hidden>
      <Hidden only={['sm', 'md', 'lg', 'xl']}>
        <div className="brick-container play-preview-panel ending-page mobile-ending-page">
          <div className="introduction-info">
            <div className="intro-text-row">
              <span className="heading">Final Score : Agg.</span>
              <EndingStepper
                questions={brick.questions}
                attempts={attempts}
                handleStep={() => { }}
              />
            </div>
          </div>
          <div className="introduction-page">
            {renderProgressBars()}
          </div>
          {renderFooter()}
        </div>
      </Hidden>
    </div>
  );
};

export default EndingPage;
