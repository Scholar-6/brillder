import React from "react";
import { Grid } from "@material-ui/core";
import { CircularProgressbar } from "react-circular-progressbar";

import "./Ending.scss";
import { Brick } from "model/brick";
import { useHistory } from "react-router-dom";
import { PlayStatus } from "../model/model";
import { BrickAttempt } from "../PlayBrickRouting";
import sprite from "../../../../assets/img/icons-sprite.svg";

interface EndingProps {
  status: PlayStatus;
  brick: Brick;
  brickAttempt: BrickAttempt;
  saveBrick(): void;
}

const EndingPage: React.FC<EndingProps> = ({
  status,
  brick,
  brickAttempt,
  saveBrick,
}) => {
  const history = useHistory();
  if (status === PlayStatus.Live) {
    history.push(`/play/brick/${brick.id}/intro`);
  }

  const endBrick = () => saveBrick();

  return (
    <div className="brick-container ending-page">
      <Grid container direction="row">
        <Grid item xs={8}>
          <div className="introduction-page">
            <div className="question-index-container">
              <div className="question-index">FS</div>
            </div>
            <h1>Final Score : Agg.</h1>
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
                value={(brickAttempt.score * 100) / brickAttempt.maxScore}
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
                  value={(brickAttempt.score * 100) / brickAttempt.maxScore}
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
                  value={(brickAttempt.score * 100) / brickAttempt.maxScore}
                />
              </Grid>
              <div className="score-data">
                <Grid container justify="center" alignContent="center">
                  <div>
                    <div className="score-precentage">
                      {Math.round((brickAttempt.score * 100) / brickAttempt.maxScore)} %
                    </div>
                    <div className="score-number">
                      {brickAttempt.score}/{brickAttempt.maxScore}
                    </div>
                  </div>
                </Grid>
              </div>
            </Grid>
          </div>
        </Grid>
        <Grid item xs={4}>
          <div className="introduction-info">
            <div className="intro-text-row"></div>
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

export default EndingPage;
