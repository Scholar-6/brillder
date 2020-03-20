import React from "react";
import Grid from "@material-ui/core/Grid";
import EditIcon from '@material-ui/icons/Edit';

import ExitButton from '../../components/ExitButton';
import { Brick } from "model/brick";
import './ProposalReview.scss';
import { NewBrickStep } from "../../model";
import NextButton from '../../components/nextButton';
import PreviousButton from '../../components/previousButton';
import PhonePreview from "components/build/baseComponents/phonePreview/PhonePreview";


interface ProposalProps {
  brick: Brick;
  saveBrick():void;
}

const ProposalReview: React.FC<ProposalProps> = ({brick, saveBrick}) => {
  return (
    <div className="tutorial-page">
      <ExitButton />
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid container justify="center" item xs={12} md={8} lg={8}>
          <Grid justify="center" container item xs={12} sm={9} md={8} lg={7}>
            <div className="left-card proposal-card">
              <Grid container direction="row" justify="center" className="only-tutorial-header" alignContent="center">
                <h1 >Your Proposal</h1>
              </Grid>
              <p>1. What is your brick about</p>
              <div className="proposal-titles">
                <div>{brick.title}</div>
                <div>{brick.subTopic}</div>
                <div>{brick.alternativeTopics}</div>
              </div>
              <p>2. Ideally, every brick should point to a bigger question.</p>
              <p className="proposal-titles">{brick.openQuestion}</p>
              <p>3. Outline the purpose of your brick.</p>
              <p className="proposal-titles">{brick.brief}</p>
              <p>4. Create an engaging and relevant preparatory task.</p>
              <p style={{fontWeight: 'normal'}} dangerouslySetInnerHTML={{ __html: brick.prep}}></p>
              <p>5. Brick Length: <span className="brickLength">{brick.brickLength} mins.</span></p>
              <PreviousButton to="/build/new-brick/length" />
              <NextButton step={NewBrickStep.ProposalReview} canSubmit={true} onSubmit={saveBrick} />
            </div>
          </Grid>
        </Grid>
        <PhonePreview link={window.location.origin + '/logo-page'} />
      </Grid>
    </div>
  );
}

export default ProposalReview;
