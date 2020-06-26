import React from 'react';
import { Grid } from '@material-ui/core';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import './ProvisionalScore.scss';
import { Brick } from 'model/brick';
import { useHistory } from 'react-router-dom';
import { PlayStatus } from '../model/model';
import TimerWithClock from "../baseComponents/TimerWithClock";
import { Moment } from 'moment';
import sprite from "../../../../assets/img/icons-sprite.svg";
import ReviewStepper from '../review/ReviewStepper';


interface ProvisionalScoreProps {
  isPlayPreview?: boolean;
  status: PlayStatus;
  brick: Brick;
  startTime?: Moment;
  attempts: any[];
}


const ProvisionalScore: React.FC<ProvisionalScoreProps> = ({ status, brick, attempts, ...props }) => {
  const history = useHistory();
  const [value, setValue] = React.useState(0);
  if (status === PlayStatus.Live) {
    if (props.isPlayPreview) {
      history.push(`/play-preview/brick/${brick.id}/intro`);
    } else {
      history.push(`/play/brick/${brick.id}/intro`);
    }
  }

  const startBrick = () => {
    if (props.isPlayPreview) {
      history.push(`/play-preview/brick/${brick.id}/synthesis`);
    } else {
      history.push(`/play/brick/${brick.id}/synthesis`);
    }
  }

  let score = attempts.reduce((acc, answer) => {
    if (!answer || !answer.marks) {
      return acc + 0;
    }
    return acc + answer.marks;
  }, 0);
  let maxScore = attempts.reduce((acc, answer) => {
    if (!answer.maxMarks) {
      return acc + 5;
    }
    return acc + answer.maxMarks;
  }, 0);

  // animate react progress bar by changing value form 0 to value
  setTimeout(() => setValue((score * 100) / maxScore), 400);

  return (
    <div className="brick-container provisional-score-page">
      <Grid container direction="row">
        <Grid item xs={8}>
          <div className="introduction-page">
            <div className="question-index-container">
              <div className="question-index">P</div>
            </div>
            <h1>Provisional Score</h1>
            <Grid container justify="center" className="circle-progress-container">
              <CircularProgressbar className="circle-progress" strokeWidth={4} counterClockwise={true} value={value} />
              <div className="score-data">
                <Grid container justify="center" alignContent="center">
                  <div>
                    <div className="score-precentage">{Math.round((score * 100) / maxScore)}%</div>
                    <div className="score-number">{score}/{maxScore}</div>
                  </div>
                </Grid>
              </div>
            </Grid>
          </div>
        </Grid>
        <Grid item xs={4}>
          <div className="introduction-info">
            <TimerWithClock startTime={props.startTime} brickLength={brick.brickLength} />
            <div className="intro-text-row">
            <ReviewStepper
              questions={brick.questions}
              attempts={attempts}
              handleStep={() => {}}
            />
            </div>
            <div className="action-footer">
              <div>&nbsp;</div>
              <div className="direction-info">
                <h2>Synthesis</h2>
              </div>
              <div>
                <button type="button" className="play-preview svgOnHover play-green" onClick={startBrick}>
                  <svg className="svg active m-l-02">
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
}

export default ProvisionalScore;
