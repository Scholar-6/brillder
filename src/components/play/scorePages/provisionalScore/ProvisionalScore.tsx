import React from "react";
import { Grid } from "@material-ui/core";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { Brick } from "model/brick";
import { PlayStatus } from "../../model";

import ReviewStepper from "../../review/ReviewStepper";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { rightKeyPressed } from "components/services/key";
import { isPhone } from "services/phone";
import routes from "../../routes";
import previewRoutes from "components/playPreview/routes";
import BrickTitle from "components/baseComponents/BrickTitle";
import { User } from "model/user";
import { prepareDuration } from "../service";
import AttemptedText from "../components/AttemptedText";

const PhoneTheme = React.lazy(() => import('./themes/ScorePhoneTheme'));
const DesktopTheme = React.lazy(() => import('./themes/ScoreDesktopTheme'));

const confetti = require('canvas-confetti');

interface ProvisionalScoreProps {
  user?: User;
  history: any;
  location: any;
  isPlayPreview?: boolean;
  status: PlayStatus;
  brick: Brick;
  liveBrills: number;
  bestScore: number;
  liveDuration?: null | moment.Duration;
  attempts: any[];
  moveNext?(): void;
  moveToPrep?(): void;
}
interface ProvisionalScoreState {
  value: number;
  score: number;
  maxScore: number;
  interval: any;
  handleMove: any;
  finalValue: number;
  isMobileSecondPart: boolean;
}

class ProvisionalScore extends React.Component<
  ProvisionalScoreProps,
  ProvisionalScoreState
