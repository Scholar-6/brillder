import React from 'react';
import { Grid, Hidden } from '@material-ui/core';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import './ProvisionalScore.scss';
import { Brick } from 'model/brick';
import { PlayStatus } from '../model';
import { getPlayPath } from '../service';

import ReviewStepper from '../review/ReviewStepper';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { rightKeyPressed } from 'components/services/key';
import { isPhone } from 'services/phone';
import routes from '../routes';
import previewRoutes from 'components/playPreview/routes';
import BrickTitle from 'components/baseComponents/BrickTitle';
import { User } from 'model/user';

interface ProvisionalScoreState {
  value: number;
  score: number;
  maxScore: number;
  interval: any;
  handleMove: any;
}

interface ProvisionalScoreProps {
  user?: User;
  history: any;
  location: any;
  isPlayPreview?: boolean;
  status: PlayStatus;
  brick: Brick;
  attempts: any[];
}

class ProvisionalScore extends React.Component<ProvisionalScoreProps, ProvisionalScoreState> {
  constructor(props: ProvisionalScoreProps) {
    super(props);

    const { attempts } = props;

    const score = attempts.reduce((acc, answer) => {
      if (!answer || !answer.marks) {
        return acc + 0;
      }
      return acc + answer.marks;
    }, 0);
    const maxScore = attempts.reduce((acc, answer) => {
      if (!answer) {
        return acc;
      }
      if (!answer.maxMarks) {
        return acc + 5;
      }
      return acc + answer.maxMarks;
    }, 0);


    this.state = {
      value: 0,
      score,
      maxScore,
      interval: null,
      handleMove: this.handleMove.bind(this)
    };
  }

  componentDidMount() {
    let step = 3;
    let percentages = Math.round((this.state.score * 100) / this.state.maxScore);
    const interval = setInterval(() => {
      if (this.state.value < percentages - 3) {
        this.setState({ value: this.state.value + step });
      } else {
        this.setState({ value: percentages });
        clearInterval(interval);
      }
    }, 100);
    document.addEventListener("keydown", this.state.handleMove, false);
  }

  handleMove(e: any) {
    if (rightKeyPressed(e)) {
      this.moveToSynthesis();
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
    document.removeEventListener("keydown", this.state.handleMove, false);
  }

  renderProgressBar() {
    return (
      <div className="question-live-play">
        <Grid container justify="center" alignContent="center" className="circle-progress-container">
          <CircularProgressbar className="circle-progress" strokeWidth={4} counterClockwise={true} value={this.state.value} />
          <div className="score-data">
            <Grid container justify="center" alignContent="center">
              <div>
                <div className="score-precentage">{this.state.value}%</div>
                <div className="score-number">{this.state.score}/{this.state.maxScore}</div>
              </div>
            </Grid>
          </div>
        </Grid>
        <div className="p-help-text">
          Now read the author's synthesis to deepen your understanding of the topic.
        </div>
      </div>
    );
  }

  moveToIntro() {
    const brickId = this.props.brick.id;
    let link = '';
    if (isPhone()) {
      link = routes.phonePrep(brickId);
    } else {
      if (this.props.isPlayPreview) {
        link = previewRoutes.previewNewPrep(brickId);
      } else {
        link = routes.playNewPrep(brickId);
      }
    }
    this.props.history.push(link);
  }

  moveToSynthesis() {
    let link = '';
    if (isPhone()) {
      link = getPlayPath(this.props.isPlayPreview, this.props.brick.id) + routes.PlaySynthesisLastPrefix;
    } else {
      if (this.props.isPlayPreview) {
        link = getPlayPath(this.props.isPlayPreview, this.props.brick.id) + routes.PlaySynthesisLastPrefix;
      } else {
        link = routes.playPreSynthesis(this.props.brick.id);
      }
    }
    this.props.history.push(link);
  }

  renderFooter() {
    return (
      <div className="action-footer">
        <div></div>
        <div className="direction-info text-center">
          <h2>Synthesis</h2>
        </div>
        <div>
          <button type="button" className="play-preview svgOnHover play-green" onClick={this.moveToSynthesis.bind(this)}>
            <SpriteIcon name="arrow-right" className="w80 h80 active m-l-02" />
          </button>
        </div>
      </div>
    );
  }

  renderPhoneButton() {
    return (
      <div className="action-footer mobile-footer-fixed-buttons">
        <SpriteIcon name="arrow-right" className="mobile-next-button" onClick={this.moveToSynthesis.bind(this)} />
      </div>
    );
  }

  renderStepper() {
    return (
      <ReviewStepper
        noScrolling={true}
        questions={this.props.brick.questions}
        attempts={this.props.attempts}
        handleStep={() => { }}
      />
    );
  }

  render() {
    const { status, brick, attempts } = this.props;

    console.log('status proposal ', status)

    if (status === PlayStatus.Live) {
      this.moveToIntro();
    }

    return (
      <div className="brick-row-container provisional-container">
        <Hidden only={['xs']}>
          <div className="brick-container play-preview-panel provisional-score-page">
            <div className="fixed-upper-b-title"><BrickTitle title={brick.title} /></div>
            <Grid container direction="row">
              <Grid item xs={8}>
                <div className="introduction-page">
                  <h1 className="title">Provisional Score</h1>
                  {this.renderProgressBar()}
                </div>
                <div className="new-layout-footer" style={{ display: 'none' }}>
                  <div className="time-container" />
                  <div className="minutes-footer" />
                  <div className="footer-space" />
                  <div className="new-navigation-buttons">
                    <div className="n-btn next" onClick={this.moveToSynthesis.bind(this)}>
                      Next
                      <SpriteIcon name="arrow-right" />
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="introduction-info">
                  <div className="intro-text-row f-align-self-start m-t-5">
                    <ReviewStepper
                      questions={brick.questions}
                      attempts={attempts}
                      handleStep={() => { }}
                    />
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </Hidden>
        <Hidden only={['sm', 'md', 'lg', 'xl',]}>
          <div className="brick-container play-preview-panel provisional-score-page mobile-provisional-score">
            <div className="introduction-page">
              <div className="introduction-info">
                <div className="intro-text-row">
                  <span className="heading text-center">Provisional Score</span>
                  {this.renderStepper()}
                </div>
              </div>
              <div className="introduction-content">
                {this.renderProgressBar()}
                {isPhone() && this.renderPhoneButton()}
              </div>
            </div>
          </div>
        </Hidden>
      </div>
    );
  }
}

export default ProvisionalScore;
