import React from "react";
// @ts-ignore
import { connect } from 'react-redux';
// @ts-ignore
import Device from "react-device-frame";
import { Hidden } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { IconButton } from "material-ui";

import actions from '../../../../redux/actions/brickActions';
import { Brick } from "model/brick";
import './ProposalReview.scss';


interface ProposalProps {
  brick: Brick
  history: any
  match: any
  fetchBrick(brickId: number): void
}

function ProposalReview(props: ProposalProps) {
  if (!props.brick) {
    let { brickId } = props.match.params;
    props.fetchBrick(brickId);
    return <div>...Loading brick...</div>
  }
  const { brick } = props;
  console.log(brick);
  return (
    <div className="tutorial-page">
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid container justify="center" item xs={12} md={7} lg={8}>
          <Grid container direction="row" style={{ height: '100%' }} justify="center">
            <Grid container justify="center" item xs={12} sm={9} md={10} lg={7}>
              <div className="left-card proposal-card">
                <h1>Y O U R &nbsp; P R O P O S A L</h1>
                <p>1. What is your brick about</p>
                <div className="proposal-titles">
                  <div>{brick.title}</div>
                  <div>{brick.subTopic}</div>
                  <div>{brick.alternativeTopics}</div>
                </div>
                <p>2. Ideally, every brick should point to a bigger question.</p>
                <p className="grey-line">Alternatively, bricks can present a puzzle or a 	challenge 	which over-arches the topic</p>
                <p className="openQuestion">{brick.openQuestion}</p>
                <p>3. Outline the purpose of your brick.</p>
                <p className="openQuestion">{brick.preparationBrief}</p>
                <p>4. Create an engaging and relevant preparatory task.</p>
                <p>5. Brick Length: <span className="brickLength">{brick.brickLength}</span></p>
                <Grid
                  container
                  direction="row"
                  alignItems="flex-start"
                  className="tutorial-next-container"
                >
                  <Grid container xs={6} justify="flex-start">
                    <IconButton className="proposal-button rotate-180" onClick={() => { }} aria-label="next">
                      <ArrowForwardIosIcon className="tutorial-next-icon" />
                    </IconButton>
                  </Grid>
                  <Grid container xs={6} justify="flex-end">
                    <IconButton className="proposal-button" onClick={() => { }} aria-label="next">
                      <ArrowForwardIosIcon className="tutorial-next-icon" />
                    </IconButton>
                  </Grid>
                </Grid>
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Hidden only={['xs', 'sm']}>
          <div style={{ right: "5%", position: "fixed", width: '19.3%', paddingTop: '33.3%' }}>
            <Device name="iphone-5s" use="iphone-5s" color="grey" url={window.location.origin + '/logo-page'} />
          </div>
        </Hidden>
      </Grid>
    </div>
  );
}


const mapState = (state: any) => {
  return {
    brick: state.brick.brick,
  }
};

const mapDispatch = (dispatch: any) => {
  return {
    fetchBrick: (brickId: number) => dispatch(actions.fetchBrick(brickId)),
  }
};

const connector = connect(
  mapState,
  mapDispatch
);

export default connector(ProposalReview);
