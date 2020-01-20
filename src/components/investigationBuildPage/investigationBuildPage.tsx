import './investigationBuildPage.scss';
import React, { Component } from 'react';
import { Box, Grid, Slider } from '@material-ui/core';
import { connect } from 'react-redux';
import BuildPageHeaderComponent from './header/pageHeader';
import actions from '../../redux/actions/proFormActions';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import HorizontalStepper from './horizontalStepper/horizontalStepper';

type InvestigationBuildProps = {}

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
    fetchProForma: () => dispatch(actions.fetchBrickBuildData())
  }
}

const connector = connect(
  mapState,
  mapDispatch
)

class InvestigationBuildPage extends Component<InvestigationBuildProps, InvestigationBuildState> {
  constructor(props: any) {
    super(props)
    props.fetchProForma();
    this.state = {
      subject: '',
      topic: '',
      subTopic: '',
      proposedTitle: '',
      alternativeTopics: '',
      investigationBrief: '',
      preparationBrief: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleTextareaChange = this.handleTextareaChange.bind(this);
    props.fetchProForma();
  }

  handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    let stateChange = {} as any;
    let name = event.target.name;
    stateChange[name] = event.target.value;
    this.setState(stateChange);
  }

  handleTextareaChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    let stateChange = {} as any;
    let name = event.target.name;
    stateChange[name] = event.target.value;
    this.setState(stateChange);
  }

  render() {
    return (
      <div className="investigation-build-page">
        <BuildPageHeaderComponent />
        <Grid container direction="row">
          <Grid container className="left-sidebar sidebar" justify="center" item xs={2} sm={1}>
            <div>>></div>
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
            <div>
              Investigation build page
            </div>
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
