import React from 'react';
import { Grid, Fab, FormControlLabel } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import CircularProgress from '@material-ui/core/CircularProgress';

import './ProvisionalScore.scss';
import { Brick } from 'model/brick';
import { useHistory } from 'react-router-dom';
import OtherInformation from '../baseComponents/OtherInformation';
import { PlayStatus } from '../model/model';


interface ProvisionalScoreProps {
  status: PlayStatus;
  brick: Brick;
  attempts: any[];
}

interface ProvisionalState {
  otherExpanded: boolean;
}

const ProvisionalScore: React.FC<ProvisionalScoreProps> = ({ status, brick, attempts }) => {
  const history = useHistory();
  if (status === PlayStatus.Live) {
    history.push(`/play/brick/${brick.id}/intro`);
  }

  const [state, setState] = React.useState({
    otherExpanded: false,
  } as ProvisionalState);

  const toggleOther = () => {
    setState({ ...state, otherExpanded: !state.otherExpanded });
  }

  const startBrick = () => {
    history.push(`/play/brick/${brick.id}/synthesis`);
  }

  let score = attempts.reduce((acc, answer) => acc + answer.marks, 0);
  let maxScore = attempts.reduce((acc, answer) => acc + answer.maxMarks, 0);

  return (
    <Grid container direction="row" justify="center">
      <div className="brick-container">
        <div className='provisional-score-page'>
          <div>
            <h3>{brick.brickLength} minutes</h3>
            <h1>Provisional Score</h1>
          </div>
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
          <div className="begin-row">
            <FormControlLabel
              className="start-brick-button"
              labelPlacement="start"
              control={
                <Fab style={{ background: '#0076B4' }} color="secondary" aria-label="add" onClick={startBrick}>
                  <PlayArrowIcon />
                </Fab>
              }
              label="Summary"
            />
          </div>
          <OtherInformation
            creator={`${brick.author.firstName} ${brick.author.lastName}`}
            expanded={state.otherExpanded}
            toggle={toggleOther}
            totalUsers={0}
            averageScore={0}
            highScore={0}/>
        </div>
      </div>
    </Grid>
  );
}

export default ProvisionalScore;
