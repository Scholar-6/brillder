
import React from 'react';
import { Grid, Fab, FormControlLabel } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import CircularProgress from '@material-ui/core/CircularProgress';

import './Ending.scss';
import { Brick } from 'model/brick';
import { useHistory } from 'react-router-dom';
import OtherInformation from '../baseComponents/OtherInformation';
import { PlayStatus } from '../model/model';
import { BrickAttempt } from '../PlayBrickRouting';


interface EndingProps {
  status: PlayStatus;
  brick: Brick;
  brickAttempt: BrickAttempt;
}

interface EndingState {
  otherExpanded: boolean;
}

const EndingPage: React.FC<EndingProps> = ({ status, brick, brickAttempt }) => {
  const history = useHistory();
  if (status === PlayStatus.Live) {
    history.push(`/play/brick/${brick.id}/intro`);
  }

  const [state, setState] = React.useState({
    otherExpanded: false,
  } as EndingState);

  const toggleOther = () => {
    setState({ ...state, otherExpanded: !state.otherExpanded });
  }

  const endBrick = () => {
    history.push(`/play/dashboard`);
  }

  return (
    <Grid container direction="row" justify="center">
      <div className="brick-container">
        <div className='ending-page'>
          <div>
            <h3>{brick.brickLength} minutes</h3>
            <h1>{brick.title}</h1>
          </div>
          <Grid container justify="center" className="circle-progress-container">
            <CircularProgress
              variant="static"
              className="circle-progress"
              value={(brickAttempt.score * 100) / brickAttempt.maxScore} />
            <div className="score-data">
              <Grid container justify="center" alignContent="center">
                <div>
                  <div className="score-precentage">
                    {Math.round((brickAttempt.score * 100) / brickAttempt.maxScore)}%
                  </div>
                  <div className="score-number">{brickAttempt.score}/{brickAttempt.maxScore}</div>
                </div>
              </Grid>
            </div>
          </Grid>
          <div className="begin-row">
            <FormControlLabel
              className="start-brick-button"
              labelPlacement="start"
              control={
                <Fab style={{ background: '#0076B4' }} color="secondary" aria-label="add" onClick={endBrick}>
                  <PlayArrowIcon />
                </Fab>
              }
              label="Return to Dashboard"
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

export default EndingPage;
