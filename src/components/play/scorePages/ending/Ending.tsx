import React from "react";
import { Grid } from "@material-ui/core";
import { CircularProgressbar } from "react-circular-progressbar";
import { connect } from "react-redux";
import moment from "moment";

import "./Ending.scss";
import { CashAttempt, ClearAuthBrickCash, SetLastAttemptId } from "localStorage/play";
import { Brick } from "model/brick";
import { PlayStatus } from "../../model";
import { BrickAttempt } from "../../model";
import EndingStepper from "./EndingStepper";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { isPhone } from "services/phone";
import BrickTitle from "components/baseComponents/BrickTitle";
import routes from "../../routes";
import { prepareDuration } from "../service";
import AttemptedText from "../components/AttemptedText";
import map from "components/map";
import actions from "redux/actions/auth";
import MusicAutoplay from "components/baseComponents/MusicAutoplay";
import { GetFinishRedirectUrl, GetHeartOfMerciaUser, UnsetFinishRedirectUrl, UnsetHeartOfMerciaUser } from "localStorage/login";
import { User, UserPreferenceType } from 'model/user';
import { ReduxCombinedState } from 'redux/reducers';
import UnauthorizedUserDialogV3 from "components/baseComponents/dialogs/unauthorizedUserDialogV2/UnauthorizedUserDialogV3";


const confetti = require('canvas-confetti');

const DesktopTheme = React.lazy(() => import('./themes/ScoreDesktopTheme'));
const PhoneTheme = React.lazy(() => import('./themes/ScorePhoneTheme'));


interface EndingState {
  oldScore: number;

  liveScore: number;
  reviewScore: number;
  currentScore: number;

  fixedCurrentScore: number;
  unauthorizedOpenV2: boolean;

  isHeartOfMercia: boolean;

  isMobileSecondPart: boolean;

  interval: number | NodeJS.Timeout;
}

interface EndingProps {
  status: PlayStatus;
  brick: Brick;
  history: any;
  location: any;
  brickAttempt: BrickAttempt;
  bestScore: number;
  liveBrills: number;
  reviewBrills: number;
  assignmentId: number;

  isPlayPreview?: boolean;
  extraTry?: boolean;

  liveDuration?: null | moment.Duration;
  reviewDuration?: null | moment.Duration;

  user: User;
  loginSuccess(): void;
  move(): void;
}

class EndingPage extends React.Component<EndingProps, EndingState> {
  constructor(props: EndingProps) {
    super(props);

    const { oldScore, } = this.props.brickAttempt;

    const oldScoreNumber = oldScore ? oldScore : 0;

    let isHeartOfMercia = !!GetHeartOfMerciaUser();

    let unauthorizedOpenV2 = false;
    if (!props.user && this.props.brickAttempt) {
      unauthorizedOpenV2 = true;
      SetLastAttemptId(this.props.brickAttempt.id)
    }

    this.state = {
      oldScore: oldScoreNumber,

      currentScore: 0,
      liveScore: 0,
      reviewScore: 0,

      isMobileSecondPart: false,

      isHeartOfMercia,

      fixedCurrentScore: 0,

      unauthorizedOpenV2,

      interval: 0,
    };
  }

