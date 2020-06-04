import React from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, Fab, FormControlLabel } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

import './Introduction.scss';
import { Brick } from 'model/brick';
import OtherInformation from '../baseComponents/OtherInformation';
import MathInHtml from 'components/play/brick/baseComponents/MathInHtml';


interface IntroductionProps {
  isPlayPreview?: boolean;
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
    if (props.isPlayPreview) {
      history.push(`/play-preview/brick/${brick.id}/live`);
    } else {
      history.push(`/play/brick/${brick.id}/live`);
    }
  }

  return (
    <Grid container direction="row" justify="center">
      <div className="brick-container">
        <div className='introduction-page'>
          <div>
            <h3>{brick.brickLength} minutes</h3>
            <h1>{brick.title}</h1>
          </div>
          <ExpansionPanel expanded={state.briefExpanded === true} onChange={toggleBrief}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <h2>Brief</h2>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                <MathInHtml value={brick.brief} />
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel expanded={state.prepExpanded === true} onChange={togglePrep}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <h2>Prep</h2>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div style={{width: '100%'}}>
                <MathInHtml value={brick.prep} />
              </div>
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

export default Introduction;
