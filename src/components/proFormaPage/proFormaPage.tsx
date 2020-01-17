import './proFormaPage.scss';
import React, { Component } from 'react';
import { Box, Grid } from '@material-ui/core';
import { connect } from 'react-redux';
import actions from '../../redux/actions/proFormActions';
import EditorRowComponent from './editorRow/editorRow';

type ProFormaProps = {}

type ProFormaState = {
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
    data: state.proForm.data
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

class ProFormaPage extends Component<ProFormaProps, ProFormaState> {
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
      <div className="create-brick-page">
        <EditorRowComponent />

        <Grid container direction="row">
          <Grid container item xs={12} sm={10} md={6} lg={5}>
            <Grid container direction="row" className="row">
              <Grid container item xs={4}>
                <div className="fullWidth">
                  <Box className="right left-box" bgcolor="primary.main">Subject</Box>
                </div>
              </Grid>
              <Grid container item xs={7}>
                <input
                  name="subject"
                  value={this.state.subject}
                  onChange={this.handleInputChange}
                  maxLength={30}
                  placeholder="e.g. History" />
              </Grid>
            </Grid>
            <Grid container direction="row" className="row">
              <Grid container item xs={4}>
                <div className="fullWidth">
                  <Box className="right left-box" bgcolor="primary.main">Topic</Box>
                </div>
              </Grid>
              <Grid container item xs={7}>
                <input
                  name="topic"
                  value={this.state.topic}
                  onChange={this.handleInputChange}
                  maxLength={30}
                  placeholder="e.g. Italy 1918 - 1939" />
              </Grid>
            </Grid>
            <Grid container direction="row" className="row">
              <Grid container item xs={4}>
                <div className="fullWidth">
                  <Box className="right left-box" bgcolor="primary.main">Sub-topic</Box>
                </div>
              </Grid>
              <Grid container item xs={7}>
                <input
                  name="subTopic"
                  value={this.state.subTopic}
                  onChange={this.handleInputChange}
                  maxLength={30}
                  placeholder="e.g. Rise of Rascism" />
              </Grid>
            </Grid>
            <Grid container direction="row" className="row">
              <Grid container item xs={4}>
                <div className="fullWidth">
                  <Box className="right left-box" height="auto" bgcolor="primary.main">Alternative Topics</Box>
                </div>
              </Grid>
              <Grid container item xs={7}>
                <input
                  name="alternativeTopics"
                  value={this.state.alternativeTopics}
                  onChange={this.handleInputChange}
                  maxLength={30}
                  placeholder="e.g. 20th century Dictators" />
              </Grid>
            </Grid>
            <Grid container direction="row" className="row">
              <Grid container item xs={4}>
                <div className="fullWidth">
                  <Box className="right left-box" bgcolor="primary.main">Proposed Title</Box>
                </div>
              </Grid>
              <Grid container item xs={7}>
                <input
                  name="proposedTitle"
                  value={this.state.proposedTitle}
                  onChange={this.handleInputChange}
                  maxLength={30}
                  placeholder="e.g. The Italo-Abyssinian Wars" />
              </Grid>
            </Grid>
            <Grid container direction="row" className="row">
              <Grid container item xs={4}>
                <div className="fullWidth">
                  <Box className="right left-box" bgcolor="primary.main">Investigation Brief</Box>
                </div>
              </Grid>
              <Grid container item xs={8}>
                <textarea
                  name="investigationBrief"
                  value={this.state.investigationBrief}
                  onChange={this.handleTextareaChange}
                  maxLength={100}
                  placeholder="In less than 100 words, explain to the student what is going to be explored in the investigation"></textarea>
              </Grid>
            </Grid>
            <Grid container direction="row" className="row">
              <Grid container item xs={4}>
                <div className="fullWidth">
                  <Box className="right left-box" bgcolor="primary.main">Preparation Brief</Box>
                </div>
              </Grid>
              <Grid container item xs={8}>
                <textarea
                  name="preparationBrief"
                  value={this.state.preparationBrief}
                  onChange={this.handleTextareaChange}
                  maxLength={150}
                  placeholder="In less than 150 (including links), set a relevant task or tasks which the student can do independently before starting the investigation. Preparation should take 5, 10 or 15 minutes depending on whether the investigation is 20, 40 or 60 minutes long."></textarea>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default connector(ProFormaPage);
