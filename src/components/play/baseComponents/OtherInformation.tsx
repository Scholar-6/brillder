import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import './OtherInformation.scss'


interface IntroductionProps {
  creator: string;
  totalUsers: number;
  averageScore: number;
  highScore: number;
  expanded: boolean;
  toggle():void;
}

const OtherInformation: React.FC<IntroductionProps> = (props) => {
  return (
    <ExpansionPanel className="other-information" expanded={props.expanded === true} onChange={props.toggle}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <h2 className="other-header">Other Information</h2>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <div className="other-content">
        <div>Creator: {props.creator}</div>
        <div>Total Users: {props.totalUsers}</div>
        <div>average score: {props.averageScore}</div>
        <div>high score: {props.highScore}</div>
        </div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

export default OtherInformation;
