import React, { Component } from "react";
import { Grid, Radio } from "@material-ui/core";
import { connect } from 'react-redux';

import "./BuildCompletePage.scss";
import { Brick } from "model/brick";
import { ReduxCombinedState } from "redux/reducers";
import brickActions from 'redux/actions/brickActions';
import actions from 'redux/actions/requestFailed';
import { setCoreLibrary } from 'services/axios/brick';

import Clock from "components/play/baseComponents/Clock";
import { Redirect } from "react-router-dom";
import { User } from "model/user";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { checkAdmin, checkEditor } from "components/services/brickService";


interface BuildCompleteProps {
  history: any;
  user: User;
  brick: Brick;

  fetchBrick(brickId: number): void;
  requestFailed(e: string): void;
}

interface BuildCompleteState {
  isCore?: boolean;
}

class BuildCompletePage extends Component<BuildCompleteProps, BuildCompleteState> {
  constructor(props: BuildCompleteProps) {
    super(props);

    this.state = { isCore: props.brick.isCore }
  }

  async moveNext() {
    let success = await setCoreLibrary(this.props.brick.id, this.state.isCore);
    if (success) {
      this.props.brick.isCore = this.state.isCore;
      await this.props.fetchBrick(this.props.brick.id);
      this.props.history.push(`/play-preview/brick/${this.props.brick.id}/submit`);
    } else {
      this.props.requestFailed('Can`t set brick library');
    }
  }

  renderFooter() {
    return (
      <div className="action-footer">
        <div></div>
        <div className="direction-info">
          Next
        </div>
        <div style={{ marginLeft: 0, marginRight: '1.7vw' }}>
          <button
            type="button"
            className="play-preview svgOnHover play-green"
            onClick={() => this.moveNext()}
          >
            <SpriteIcon name="arrow-right" className="w80 h80 active m-l-02" />
          </button>
        </div>
      </div>
    );
  }

  render() {
    const { brick, user } = this.props;
    const isAdmin = checkAdmin(user.roles);
    let isAuthor = false;
    try {
      isAuthor = brick.author.id === user.id;
    } catch { }
    const isCurrentEditor = (brick.editors?.findIndex(e => e.id === user.id) ?? -1) >= 0;
    const isEditor = checkEditor(user.roles);

    // show page for admins and authors
    if (!isAdmin && !isAuthor) {
      if (isCurrentEditor || isEditor) {
        return <Redirect to={`/play-preview/brick/${brick.id}/submit`} />;
      }
    }

    return (
      <div className="brick-row-container">
        <div className="brick-container build-complete-page">
          <Grid container direction="row">
            <Grid item xs={8}>
              <div className="introduction-page">
                <div className="intro-header">
                  <div className="left-brick-circle">
                    <div className="round-button">
                      <SpriteIcon name="trowel" className="active" />
                    </div>
                  </div>
                  <h2>You’ve just built a brick!</h2>
                  <p className="complete-brick-name">
                    What would you like to do with <span className="bold uppercase">‘{brick.title}’</span>?
                </p>
                  <div className="radio-container" onClick={() => this.setState({ isCore: false })}>
                    <Radio checked={this.state.isCore === false} />
                    <span className="radio-text pointer">Keep Control</span>
                    <SpriteIcon name="key" className="active" />
                  </div>
                  <div className="inner-radio-text pointer" onClick={() => this.setState({ isCore: false })}>
                    Share on your favourite platforms, invite anyone to play or comment
                </div>
                  <div className="radio-container pointer" onClick={() => this.setState({ isCore: true })} >
                    <Radio checked={this.state.isCore === true} />
                    <span className="radio-text">Educate the World</span>
                    <SpriteIcon name="globe" className="active" />
                  </div>
                  <div className="inner-radio-text pointer" onClick={() => this.setState({ isCore: true })}>
                    Submit to a subject specialist, receive editorial feedback,
                    be considered for our core library and paid for your work!
                </div>
                  <div className="inner-radio-text last-one">
                    Users who breach our <span className="bold">submission guidelines</span> for appropriate content may be blocked from Brillder and/or reported to relevant authorities.
                </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="introduction-info">
                <div className="intro-header">
                  <Clock brickLength={brick.brickLength} />
                </div>
                <div className="intro-text-row">
                </div>
                {this.renderFooter()}
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

const mapDispatch = (dispatch: any) => ({
  fetchBrick: (id: number) => dispatch(brickActions.fetchBrick(id)),
  requestFailed: (e: string) => dispatch(actions.requestFailed(e)),
});

const connector = connect(mapState, mapDispatch);

export default connector(BuildCompletePage);
