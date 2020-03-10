import React from 'react';
import { Grid, Fab, FormControlLabel } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import CircularProgress from '@material-ui/core/CircularProgress';

import './Synthesis.scss';
import { Brick } from 'model/brick';
import { useHistory } from 'react-router-dom';

interface ProvisionalScoreProps {
  brick: Brick;
}

interface ProvisionalState {
  prepExpanded: boolean;
  briefExpanded: boolean;
  otherExpanded: boolean;
}

const ProvisionalScore: React.FC<ProvisionalScoreProps> = ({ brick, ...props }) => {
  const history = useHistory();
  const [state, setState] = React.useState({
    otherExpanded: false,
  } as ProvisionalState);

  const toggleOther = () => {
    setState({ ...state, otherExpanded: !state.otherExpanded });
  }

  const startBrick = () => {
    history.push(`/play/brick/${brick.id}/synthesis`);
  }

  let length = 0;
  if (brick.brickLength === 1) {
    length = 20;
  } else if (brick.brickLength === 2) {
    length = 40;
  } else if (brick.brickLength === 3) {
    length = 60;
  }

  return (
    <Grid container direction="row" justify="center">
      <div className="brick-container">
        <div className='provisional-score-page'>
          <div>
            <h3>{length} minutes</h3>
            <h1>{brick.title}</h1>
          </div>
          <Grid container justify="center" className="circle-progress-container">
            <CircularProgress variant="static" className="circle-progress" value={50} />
            <div className="score-data">
              <Grid container justify="center" alignContent="center">
                <div>
                  <div className="score-precentage">50%</div>
                  <div className="score-number">5/10</div>
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
          <ExpansionPanel expanded={state.otherExpanded === true} onChange={toggleOther}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <h2 style={{fontSize: '15px'}}>Other Information</h2>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>{brick.preparationBrief}</Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      </div>
    </Grid>
  );
}

export default ProvisionalScore;
