import React from 'react';
import { Grid } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import './ProvisionalScore.scss';
import { Brick } from 'model/brick';
import { useHistory } from 'react-router-dom';
import { PlayStatus } from '../model/model';
import TimerWithClock from "../baseComponents/TimerWithClock";
import { Moment } from 'moment';
import sprite from "../../../../assets/img/icons-sprite.svg";


interface ProvisionalScoreProps {
  isPlayPreview?: boolean;
  status: PlayStatus;
  brick: Brick;
  startTime?: Moment;
  attempts: any[];
}

interface ProvisionalState {
  otherExpanded: boolean;
}

const ProvisionalScore: React.FC<ProvisionalScoreProps> = ({ status, brick, attempts, ...props }) => {
  const history = useHistory();
  if (status === PlayStatus.Live) {
    if (props.isPlayPreview) {
      history.push(`/play-preview/brick/${brick.id}/intro`);
    } else {
      history.push(`/play/brick/${brick.id}/intro`);
    }
  }

  const [state, setState] = React.useState({
    otherExpanded: false,
  } as ProvisionalState);

  const toggleOther = () => {
    setState({ ...state, otherExpanded: !state.otherExpanded });
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

  return (
    <div className="brick-container provisional-score-page">
      <Grid container direction="row">
        <Grid item xs={8}>
          <div className="introduction-page">
            <div className="p-icon">
              P
            </div>
            <h1 className="play-page-header">Provisional Score</h1>
            <Grid container justify="center" className="circle-progress-container">
              <CircularProgress variant="static" className="circle-progress" value={(score * 100) / maxScore} />
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
            <div className="action-footer">
              <div>&nbsp;</div>
              <div className="direction-info">
                <h2>Synthesis</h2>
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
}

export default ProvisionalScore;