> {
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

    const finalValue = Math.round((score * 100) / maxScore);

    this.state = {
      value: 0,
      finalValue,
      score,
      maxScore,
      isMobileSecondPart: false,
      interval: null,
      handleMove: this.handleMove.bind(this),
    };

    const colors = ['#0681db', '#ffd900', '#30c474'];

    console.log('data', score, maxScore, props.liveBrills, finalValue);

    if (finalValue === 100 && props.liveBrills > 0) {
      const duration = 15 * 1000;
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
    } else if (finalValue >= 50 && props.liveBrills > 0) {
      if (!props.bestScore || finalValue > props.bestScore) {
        const end = Date.now() + (15 * 1000);

        (function frame() {
          confetti.default({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
          });
          confetti.default({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        }());
      }
    }
  }

  componentDidMount() {
    let step = 3;
    let percentages = Math.round(
      (this.state.score * 100) / this.state.maxScore
    );
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

  moveToIntro() {
    const brickId = this.props.brick.id;
    let link = "";
    if (this.props.isPlayPreview) {
      link = previewRoutes.previewNewPrep(brickId);
    } else {
      link = routes.playNewPrep(this.props.brick);
    }
    this.props.history.push(link);
    this.props.moveToPrep?.();
  }

  moveToSynthesis() {
    let link = "";
    if (this.props.isPlayPreview) {
      link = previewRoutes.previewSynthesis(this.props.brick.id);
    } else {
      link = routes.playPreSynthesis(this.props.brick);
    }
    this.props.history.push(link);
    this.props.moveNext?.();
  }

  render() {
    const { finalValue } = this.state;
    const { status, brick, attempts } = this.props;

    if (status === PlayStatus.Live) {
      this.moveToIntro();
    }

    let attempted = 0;

    let numberOfcorrect = 0;
    let numberOfNotZero = 0;
    let numberOfFailed = 0;

    for (let attempt of attempts) {
      if (attempt.attempted === true) {
        attempted += 1;
      }
      if (attempt.correct === true) {
        numberOfcorrect += 1;
      } else if (attempt.marks > 0) {
        numberOfNotZero += 1;
      } else {
        numberOfFailed += 1;
      }
    }

    const renderSubTitle = () => {
      let text = '';
      if (this.props.liveBrills === 0 && finalValue === 100 && this.props.bestScore === 100) {
        text = "You've still got it!";
      } else if (finalValue >= 50 && this.props.liveBrills === 0) {
        text = 'You equalled your best effort!';
      } else if (this.props.bestScore && finalValue > this.props.bestScore && finalValue >= 50) {
        text = 'A New High Score!'
      } else if (finalValue >= 95) {
        text = 'Superlative!'
      } else if (finalValue >= 90) {
        text = 'Most excellent!';
      } else if (finalValue >= 85) {
        text = 'Excellent!';
      } else if (finalValue >= 80) {
        text = 'Admirable!'
      } else if (finalValue >= 75) {
        text = 'Commendable!';
      } else if (finalValue >= 70) {
        text = 'Respectable!';
      } else if (finalValue >= 65) {
        text = 'Decent!';
      } else if (finalValue >= 60) {
        text = 'Half decent!';
      } else if (finalValue >= 55) {
        text = 'Something to build on!';
      } else if (finalValue >= 50) {
        text = 'Room for improvement!';
      } else if (finalValue >= 45) {
        text = 'Just missing the pass mark!';
      } else if (finalValue >= 40) {
        text = 'Tough going!';
      } else if (finalValue >= 35) {
        text = 'Very tough going!';
      } else if (finalValue >= 30) {
        text = 'Ouch!';
      } else if (finalValue >= 25) {
        text = 'Yikes!';
      } else if (finalValue >= 20) {
        text = 'Call a brain ambulance!';
      } else if (finalValue >= 15) {
        text = "You weren't even trying";
      } else if (finalValue >= 10) {
        text = 'A monkey typing randomly would do better than that!';
      } else if (finalValue >= 5) {
        text = 'Almost hard to do this badly - congratulations ?';
      } else if (finalValue >= 0) {
        text = 'You have a genius, but just not for this brick!'
      }
      return text;
    }

    if (isPhone()) {
      if (this.state.isMobileSecondPart) {
        return (
          <React.Suspense fallback={<></>}>
            <PhoneTheme />
            <div className="phone-provisional-score bg-dark-blue">
              <div className="content">
                <div className="title">
                  {this.props.bestScore && this.props.bestScore > 0 && <div className="absoulte-high-score">Previous High Score: {this.props.bestScore}</div>}
                  {this.props.liveBrills} Brills Earned!
                </div>
                <div className="pr-progress-center">
                  <div className="pr-progress-container">
                    <div className="brill-coin-img">
                      <img alt="brill" src="/images/Brill.svg" />
                      <SpriteIcon name="logo" />
                    </div>
                  </div>
                </div>
                <AttemptedText
                  attempted={attempted}
                  attemptsCount={attempts.length}
                  score={this.state.score}
                  maxScore={this.state.maxScore}
                />
                {this.props.liveDuration && (
                  <div className="duration">
                    <SpriteIcon name="clock" />
                    <div>{prepareDuration(this.props.liveDuration)}</div>
                  </div>
                )}
                <div className="btn btn-green bigger" onClick={this.moveToSynthesis.bind(this)}>Keep Going!</div>
              </div>
            </div>
          </React.Suspense>
        );
      }

      if (this.props.user) {
        if (this.state.finalValue >= 50) {
          if (this.state.finalValue === 100) {
            if (this.props.liveBrills === 0) {
              return (
                <React.Suspense fallback={<></>}>
                  <PhoneTheme />
                  <div className="phone-provisional-score">
                    <div
                      className="fixed-upper-b-title"
                      dangerouslySetInnerHTML={{ __html: this.props.brick.title }}
                    />
                    <div className="header">
                      <ReviewStepper
                        noScrolling={true}
                        questions={this.props.brick.questions}
                        attempts={this.props.attempts}
                        handleStep={() => { }}
                      />
                    </div>
                    <div className="content">
                      <div className="title">Wow - a perfect score!</div>
                      <div className="hr-sub-title">
                        {renderSubTitle()}
                      </div>
                      <div className="pr-progress-center">
                        <div className="pr-progress-container">
                          <CircularProgressbar
                            className="circle-progress"
                            strokeWidth={4}
                            counterClockwise={true}
                            value={this.state.value}
                          />
                          <div className="score-data">{this.state.value}%</div>
                        </div>
                      </div>
                      <div className="bold bottom-text-d4">
                        <div>
                          <div>You already got full marks on this brick, so you can't earn any more brills.</div>
                        </div>
                      </div>
                      <div className="btn btn-green" onClick={() => this.setState({ isMobileSecondPart: true })}>Next</div>
                    </div>
                  </div>
                </React.Suspense>
              );
            }
            return (
              <React.Suspense fallback={<></>}>
                <PhoneTheme />
                <div className="phone-provisional-score">
                  <div
                    className="fixed-upper-b-title"
                    dangerouslySetInnerHTML={{ __html: this.props.brick.title }}
                  />
                  <div className="header">
                    <ReviewStepper
                      noScrolling={true}
                      questions={this.props.brick.questions}
                      attempts={this.props.attempts}
                      handleStep={() => { }}
                    />
                  </div>
                  <div className="content">
                    <div className="title">Wow - a perfect score!</div>
                    <div className="hr-sub-title">
                      {renderSubTitle()}
                    </div>
                    <div className="pr-progress-center">
                      <div className="pr-progress-container">
                        <CircularProgressbar
                          className="circle-progress"
                          strokeWidth={4}
                          counterClockwise={true}
                          value={this.state.value}
                        />
                        <div className="score-data">{this.state.value}%</div>
                      </div>
                    </div>
                    <div className="bold bottom-text-d4">
                      <div>
                        <div>Claim your perfect score bonus by reading the Synthesis of this brick.</div>
                      </div>
                    </div>
                    <div className="btn btn-green" onClick={() => this.setState({ isMobileSecondPart: true })}>Claim now</div>
                  </div>
                </div>
              </React.Suspense>
            );
          }
          if (this.props.liveBrills === 0) {
            return (
              <React.Suspense fallback={<></>}>
                <PhoneTheme />
                <div className="phone-provisional-score">
                  <div
                    className="fixed-upper-b-title"
                    dangerouslySetInnerHTML={{ __html: this.props.brick.title }}
                  />
                  <div className="header">
                    <ReviewStepper
                      noScrolling={true}
                      questions={this.props.brick.questions}
                      attempts={this.props.attempts}
                      handleStep={() => { }}
                    />
                  </div>
                  <div className="content">
                    <div className="title">Your score so far ...</div>
                    <div className="hr-sub-title">
                      {renderSubTitle()}
                    </div>
                    <div className="pr-progress-center">
                      <div className="pr-progress-container">
                        <CircularProgressbar
                          className="circle-progress"
                          strokeWidth={4}
                          counterClockwise={true}
                          value={this.state.value}
                        />
                        <div className="score-data">{this.state.value}%</div>
                      </div>
                    </div>
                    <div className="bold bottom-text-d4">
                      <div>
                        <div>Improve your score to earn more brills.</div>
                      </div>
                    </div>
                    <div className="btn btn-green" onClick={() => this.setState({ isMobileSecondPart: true })}>Boost</div>
                  </div>
                </div>
              </React.Suspense>
            );
          }
          return (
            <React.Suspense fallback={<></>}>
              <PhoneTheme />
              <div className="phone-provisional-score">
                <div
                  className="fixed-upper-b-title"
                  dangerouslySetInnerHTML={{ __html: this.props.brick.title }}
                />
                <div className="header">
                  <ReviewStepper
                    noScrolling={true}
                    questions={this.props.brick.questions}
                    attempts={this.props.attempts}
                    handleStep={() => { }}
                  />
                </div>
                <div className="content">
                  <div className="title">Your score so far...</div>
                  <div className="hr-sub-title">
                    {renderSubTitle()}
                  </div>
                  <div className="pr-progress-center">
                    <div className="pr-progress-container">
                      <CircularProgressbar
                        className="circle-progress"
                        strokeWidth={4}
                        counterClockwise={true}
                        value={this.state.value}
                      />
                      <div className="score-data">{this.state.value}%</div>
                    </div>
                  </div>
                  <div className="bold bottom-text-d4">
                    <div>
                      <div>Now read the Synthesis and boost </div>
                      <div>your Brills in the Review stage.</div>
                    </div>
                  </div>
                  <div className="btn btn-green" onClick={() => this.setState({ isMobileSecondPart: true })}>Boost</div>
                </div>
              </div>
            </React.Suspense>
          );
        }
        return (
          <React.Suspense fallback={<></>}>
            <PhoneTheme />
            <div className="phone-provisional-score">
              <div
                className="fixed-upper-b-title"
                dangerouslySetInnerHTML={{ __html: this.props.brick.title }}
              />
              <div className="header">
                <ReviewStepper
                  noScrolling={true}
                  questions={this.props.brick.questions}
                  attempts={this.props.attempts}
                  handleStep={() => { }}
                />
              </div>
              <div className="content">
                <div className="title">Your score so far...</div>
                <div className="hr-sub-title">
                  {renderSubTitle()}
                </div>
                <div className="pr-progress-center">
                  <div className="pr-progress-container">
                    <CircularProgressbar
                      className="circle-progress"
                      strokeWidth={4}
                      counterClockwise={true}
                      value={this.state.value}
                    />
                    <div className="score-data">{this.state.value}%</div>
                  </div>
                </div>
                <div className="bold bottom-text-d4">
                  <div>
                    <div>Score {100 - this.state.finalValue}% in the Review stage to start</div>
                    <div>earning Brills.</div>
                  </div>
                </div>
                <div className="btn btn-green bigger" onClick={() => this.moveToSynthesis()}>Keep Going!</div>
              </div>
            </div>
          </React.Suspense>
        );
      }

      if (this.state.finalValue >= 50) {
        return (
          <React.Suspense fallback={<></>}>
            <PhoneTheme />
            <div className="phone-provisional-score">
              <div
                className="fixed-upper-b-title"
                dangerouslySetInnerHTML={{ __html: this.props.brick.title }}
              />
              <div className="header">
                <ReviewStepper
                  noScrolling={true}
                  questions={this.props.brick.questions}
                  attempts={this.props.attempts}
                  handleStep={() => { }}
                />
              </div>
              <div className="content">
                <div className="title">You could earn {this.state.value} Brills!</div>
                <div className="hr-sub-title">
                  {renderSubTitle()}
                </div>
                <div className="pr-progress-center">
                  <div className="pr-progress-container">
                    <div className="brill-coin-img">
                      <img alt="brill" src="/images/Brill.svg" />
                      <SpriteIcon name="logo" />
                    </div>
                  </div>
                </div>
                <div className="bold bottom-text-d4">
                  <div>
                    <div>Sign up at the end of the Synthesis to</div>
                    <div>bank your Brills.</div>
                  </div>
                </div>
                <div className="btn-center">
                  <div className="btn btn-green bigger" onClick={() => this.moveToSynthesis()}>
                    Read Synthesis
                  </div>
                </div>
              </div>
            </div>
          </React.Suspense>
        );
      }

      return (
        <React.Suspense fallback={<></>}>
          <PhoneTheme />
          <div className="phone-provisional-score">
            <div
              className="fixed-upper-b-title"
              dangerouslySetInnerHTML={{ __html: this.props.brick.title }}
            />
            <div className="header">
              <ReviewStepper
                noScrolling={true}
                questions={this.props.brick.questions}
                attempts={this.props.attempts}
                handleStep={() => { }}
              />
            </div>
            <div className="content">
              <div className="title">Your score so far...</div>
              <div className="hr-sub-title">
                {renderSubTitle()}
              </div>
              <div className="pr-progress-center">
                <div className="pr-progress-container">
                  <CircularProgressbar
                    className="circle-progress"
                    strokeWidth={4}
                    counterClockwise={true}
                    value={this.state.value}
                  />
                  <div className="score-data">{this.state.value}%</div>
                </div>
              </div>
              <div className="bold bottom-text-d4">
                <div>
                  <div>Read the Synthesis and sign up to see</div>
                  <div>where you went wrong.</div>
                </div>
              </div>
              <div className="btn btn-green bigger" onClick={() => this.moveToSynthesis()}>Keep Going!</div>
            </div>
          </div>
        </React.Suspense>
      );
    }

    const renderContent = () => {
      if (this.props.user) {
        if (finalValue >= 50) {
          if (finalValue === 100) {
            if (this.props.liveBrills === 0) {
              return (
                <div className="introduction-page">
                  <h2 className="title">Wow - a perfect score!</h2>
                  <div className="hr-sub-title provisional-sub-title">
                    {renderSubTitle()}
                  </div>
                  <div className="percentage-container">
                    <Grid
                      container
                      justify="center"
                      alignContent="center"
                      className="circle-progress-container"
                    >
                      <CircularProgressbar
                        className={`circle-progress ${this.state.value === 100 ? 'green' : ''}`}
                        strokeWidth={4}
                        counterClockwise={true}
                        value={this.state.value}
                      />
                      <div className="score-data">
                        <Grid container justify="center" alignContent="center">
                          <div>
                            <div className="score-precentage">
                              {this.state.value}%
                            </div>
                          </div>
                        </Grid>
                      </div>
                    </Grid>
                  </div>
                  <div className="bold bottom-text">You already got full marks on this brick, so you can't earn any more brills.</div>
                  <div className="flex-center">
                    <div className="btn bottom-btn btn-green" onClick={this.moveToSynthesis.bind(this)}>
                      Next
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <div className="introduction-page">
                <h2 className="title">Wow - a perfect score!</h2>
                <div className="hr-sub-title provisional-sub-title">
                  {renderSubTitle()}
                </div>
                <div className="percentage-container">
                  <Grid
                    container
                    justify="center"
                    alignContent="center"
                    className="circle-progress-container"
                  >
                    <CircularProgressbar
                      className={`circle-progress ${this.state.value === 100 ? 'green' : ''}`}
                      strokeWidth={4}
                      counterClockwise={true}
                      value={this.state.value}
                    />
                    <div className="score-data">
                      <Grid container justify="center" alignContent="center">
                        <div>
                          <div className="score-precentage">
                            {this.state.value}%
                          </div>
                        </div>
                      </Grid>
                    </div>
                  </Grid>
                </div>
                <div className="bold bottom-text">Claim your perfect score bonus by reading the Synthesis of this brick.</div>
                <div className="flex-center">
                  <div className="btn bottom-btn btn-green" onClick={this.moveToSynthesis.bind(this)}>
                    Claim now
                  </div>
                </div>
              </div>
            );
          }
          if (this.props.liveBrills === 0) {
            return (
              <div className="introduction-page">
                <h2 className="title">Your score so far ...</h2>
                <div className="hr-sub-title provisional-sub-title">
                  {renderSubTitle()}
                </div>
                <div className="percentage-container">
                  <Grid
                    container
                    justify="center"
                    alignContent="center"
                    className="circle-progress-container"
                  >
                    <CircularProgressbar
                      className="circle-progress"
                      strokeWidth={4}
                      counterClockwise={true}
                      value={this.state.value}
                    />
                    <div className="score-data">
                      <Grid container justify="center" alignContent="center">
                        <div>
                          <div className="score-precentage">
                            {this.state.value}%
                          </div>
                        </div>
                      </Grid>
                    </div>
                  </Grid>
                </div>
                <div className="bold bottom-text">Improve your score to earn more brills.</div>
                <div className="flex-center">
                  <div className="btn bottom-btn btn-green" onClick={this.moveToSynthesis.bind(this)}>
                    Boost
                  </div>
                </div>
              </div>
            );
          }
          return (
            <div className="introduction-page">
              <h2 className="title">Your score so far ...</h2>
              <div className="hr-sub-title provisional-sub-title">
                {renderSubTitle()}
              </div>
              <div className="percentage-container">
                <Grid
                  container
                  justify="center"
                  alignContent="center"
                  className="circle-progress-container"
                >
                  <CircularProgressbar
                    className="circle-progress"
                    strokeWidth={4}
                    counterClockwise={true}
                    value={this.state.value}
                  />
                  <div className="score-data">
                    <Grid container justify="center" alignContent="center">
                      <div>
                        <div className="score-precentage">
                          {this.state.value}%
                        </div>
                      </div>
                    </Grid>
                  </div>
                </Grid>
              </div>
              <div className="bold bottom-text">Now read the synthesis and boost your Brills in the Review stages.</div>
              <div className="flex-center">
                <div className="btn bottom-btn btn-green" onClick={this.moveToSynthesis.bind(this)}>
                  Boost
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="introduction-page">
            <h2 className="title">Your score so far ...</h2>
            <div className="hr-sub-title provisional-sub-title">
              {renderSubTitle()}
            </div>
            <div className="percentage-container">
              <Grid
                container
                justify="center"
                alignContent="center"
                className="circle-progress-container"
              >
                <CircularProgressbar
                  className="circle-progress"
                  strokeWidth={4}
                  counterClockwise={true}
                  value={this.state.value}
                />
                <div className="score-data">
                  <Grid container justify="center" alignContent="center">
                    <div>
                      <div className="score-precentage">
                        {this.state.value}%
                      </div>
                    </div>
                  </Grid>
                </div>
              </Grid>
            </div>
            <div className="bold bottom-text">Score {100 - finalValue}% in the Review stage to start earning Brills.</div>
            <div className="flex-center">
              <div className="btn bottom-btn btn-green" onClick={this.moveToSynthesis.bind(this)}>
                Keep Going!
              </div>
            </div>
          </div>
        );
      }

      if (finalValue >= 50) {
        return (
          <div className="introduction-page">
            <h2 className="title">You could earn {this.state.value} Brills!</h2>
            <div className="hr-sub-title provisional-sub-title">
              {renderSubTitle()}
            </div>
            <div className="brill-coin-img">
              <img alt="brill" src="/images/Brill.svg" />
              <SpriteIcon name="logo" />
            </div>
            <div className="bold bottom-text">Sign up at the end of the Synthesis to bank your Brills.</div>
            <div className="flex-center">
              <div className="btn bottom-btn btn-green" onClick={this.moveToSynthesis.bind(this)}>
                Read Synthesis
              </div>
            </div>
          </div>
        );
      }

      // < 50
      return (
        <div className="introduction-page">
          <h2 className="title">Your score so far ...</h2>
          <div className="hr-sub-title provisional-sub-title">
            {renderSubTitle()}
          </div>
          <div className="percentage-container">
            <Grid
              container
              justify="center"
              alignContent="center"
              className="circle-progress-container"
            >
              <CircularProgressbar
                className="circle-progress"
                strokeWidth={4}
                counterClockwise={true}
                value={this.state.value}
              />
              <div className="score-data">
                <Grid container justify="center" alignContent="center">
                  <div>
                    <div className="score-precentage">
                      {this.state.value}%
                    </div>
                  </div>
                </Grid>
              </div>
            </Grid>
          </div>
          <div className="bold bottom-text">Read the Synthesis and sign up to see where you went wrong.</div>
          <div className="flex-center">
            <div className="btn bottom-btn btn-green" onClick={this.moveToSynthesis.bind(this)}>
              Keep Going!
            </div>
          </div>
        </div>
      )
    }

    const renderTopPartSidebar = () => {
      if (finalValue >= 50) {
        if (this.props.user) {
          return (
            <div className="top-brill-coins">
              {this.props.bestScore && this.props.bestScore > 0 &&
                <div className="absolute-high-score">
                  Previous High Score: {this.props.bestScore}
                </div>}
              <div className="brill-coin-img">
                <img alt="brill" src="/images/Brill-B.svg" />
              </div>
              <div className="bold">{this.props.liveBrills} Brills Earned!</div>
            </div>
          );
        }
        return (
          <div className="percentage-container">
            <Grid
              container
              justify="center"
              alignContent="center"
              className="circle-progress-container"
            >
              <CircularProgressbar
                className="circle-progress"
                strokeWidth={6}
                counterClockwise={true}
                value={this.state.value}
              />
              <div className="score-data">
                <Grid container justify="center" alignContent="center">
                  <div>
                    <div className="score-precentage bold">
                      {this.state.value}%
                    </div>
                  </div>
                </Grid>
              </div>
            </Grid>
          </div>
        );
      }
      return <div className="m-t-5" />;
    }

    return (
      <React.Suspense fallback={<></>}>
        <DesktopTheme />
        <div className="brick-row-container provisional-container" >
          <div className="brick-container play-preview-panel provisional-score-page">
            <div className="fixed-upper-b-title">
              <BrickTitle title={brick.title} />
            </div>
            <Grid container direction="row">
              <Grid item xs={8}>
                {renderContent()}
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
                      attemptsCount={attempts.length}
                      score={this.state.score}
                      maxScore={this.state.maxScore}
                    />
                  </div>
                  <div className="attempted-numbers">
                    <div>
                      <SpriteIcon name="cancel-custom" className="text-orange" />: {numberOfFailed}
                    </div>
                    <div>
                      <SpriteIcon name="cancel-custom" className="text-yellow" />: {numberOfNotZero}
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
                  {renderTopPartSidebar()}
                  <div className="intro-text-row f-align-self-start">
                    <ReviewStepper
                      questions={brick.questions}
                      attempts={attempts}
                      isProvisional={true}
                      handleStep={() => { }}
                    />
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </React.Suspense>
    );
  }
}

export default ProvisionalScore;
