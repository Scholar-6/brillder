import React from 'react';
import { Grid, Hidden } from '@material-ui/core';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import './ProvisionalScore.scss';
import { Brick } from 'model/brick';
import { useHistory } from 'react-router-dom';
import { PlayStatus } from '../model/model';
import { Moment } from 'moment';
import sprite from "../../../../assets/img/icons-sprite.svg";
import ReviewStepper from '../review/ReviewStepper';
import Clock from '../baseComponents/Clock';


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
    if (!answer) {
      return acc;
    }
    if (!answer.maxMarks) {
      return acc + 5;
    }
    return acc + answer.maxMarks;
  }, 0);

  // animate react progress bar by changing value form 0 to value
  setTimeout(() => setValue((score * 100) / maxScore), 400);

  const renderProgressBar = () => {
    return (
      <div className="question-live-play">
        <Grid container justify="center" alignContent="center" className="circle-progress-container">
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
    );
  }

  const renderFooter = () => {
    return (
      <div className="action-footer">
        <div></div>
        <div className="direction-info">
          <h2>Synthesis</h2>
        </div>
        <div>
          <button type="button" className="play-preview svgOnHover play-green" onClick={startBrick}>
            <svg className="svg w80 h80 active m-l-02">
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#arrow-right"} />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  const renderStepper = () => {
    return (
      <ReviewStepper
        questions={brick.questions}
        attempts={attempts}
        handleStep={() => { }}
      />
    );
  }

  return (
    <div>
      <Hidden only={['xs']}>
        <div className="brick-container provisional-score-page">
          <Grid container direction="row">
            <Grid item xs={8}>
              <div className="introduction-page">
                <div className="question-index-container">
                  <div className="question-index">P</div>
                </div>
                <h1>Provisional Score</h1>
                {renderProgressBar()}
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="introduction-info">
                <div className="intro-header">
                  <Clock brickLength={brick.brickLength} />
                </div>
                <div className="intro-text-row">
                  <ReviewStepper
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
      <Hidden only={['sm', 'md', 'lg', 'xl',]}>
        <div className="brick-container provisional-score-page mobile-provisional-score">
          <div className="introduction-info">
            <div className="intro-text-row">
              <span className="heading">Provisional Score</span>
              {renderStepper()}
            </div>
          </div>
          <div className="introduction-page">
            {renderProgressBar()}
          </div>
          {renderFooter()}
        </div>
      </Hidden>
    </div>
  );
}

export default ProvisionalScore;
