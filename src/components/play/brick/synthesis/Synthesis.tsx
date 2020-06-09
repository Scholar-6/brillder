import React from 'react';
import { Grid, Fab, FormControlLabel } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

import './Synthesis.scss';
import { Brick } from 'model/brick';
import { useHistory } from 'react-router-dom';
import OtherInformation from '../baseComponents/OtherInformation';
import { PlayStatus } from '../model/model';
import MathInHtml from 'components/play/brick/baseComponents/MathInHtml';


interface ProvisionalScoreProps {
  isPlayPreview?: boolean;
  status: PlayStatus;
  brick: Brick;
}

interface ProvisionalState {
  synthesisExpanded: boolean;
  otherExpanded: boolean;
}

const ProvisionalScore: React.FC<ProvisionalScoreProps> = ({ status, brick, ...props }) => {
  const history = useHistory();
  if (status === PlayStatus.Live) {
    if (props.isPlayPreview) {
      history.push(`/play-preview/brick/${brick.id}/intro`);
    } else {
      history.push(`/play/brick/${brick.id}/intro`);
    }
  }
  const [state, setState] = React.useState({
    synthesisExpanded: true,
    otherExpanded: false,
  } as ProvisionalState);

  const toggleOther = () => {
    setState({ ...state, otherExpanded: !state.otherExpanded });
  }

  const toggleSynthesis = () => {
    setState({ ...state, synthesisExpanded: !state.synthesisExpanded });
  }

  const reviewBrick = () => {
    if (props.isPlayPreview) {
      history.push(`/play-preview/brick/${brick.id}/review`);
    } else {
      history.push(`/play/brick/${brick.id}/review`);
    }
  }

  let newSynthesis = "";
  if (brick.synthesis) {
    newSynthesis = brick.synthesis.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }

  return (
    <Grid container direction="row" justify="center">
      <div className="brick-container">
        <div className='synthesis-page'>
          <div>
            <h3>{brick.brickLength} minutes</h3>
            <h1>{brick.title}</h1>
          </div>
          <ExpansionPanel className="synthesis-expansion-panel" expanded={state.synthesisExpanded === true} onChange={toggleSynthesis}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <h2>Synthesis</h2>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                <MathInHtml value={newSynthesis} />
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <div className="begin-row">
            <FormControlLabel
              className="start-brick-button"
              labelPlacement="start"
              control={
                <Fab style={{ background: '#0076B4' }} color="secondary" aria-label="add" onClick={reviewBrick}>
                  <PlayArrowIcon />
                </Fab>
              }
              label="Review Brick Attempt"
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
