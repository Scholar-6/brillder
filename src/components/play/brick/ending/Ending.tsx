import React from "react";
import { Grid } from "@material-ui/core";
import { CircularProgressbar } from "react-circular-progressbar";

import "./Ending.scss";
import { Brick } from "model/brick";
import { useHistory } from "react-router-dom";
import { PlayStatus } from "../model/model";
import { BrickAttempt } from "../PlayBrickRouting";
import ReviewStepper from '../review/ReviewStepper';
import sprite from "../../../../assets/img/icons-sprite.svg";
import Clock from "../baseComponents/Clock";

interface EndingProps {
  status: PlayStatus;
  brick: Brick;
  brickAttempt: BrickAttempt;
  attempts: any[];
  saveBrick(): void;
}

const EndingPage: React.FC<EndingProps> = ({
  status,
  brick,
  brickAttempt,
  attempts,
  saveBrick,
}) => {
  const history = useHistory();
  const [minCurrentScore, setMinScore] = React.useState(0);
  const [maxCurrentScore, setMaxScore] = React.useState(0);
  const [currentScore, setCurrentScore] = React.useState(0);

  if (status === PlayStatus.Live) {
    history.push(`/play/brick/${brick.id}/intro`);
  }

  const endBrick = () => saveBrick();

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

  return (
    <div className="brick-container ending-page">
      <Grid container direction="row">
        <Grid item xs={8}>
          <div className="introduction-page">
            <div className="question-index-container">
              <div className="question-index">FS</div>
            </div>
            <h1>Final Score : Agg.</h1>
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
                    <div className="score-precentage">
                      {currentPScore}%
                  </div>
                    <div className="score-number">
                      {oldScore}/{maxScore}
                    </div>
                    <div className="score-number">
                      {score}/{maxScore}
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>
          </div>
        </Grid>
        <Grid item xs={4}>
          <div className="introduction-info">
            <div className="intro-header">
              <div>Range: {minPScore}%-{maxPScore}%</div>
              <Clock brickLength={brick.brickLength} />
            </div>
            <div className="intro-text-row">
              <ReviewStepper
                isEnd={true}
                questions={brick.questions}
                attempts={attempts}
                handleStep={() => { }}
              />
            </div>
            <div className="action-footer">
              <div>&nbsp;</div>
              <div className="direction-info">
                <h2>Summary</h2>
              </div>
              <div>
                <button
                  type="button"
                  className="play-preview svgOnHover play-green"
                  onClick={endBrick}
                >
                  <svg className="svg active m-l-02">
                    {/*eslint-disable-next-line*/}
                    <use href={sprite + "#arrow-right"} />
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

export default EndingPage;
