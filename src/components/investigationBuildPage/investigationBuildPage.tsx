import React, { Component } from 'react'
import Dustbin from './DragDustbin'
import DragBox from './DragBox'
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Grid, Slider } from '@material-ui/core';
import HorizontalStepper from './horizontalStepper/horizontalStepper';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

import './investigationBuildPage.scss'
import BuildPageHeaderComponent from './header/pageHeader';
import actions from '../../redux/actions/proFormActions';
import brickActions from '../../redux/actions/brickActions';


interface InvestigationBuildProps extends RouteComponentProps<any> {
  fetchBrick: Function,
  fetchProForma: Function
}

type InvestigationBuildState = {
  subject: string,
  topic: string,
  subTopic: string,
  alternativeTopics: string,
  proposedTitle: string,
  investigationBrief: string,
  preparationBrief: string
}

const mapState = (state: any) => {
  return {
    data: state
  }
}

const mapDispatch = (dispatch: any) => {
  return {
    fetchBrick: (brickId: number) => dispatch(brickActions.fetchBrick(brickId)),
    fetchProForma: () => dispatch(actions.fetchBrickBuildData())
  }
}

const connector = connect(
  mapState,
  mapDispatch
)

class InvestigationBuildPage extends Component<InvestigationBuildProps, InvestigationBuildState>  {
  constructor(props: InvestigationBuildProps) {
    super(props)
    this.state = {
      subject: '',
      topic: '',
      subTopic: '',
      proposedTitle: '',
      alternativeTopics: '',
      investigationBrief: '',
      preparationBrief: ''
    }

    const { brickId } = this.props.match.params;
    props.fetchProForma();
    props.fetchBrick(brickId);
  }

  render() {
    return (
      <div className="investigation-build-page">
        <BuildPageHeaderComponent />
        <Grid container direction="row">
          <Grid container className="left-sidebar sidebar" justify="center" item xs={2} sm={1}>
            <div>>></div>
            <DragBox name="Glass" />
            <div className="odd">T</div>
            <div className="even">E</div>
            <div className="odd">P</div>
            <div className="even">R</div>
            <div className="odd">S</div>
            <div className="even">V</div>
          </Grid>
          <Grid container item xs={8} sm={10}>
            <Grid container direction="row">
              <Grid container justify="center" item xs={12}>
                <HorizontalStepper />
              </Grid>
            </Grid>
            <br/>
          </Grid>
          <Grid container className="right-sidebar sidebar" item xs={2} sm={1}>
            <div>&lt;&lt;</div>
            <div className="odd">Q</div>
            <div className="even small">MULTIPLE CHOICE</div>
            <div className="odd small">SORT</div>
            <div className="even small">WORD FILL</div>
            <div className="odd small">HIGHLIGHT</div>
            <div className="even small">ALIGN</div>
            <div className="odd small">SHUFFLE</div>
            <div className="even small">PICTURE POINT</div>
            <div className="odd small">JUMBLE</div>
          </Grid>
          <div>
            <div style={{ overflow: 'hidden', clear: 'both' }}>
              <Dustbin allowedDropEffect="any" />
              <Dustbin allowedDropEffect="copy" />
              <Dustbin allowedDropEffect="move" />
            </div>
            <div style={{ overflow: 'hidden', clear: 'both' }}>
              <DragBox name="Banana" />
              <DragBox name="Paper" />
            </div>
          </div>
        </Grid>
        <Grid container direction="row" className="page-fotter">
          <Grid container item xs={4} sm={7} md={8} lg={9}></Grid>
          <Grid container item xs={7} sm={4} md={3} lg={2}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <RemoveIcon className="white" color="inherit" />
              </Grid>
              <Grid item xs>
                <Slider className="white" aria-labelledby="continuous-slider" />
              </Grid>
              <Grid item>
                <AddIcon className="white" color="inherit" />
              </Grid>
              <Grid item className="percentages">
                55 %
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default connector(InvestigationBuildPage);
