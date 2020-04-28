import React from "react";
import { useHistory } from 'react-router-dom';

import { ProposalStep } from "../../model";
import './Navigation.scss';
import { Grid } from "@material-ui/core";

interface NextButtonProps {
  step: ProposalStep
}

const NextButton:React.FC<NextButtonProps> = ({ step }) => {
  const history = useHistory()

  const moveToTitles = () => {
    history.push('/build/new-brick/brick-title');
  }

  const moveToOpenQuestion = () => {
    history.push('/build/new-brick/open-question');
  }

  const moveToBrief = () => {
    history.push('/build/new-brick/brief');
  }

  const moveToPrep = () => {
    history.push('/build/new-brick/prep');
  }

  const moveToLength = () => {
    history.push('/build/new-brick/length');
  }

  return (
    <div className="navigation-container">
      <Grid container item justify="center">
        <img onClick={() => moveToTitles()} className="navigation-button first" alt="" src="/images/new-brick/titles.png" />
        <img onClick={() => moveToOpenQuestion()} className="navigation-button" alt="" src="/images/new-brick/head.png" />
        <img onClick={() => moveToBrief()} className="navigation-button" alt="" src="/images/new-brick/brief-circles.png" />
        <img onClick={() => moveToPrep()} className="navigation-button" alt="" src="/images/new-brick/prep.png" />
        <img onClick={() => moveToLength()} className="navigation-button last" alt="" src="/images/new-brick/brick-length.png" />
      </Grid>
    </div>
  );
}

export default NextButton