  lauchSmallConfetti(colors: string[]) {
    const end = Date.now() + (5 * 1000);

    (function frame() {
      confetti.default({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors
      });
      confetti.default({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }

  launchBigConfetti(colors: string[]) {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0, colors };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    }

    const interval3: any = setInterval(function () {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval3);
      }

      var particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti.default(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti.default(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  }

  runFirework(currentScore: number) {
    const { liveBrills, reviewBrills, bestScore } = this.props;
    const colors = ['#0681db', '#ffd900', '#30c474'];

    if (currentScore === 100 && (liveBrills > 0 || reviewBrills > 0)) {
      this.launchBigConfetti(colors);
    } else if (currentScore >= 50 && (liveBrills > 0 || reviewBrills > 0)) {
      if (bestScore && currentScore > bestScore) {
        this.lauchSmallConfetti(colors);
      } else if (!bestScore) {
        this.lauchSmallConfetti(colors);
      }
    }
  }

  componentDidMount() {
    const step = 3;
    const { oldScore } = this.state;
    const { score, maxScore } = this.props.brickAttempt;
    const liveScore = Math.round((oldScore * 100) / maxScore);
    const reviewScore = Math.round((score * 100) / maxScore);
    const currentScore = Math.round(((oldScore + score) * 50) / maxScore);

    const interval = setInterval(() => {
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

      this.setState({
        liveScore: tempLiveScore,
        reviewScore: tempReviewScore,
        currentScore: tempCurrentScore,
        fixedCurrentScore: currentScore
      });

      if (
        liveScore === this.state.liveScore &&
        reviewScore === tempReviewScore &&
        currentScore === tempCurrentScore
      ) {
        clearInterval(interval);
      }
    }, 100);
    this.setState({ interval });

    this.runFirework(currentScore);
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  renderStepper() {
    return (
      <EndingStepper
        questions={this.props.brick.questions}
        attempts={this.props.brickAttempt.answers}
        handleStep={(index: number) => {
          this.props.history.push(map.postAssignmentQuestion(this.props.brick.id, this.props.user.id, index))
        }}
      />
    );
  }

  moveToLibrary() {
    CashAttempt('');
    ClearAuthBrickCash();
    this.props.loginSuccess();
    this.props.history.push(map.MyLibrarySubject(this.props.brick.subjectId));
  }

  moveToHome() {
    CashAttempt('');
    ClearAuthBrickCash();
    this.props.loginSuccess();
    this.props.history.push(map.MainPage);
  }

  render() {
    const { currentScore, fixedCurrentScore } = this.state;
    const { brick } = this.props;

    if (this.props.status === PlayStatus.Live) {
      if (isPhone()) {
        this.props.history.push(routes.phonePrep(brick));
      } else {
        this.props.history.push(routes.playNewPrep(brick));
      }
    }

    const { answers, liveAnswers, score, maxScore } = this.props.brickAttempt;

    let attempted = 0;
    let numberOfFailed = 0;
    let numberOfyellow = 0;
    let numberOfcorrect = 0;
    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];
      const liveAnswer = liveAnswers?.[i] || null;
      if (answer.attempted || liveAnswer?.attempted) {
        attempted += 1;
      }
      if (answer.correct && liveAnswer?.correct) {
        numberOfcorrect += 1;
      } else if (answer.correct) {
        numberOfyellow += 1;
      } else if (liveAnswer?.correct) {
        numberOfyellow += 1;
      } else {
        numberOfFailed += 1;
      }
    }


    const renderSubTitle = () => {
      let text = '';
      if ((this.props.reviewBrills + this.props.liveBrills) === 0 && fixedCurrentScore === 100) {
        text = "You've still got it!";
      } else if (fixedCurrentScore >= 50 && (this.props.reviewBrills + this.props.liveBrills === 0)) {
        text = 'No better than your best effort!';
      } else if (fixedCurrentScore >= 95) {
        text = 'Superlative!'
      } else if (this.props.bestScore && fixedCurrentScore > this.props.bestScore && fixedCurrentScore >= 50) {
        text = 'A New High Score!';
      } else if (fixedCurrentScore >= 90) {
        text = 'Most excellent!';
      } else if (fixedCurrentScore >= 85) {
        text = 'Excellent!';
      } else if (fixedCurrentScore >= 80) {
        text = 'Admirable!'
      } else if (fixedCurrentScore >= 75) {
        text = 'Commendable!';
      } else if (fixedCurrentScore >= 70) {
        text = 'Respectable!';
      } else if (fixedCurrentScore >= 65) {
        text = 'Decent!';
      } else if (fixedCurrentScore >= 60) {
        text = 'Half decent!';
      } else if (fixedCurrentScore >= 55) {
        text = 'Something to build on!';
      } else if (fixedCurrentScore >= 50) {
        text = 'Room for improvement!';
      } else if (fixedCurrentScore >= 45) {
        text = 'Just missing the pass mark!';
      } else if (fixedCurrentScore >= 40) {
        text = 'Tough going!';
      } else if (fixedCurrentScore >= 35) {
        text = 'Very tough going!';
      } else if (fixedCurrentScore >= 30) {
        text = 'Ouch!';
      } else if (fixedCurrentScore >= 25) {
        text = 'Yikes!';
      } else if (fixedCurrentScore >= 20) {
        text = 'Call a brain ambulance!';
      } else if (fixedCurrentScore >= 15) {
        text = "You weren't even trying";
      } else if (fixedCurrentScore >= 10) {
        text = 'A monkey typing randomly would do better than that!';
      } else if (fixedCurrentScore >= 5) {
        text = 'Almost hard to do this badly - congratulations ?';
      } else if (fixedCurrentScore >= 0) {
        text = 'You have a genius, but just not for this brick!'
      }
      return text;
    }

    let brillsEarned = 0;
    if (this.props.reviewBrills > 0) {
      brillsEarned += this.props.reviewBrills;
    }
    if (this.props.liveBrills > 0) {
      brillsEarned += this.props.liveBrills;
    }

    brillsEarned = Math.round(brillsEarned);


    if (isPhone()) {
      const renderPhoneContent = () => {
        if (this.state.isMobileSecondPart) {
          return (
            <div className="phone-provisional-score bg-dark-blue">
              {brillsEarned > 0 && <MusicAutoplay url="/sounds/mixkit-magical-coin-win.wav" />}
              <div className="content">
                <div className="brick-title" dangerouslySetInnerHTML={{ __html: brick.title }} />
                <div className="score">Score: {fixedCurrentScore}</div>
                <div className="title">
                  {this.props.bestScore && this.props.bestScore > 0 && <div className="absoulte-high-score">Previous High Score: {this.props.bestScore}</div>}
                  {brillsEarned} {this.props.extraTry ? 'Extra' : ''} Brills Earned!
                </div>
                <div className="pr-progress-center">
                  <div className="pr-progress-container">
                    <div className={`brill-coin-img ${brillsEarned === 0 ? 'no-spinning' : ''}`}>
                      <img alt="brill" src={brillsEarned === 0 ? '/images/Brill-Blue.svg' : "/images/Brill.svg"} />
                      <SpriteIcon name="logo" />
                    </div>
                  </div>
                </div>
                <AttemptedText
                  attempted={attempted}
                  attemptsCount={answers.length}
                  score={this.props.brickAttempt.score}
                  maxScore={this.props.brickAttempt.maxScore}
                />
                {this.props.liveDuration && (
                  <div className="duration">
                    <SpriteIcon name="clock" />
                    <div>{prepareDuration(this.props.liveDuration)}</div>
                  </div>
                )}
                {this.props.reviewDuration && (
                  <div className="review-duration">
                    + {prepareDuration(this.props.reviewDuration)} Review
                  </div>
                )}
                {this.props.isPlayPreview ?
                  <div className="btn-container">
                    <div className="btn btn-green" onClick={this.props.move}>Next</div>
                  </div> :
                  <div className="btn-container">
                    <div className="btn btn-green orange" onClick={() => {
                      if (this.state.isHeartOfMercia) {
                        const finishUrl = GetFinishRedirectUrl();
                        if (finishUrl) {
                          window.location.href = finishUrl;
                        }
                        UnsetFinishRedirectUrl();
                        UnsetHeartOfMerciaUser();
                      } else if (this.props.user?.library) {
                        this.moveToHome();
                      } else {
                        this.moveToLibrary();
                      }
                    }}>Exit</div>
                    {!this.state.isHeartOfMercia &&
                      <div className="btn btn-green" onClick={this.props.move}>More Options</div>
                    }
                  </div>}
              </div>
            </div>
          );
        }
        return (
          <div className="phone-provisional-score">
            <div
              className="fixed-upper-b-title"
              dangerouslySetInnerHTML={{ __html: this.props.brick.title }}
            />
            <div className="header">{this.renderStepper()}</div>
            <div className="content">
              <div className="title">Your final score</div>
              <div className="hr-sub-title">
                {renderSubTitle()}
              </div>
              <div className="pr-progress-center">
                <div className="pr-progress-container">
                  <CircularProgressbar
                    className="circle-progress-first"
                    strokeWidth={4}
                    counterClockwise={true}
                    value={this.state.liveScore}
                  />
                  <Grid
                    container
                    justifyContent="center"
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
                    justifyContent="center"
                    alignContent="center"
                    className="score-circle"
                  >
                    <CircularProgressbar
                      className="circle-progress-third"
                      counterClockwise={true}
                      strokeWidth={4}
                      value={currentScore}
                    />
                  </Grid>
                  <div className="score-data">{this.state.currentScore}%</div>
                </div>
              </div>
              <div className="flex-center status-circles bold">
                <div className="lable-rd">Investigation</div>
                <div className="circle-rd yellow" />
                <div className="circle-rd green" />
                <div className="circle-rd blue" />
                <div className="lable-rd">Review</div>
              </div>
              <div className="flex-center number-status bold">
                <div>{this.state.liveScore}</div>
                <div>{currentScore}</div>
                <div>{this.state.reviewScore}</div>
              </div>
              <div className="flex-center number-status bold">
                <div>Avg.</div>
              </div>
              <div className="btn-container">
                <div className="btn btn-green" onClick={() => {
                  this.setState({ isMobileSecondPart: true })
                }}>Next</div>
              </div>
            </div>
          </div>
        );
      }

      return (
        <React.Suspense fallback={<></>}>
          <PhoneTheme />
          <MusicAutoplay url="/sounds/mixkit-deep-cinematic-subtle-drum-impact.wav" />
          {renderPhoneContent()}
        </React.Suspense>
      );
    }

    const renderAssignmentsButton = () => {
      if (this.props.user && this.props.user.userPreference?.preferenceId === UserPreferenceType.Student) {
        return <div className="btn btn-green" onClick={() => this.props.history.push("/assignments")}>See Assignments</div>;
      }
      return '';
    }

    const renderMoreButton = () => {
      if (!this.state.isHeartOfMercia) {
        if (this.props.user && this.props.user.userPreference?.preferenceId !== UserPreferenceType.Student) {
          return <div className="btn btn-green" onClick={this.props.move}>More Options</div>;
        }
      }
      return '';
    }

    return (
      <React.Suspense fallback={<></>}>
        <DesktopTheme />
        <MusicAutoplay url="/sounds/mixkit-deep-cinematic-subtle-drum-impact.wav" />
        {this.props.reviewBrills > 0 && <MusicAutoplay url="/sounds/mixkit-magical-coin-win.wav" />}
        <div className="brick-row-container ending-container">
          <div className="brick-container play-preview-panel ending-page">
            <div className="fixed-upper-b-title">
              <BrickTitle title={this.props.brick.title} />
            </div>
            <Grid container direction="row">
              <Grid item xs={8}>
                <div className="introduction-page">
                  <h2 className="title">Your final score</h2>
                  <div className="hr-sub-title">{renderSubTitle()}</div>
                  <div className="percentage-container">
                    <Grid
                      container
                      justifyContent="center"
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
                        justifyContent="center"
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
                        justifyContent="center"
                        alignContent="center"
                        className="score-circle"
                      >
                        <CircularProgressbar
                          className="circle-progress-third"
                          counterClockwise={true}
                          strokeWidth={4}
                          value={currentScore}
                        />
                      </Grid>
                      <Grid
                        container
                        justifyContent="center"
                        alignContent="center"
                        className="score-circle"
                      >
                        <div>
                          <div className="score-precentage">{currentScore}%</div>
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                  <div className="flex-center status-circles bold">
                    <div className="lable-rd">Investigation</div>
                    <div className="circle-rd yellow" />
                    <div className="circle-rd green" />
                    <div className="circle-rd blue" />
                    <div className="lable-rd">Review</div>
                  </div>
                  <div className="flex-center number-status bold">
                    <div>{this.state.liveScore}</div>
                    <div>{currentScore}</div>
                    <div>{this.state.reviewScore}</div>
                  </div>
                  <div className="flex-center number-status bold">
                    <div>Avg.</div>
                  </div>
                  {this.props.isPlayPreview ?
                    <div className="flex-center">
                      <div className="btn btn-green" onClick={this.props.move}>Next</div>
                    </div>
                    :
                    <div className="flex-center">
                      <div className="btn btn-orange" onClick={() => {
                        if (this.state.isHeartOfMercia) {
                          const finishUrl = GetFinishRedirectUrl();
                          if (finishUrl) {
                            window.location.href = finishUrl;
                          }
                          UnsetFinishRedirectUrl();
                        } else if (this.props.user?.library) {
                          this.moveToHome();
                        } else {
                          this.moveToLibrary();
                        }
                      }}>Exit</div>
                      {renderAssignmentsButton()}
                      {renderMoreButton()}
                    </div>}
                </div>
                <div className="new-layout-footer" style={{ display: "none" }}>
                  <div className="title-column provisional-title-column">
                    {this.props.liveDuration &&
                      <div className="duration">
                        <SpriteIcon name="clock" />
                        <div>{prepareDuration(this.props.liveDuration)}</div>
                      </div>
                    }
                    <AttemptedText
                      attempted={attempted}
                      attemptsCount={answers.length}
                      score={score}
                      maxScore={maxScore}
                    />
                  </div>
                  <div className="attempted-numbers">
                    <div>
                      <SpriteIcon name="cancel-custom" className="text-orange" />: {numberOfFailed}
                    </div>
                    <div>
                      <SpriteIcon name="cancel-custom" className="text-yellow" />: {numberOfyellow}
                    </div>
                    <div className={numberOfcorrect >= 1 ? "" : "text-tab-gray"}>
                      <SpriteIcon
                        name="check-icon"
                        className={numberOfcorrect >= 1 ? "text-theme-green" : "text-tab-gray"}
                      />: {numberOfcorrect}
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="introduction-info">
                  {brillsEarned > 0 &&
                    <div className="top-brill-coins">
                      <div className="brill-coin-img">
                        <img alt="brill" src="/images/Brill.svg" />
                        <SpriteIcon name="logo" />
                      </div>
                      <div className="bold">{brillsEarned} {this.props.extraTry ? 'Extra' : ''} Brills Earned!</div>
                    </div>
                  }
                  <div className="intro-text-row f-align-self-start m-t-5">
                    {this.renderStepper()}
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
        <UnauthorizedUserDialogV3
          history={this.props.history}
          brick={brick}
          isOpen={this.state.unauthorizedOpenV2}
          close={() => {
            this.setState({unauthorizedOpenV2: false});
          }}
          competitionId={-1}
          notyet={() => {
            this.setState({unauthorizedOpenV2: false});
          }}
          registered={() => {
            this.setState({unauthorizedOpenV2: false});
          }}
        />
      </React.Suspense>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

const mapDispatch = (dispatch: any) => ({
  loginSuccess: () => dispatch(actions.loginSuccess()),
});

export default connect(mapState, mapDispatch)(EndingPage);
