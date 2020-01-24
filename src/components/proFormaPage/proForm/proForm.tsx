import React, { Component } from 'react';
import { Box, Grid, Button } from '@material-ui/core';
import { connect } from 'react-redux';
import actions from '../../../redux/actions/proFormActions';
import { ProFormaProps, ProFormaState, ProFormaSubmitData, Brick } from '../model';

interface ProFormaComponentProps {
  parent: ProFormaProps,
  brick: Brick,
}

const mapState = (state: any) => {
  return {
    loading: state.proForm.loading,
  }
}

const mapDispatch = (dispatch: any) => {
  return {
    fetchProForm: () => dispatch(actions.fetchBrickBuildData()),
    submitProForm: (data: ProFormaSubmitData) => dispatch(actions.submitBrickBuildData(data)),
  }
}

class ProFormaComponent extends Component<ProFormaComponentProps, ProFormaState> {
  constructor(props: ProFormaComponentProps) {
    super(props)
    const {brick} = this.props;
    let state = {
      subject: brick.subject,
      topic: brick.topic,
      subTopic: brick.subTopic,
      title: brick.title,
      alternativeTopics: brick.alternativeTopics,
      investigationBrief: brick.investigationBrief,
      preparationBrief: brick.preparationBrief
    } as ProFormaState;

    if (brick) {
      state.id = brick.id
    }

    this.state = state;

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleTextareaChange = this.handleTextareaChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleSubmit(event: any) {
    event.preventDefault();
    this.props.parent.submitProForm(this.state);
    //this.props.parent.history.push("/brick-build");
  }

  render() {
    if (this.props.parent.submitted === true) {
      this.props.parent.history.push("/brick-build");
    }

    return (
      <form onSubmit={this.handleSubmit}>
        <Grid container direction="row">
          <Grid container item xs={12} sm={12} md={10} lg={8}>
            <Grid container direction="row" className="row">
              <Grid container item xs={4}>
                <div className="fullWidth">
                  <Box className="right left-box" bgcolor="primary.main">Subject</Box>
                </div>
              </Grid>
              <Grid container item xs={8} sm={5}>
                <input
                  name="subject"
                  value={this.state.subject}
                  onChange={this.handleInputChange}
                  maxLength={30}
                  required
                  placeholder="e.g. History" />
              </Grid>
            </Grid>
            <Grid container direction="row" className="row">
              <Grid container item xs={4}>
                <div className="fullWidth">
                  <Box className="right left-box" bgcolor="primary.main">Topic</Box>
                </div>
              </Grid>
              <Grid container item xs={8} sm={5}>
                <input
                  name="topic"
                  value={this.state.topic}
                  onChange={this.handleInputChange}
                  maxLength={30}
                  required
                  placeholder="e.g. Italy 1918 - 1939" />
              </Grid>
            </Grid>
            <Grid container direction="row" className="row">
              <Grid container item xs={4}>
                <div className="fullWidth">
                  <Box className="right left-box" bgcolor="primary.main">Sub-topic</Box>
                </div>
              </Grid>
              <Grid container item xs={8} sm={5}>
                <input
                  name="subTopic"
                  value={this.state.subTopic}
                  onChange={this.handleInputChange}
                  maxLength={30}
                  required
                  placeholder="e.g. Rise of Rascism" />
              </Grid>
            </Grid>
            <Grid container direction="row" className="row">
              <Grid container item xs={4}>
                <div className="fullWidth">
                  <Box className="right left-box" height="auto" bgcolor="primary.main">Alternative Topics</Box>
                </div>
              </Grid>
              <Grid container item xs={8} sm={5}>
                <input
                  name="alternativeTopics"
                  value={this.state.alternativeTopics}
                  onChange={this.handleInputChange}
                  maxLength={30}
                  required
                  placeholder="e.g. 20th century Dictators" />
              </Grid>
            </Grid>
            <Grid container direction="row" className="row">
              <Grid container item xs={4}>
                <div className="fullWidth">
                  <Box className="right left-box" bgcolor="primary.main">Proposed Title</Box>
                </div>
              </Grid>
              <Grid container item xs={8} sm={5}>
                <input
                  name="title"
                  value={this.state.title}
                  onChange={this.handleInputChange}
                  maxLength={30}
                  required
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
                  required
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
                  required
                  placeholder="In less than 150 (including links), set a relevant task or tasks which the student can do independently before starting the investigation. Preparation should take 5, 10 or 15 minutes depending on whether the investigation is 20, 40 or 60 minutes long."></textarea>
              </Grid>
            </Grid>
            <Grid container direction="row" className="row">
              <Grid container item xs={4}></Grid>
              <Grid container item xs={8}>
                <Button type="submit" variant="contained" color="primary">Save / Update</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    )
  }
}

export default connect(mapState, mapDispatch)(ProFormaComponent);
