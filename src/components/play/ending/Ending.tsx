import React from "react";
import { Grid, Hidden } from "@material-ui/core";
import { CircularProgressbar } from "react-circular-progressbar";

import "./Ending.scss";
import { Brick } from "model/brick";
import { PlayStatus } from "../model";
import { BrickAttempt } from "../model";
import EndingStepper from "./EndingStepper";
import { getPlayPath } from "../service";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { isPhone } from "services/phone";
import BrickTitle from "components/baseComponents/BrickTitle";

interface EndingState {
  oldScore: number;

  liveScore: number;
  reviewScore: number;
  currentScore: number;

  currentPScore: number;
  minPScore: number;
  maxPScore: number;

  interval: number;
  handleMove(): void;
}

interface EndingProps {
  status: PlayStatus;
  brick: Brick;
  history: any;
  location: any;
  brickAttempt: BrickAttempt;
  move(): void;
}

class EndingPage extends React.Component<EndingProps, EndingState> {
  constructor(props: EndingProps) {
    super(props);

    const { oldScore, maxScore, score } = this.props.brickAttempt;

    const oldScoreNumber = oldScore ? oldScore : 0;

    const currentPScore = 0;
    const minPScore = Math.round((oldScoreNumber * 100) / maxScore);
    const maxPScore = Math.round((score * 100) / maxScore);

    this.state = {
      oldScore: oldScoreNumber,

      currentScore: 0,
      liveScore: 0,
      reviewScore: 0,

      currentPScore,
      minPScore,
      maxPScore,

      interval: 0,
      handleMove: this.handleMove.bind(this)
    };
  }

  componentDidMount() {
    let step = 3;
    const { oldScore } = this.state;
    const { score, maxScore } = this.props.brickAttempt;
    let liveScore = Math.round((oldScore * 100) / maxScore);
    let reviewScore = Math.round((score * 100) / maxScore);
    let currentScore = Math.round(((oldScore + score) * 50) / maxScore);
    let interval = setInterval(() => {
      let tempReviewScore = this.state.reviewScore;
      let tempLiveScore = this.state.liveScore;
      let tempCurrentScore = this.state.currentScore;

      if (tempReviewScore < reviewScore - step) {
        tempReviewScore += step;
      } else {
        tempReviewScore = reviewScore;
      }
      if (tempLiveScore < liveScore - step) {
        tempLiveScore += step;
      } else {
        tempLiveScore = liveScore;
      }

      if (tempCurrentScore < currentScore - step) {
        tempCurrentScore += step;
      } else {
        tempCurrentScore = currentScore;
      }

      this.setState({ liveScore: tempLiveScore, reviewScore: tempReviewScore, currentScore: tempCurrentScore });

      if (liveScore === this.state.liveScore && reviewScore === tempReviewScore && currentScore === tempCurrentScore) {
        clearInterval(interval);
      }
    }, 100);
    this.setState({ interval });

    //document.addEventListener("keydown", this.state.handleMove, false);
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
    //document.removeEventListener("keydown", this.state.handleMove, false);
  }

  handleMove() {
    this.props.move();
  }

  renderProgressBars() {
    const { score, maxScore } = this.props.brickAttempt;
    return (
      <div className="question-live-play">
        <Grid
          container
          justify="center"
          alignContent="center"
          className="circle-progress-container"
        >
          <CircularProgressbar
            className="circle-progress-first"
            strokeWidth={4}
            counterClockwise={true}
            value={this.state.liveScore}
          />
          <Grid
            container
            justify="center"
            alignContent="center"
            className="score-circle"
          >
            <CircularProgressbar
              className="circle-progress-second"
              counterClockwise={true}
              strokeWidth={4}
              value={this.state.reviewScore}
            />
          </Grid>
          <Grid
            container
            justify="center"
            alignContent="center"
            className="score-circle"
          >
            <CircularProgressbar
              className="circle-progress-third"
              counterClockwise={true}
              strokeWidth={4}
              value={this.state.currentScore}
            />
          </Grid>
          <Grid
            container
            justify="center"
            alignContent="center"
            className="score-circle"
          >
            <div>
              <div className="score-precentage">{this.state.currentScore}%</div>
              <div className="score-number">
                {this.state.oldScore}/{maxScore}
              </div>
              <div className="score-number">
                {score}/{maxScore}
              </div>
            </div>
          </Grid>
        </Grid>
        <div className="p-help-text">
          This is an average of your provisional score and your review score.
        </div>
      </div>
    );
  }

  renderFooter() {
    return (
      <div className="action-footer">
        <div></div>
        <div className="direction-info text-center">
          <h2>Summary</h2>
        </div>
        <div>
          <button
            type="button"
            className="play-preview svgOnHover play-green"
            onClick={this.props.move}
          >
            <SpriteIcon name="arrow-right" className="w80 h80 active m-l-02" />
          </button>
        </div>
      </div>
    );
  }

  renderPhoneButton() {
    return (
      <div className="action-footer mobile-footer-fixed-buttons">
        <SpriteIcon name="arrow-right" className="mobile-next-button" onClick={this.props.move} />
      </div>
    );
  }

  renderStepper() {
    return (
      <EndingStepper
        questions={this.props.brick.questions}
        attempts={this.props.brickAttempt.answers}
        handleStep={() => { }}
      />
    );
  }

  render() {
    const playPath = getPlayPath(false, this.props.brick.id);

    if (this.props.status === PlayStatus.Live) {
      this.props.history.push(`${playPath}/intro`);
    }

    return (
      <div className="brick-row-container ending-container">
        <Hidden only={["xs"]}>
          <div className="brick-container play-preview-panel ending-page">
            <div className="fixed-upper-b-title">
              <BrickTitle title={this.props.brick.title} />
            </div>
            <Grid container direction="row">
              <Grid item xs={8}>
                <div className="introduction-page">
                  <h1 className="title">Final Score</h1>
                  {this.renderProgressBars()}
                </div>
                <div className="new-layout-footer" style={{ display: 'none' }}>
                  <div className="time-container" />
                  <div className="minutes-footer" />
                  <div className="footer-space" />
                  <div className="new-navigation-buttons">
                    <div className="n-btn next" onClick={this.props.move}>
                      Next
                      <SpriteIcon name="arrow-right" />
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="introduction-info">
                  <div className="intro-header">
                    <div>
                      Range: {this.state.minPScore}%-{this.state.maxPScore}%
                    </div>
                  </div>
                  <div className="intro-text-row f-align-self-start m-t-5">
                    {this.renderStepper()}
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </Hidden>
        <Hidden only={["sm", "md", "lg", "xl"]}>
          <div className="brick-container play-preview-panel ending-page mobile-ending-page">
            <div className="introduction-page">
              <div className="introduction-info">
                <div className="intro-text-row">
                  <span className="heading text-center">Final Score</span>
                  {this.renderStepper()}
                </div>
              </div>
              {this.renderProgressBars()}
              {isPhone() ? this.renderPhoneButton() : this.renderFooter()}
            </div>
          </div>
        </Hidden>
      </div>
    );
  }
}

export default EndingPage;
