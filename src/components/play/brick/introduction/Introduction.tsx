import React from 'react';
import { Grid, Fab, FormControlLabel } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

import './Introduction.scss';
import { Brick } from 'model/brick';
import { useHistory } from 'react-router-dom';

interface IntroductionProps {
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
  }

  const togglePrep = () => {
    setState({ ...state, prepExpanded: !state.prepExpanded });
  }

  const toggleOther = () => {
    setState({ ...state, otherExpanded: !state.otherExpanded });
  }

  const startBrick = () => {
    history.push(`/play/brick/${brick.id}/live`);
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
        <div className='introduction-page'>
          <div>
            <h3>{length} minutes</h3>
            <h1>{brick.title}</h1>
          </div>
          <ExpansionPanel expanded={state.briefExpanded === true} onChange={toggleBrief}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <h2>Brief</h2>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>{brick.brief}</Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel expanded={state.prepExpanded === true} onChange={togglePrep}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <h2>Prep</h2>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>{brick.prep}</Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <div className="begin-row">
            <FormControlLabel
              className="start-brick-button"
              labelPlacement="start"
              control={
                <Fab style={{ background: '#0076B4' }} color="secondary" aria-label="add" onClick={startBrick}>
                  <PlayArrowIcon />
                </Fab>
              }
              label="Begin Brick"
            />
          </div>
          <ExpansionPanel expanded={state.otherExpanded === true} onChange={toggleOther}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <h2>Other Information</h2>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>{brick.brief}</Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      </div>
    </Grid>
  );
}

export default Introduction;
