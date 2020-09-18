import React, { Component } from "react";
import { Grid, Radio } from "@material-ui/core";
import { connect } from 'react-redux';

import "./BuildCompletePage.scss";
import sprite from "assets/img/icons-sprite.svg";
import { Brick } from "model/brick";
import { ReduxCombinedState } from "redux/reducers";
import actions from 'redux/actions/requestFailed';
import {setCoreLibrary} from 'components/services/axios/brick';

import Clock from "components/play/baseComponents/Clock";


interface BuildCompleteProps {
  history: any;
  brick: Brick;
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
    let link = `/play-preview/brick/${this.props.brick.id}/finalStep`;
    if (this.state.isCore) {
      link += '?isCore=true';
    }
    let success = await setCoreLibrary(this.props.brick.id, this.state.isCore);
    if (success) {
      this.props.brick.isCore = this.state.isCore;
      this.props.history.push(link);
    } else {
      this.props.requestFailed('Can`t set library');
    }
  }
  
  renderFooter() {
    return (
      <div className="action-footer" style={{bottom: '10.5vh'}}>
        <div></div>
        <div className="direction-info">
          Next
        </div>
        <div style={{marginLeft: 0, marginRight: '1.7vw'}}>
          <button
            type="button"
            className="play-preview svgOnHover play-green"
            onClick={() => this.moveNext()}
          >
            <svg className="svg w80 h80 active m-l-02">
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#arrow-right"} />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  render() {
    const {brick} = this.props;
    return (
      <div className="brick-container build-complete-page">
        <Grid container direction="row">
          <Grid item xs={8}>
            <div className="introduction-page">
              <div className="intro-header">
                <div className="left-brick-circle">
                  <div className="round-button">
                    <svg className="svg active">
                      {/*eslint-disable-next-line*/}
                      <use href={sprite + "#trowel"} />
                    </svg>
                  </div>
                </div>
                <h2>You’ve just built a brick!</h2>
                <p className="complete-brick-name">
                  What would you like to do with <span className="bold uppercase">‘{brick.title}’</span>?
                </p>
                <div className="radio-container">
                  <Radio checked={this.state.isCore === false} onClick={() => this.setState({isCore: false})} />
                  <span className="radio-text">Keep it Personal</span>
                  <svg className="svg active">
                    {/*eslint-disable-next-line*/}
                    <use href={sprite + "#key"} />
                  </svg>
                </div>
                <div className="inner-radio-text">
                  Bask in your own glory, share on your favourite platforms, invite anyone to play or edit<span className="text-theme-orange">*</span>
                </div>
                <div className="radio-container">
                  <Radio checked={this.state.isCore === true} onClick={()=> this.setState({isCore: true})} />
                  <span className="radio-text">Educate the World</span>
                  <svg className="svg active">
                    {/*eslint-disable-next-line*/}
                    <use href={sprite + "#globe"} />
                  </svg>
                </div>
                <div className="inner-radio-text">
                  All the above and more: submit your brick to a subject specialist, receive editorial feedback,
                  have the chance to be published in our core library and be paid for your work!<span className="text-theme-orange">*</span>
                </div>
                <div className="inner-radio-text last-one">
                  <span className="text-theme-orange">*</span>No time wasters and trouble makers please: users found to breach our <span className="bold">submission guidelines</span> for
                  appropriate content may be blocked from Brillder and/or reported to relevant authorities.
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
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e)),
});

const connector = connect(mapState, mapDispatch);

export default connector(BuildCompletePage);
