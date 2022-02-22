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
import { isMobile } from "react-device-detect";

const DesktopTheme = React.lazy(() => import('./themes/ScoreDesktopTheme'));

interface ProvisionalScoreProps {
  user?: User;
  history: any;
  location: any;
  isPlayPreview?: boolean;
  status: PlayStatus;
  brick: Brick;
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

    this.state = {
      value: 0,
      finalValue: Math.round((score * 100) / maxScore),
      score,
      maxScore,
      interval: null,
      handleMove: this.handleMove.bind(this),
    };
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

    if (isPhone()) {
      return (
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
            <div className="title">Provisional Score</div>
            {this.state.score < this.state.maxScore &&
              <div className="hr-sub-title">You can improve this when reviewing your answers</div>
            }
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
            <div className="attempted-numbers">
              <div>
                <SpriteIcon name="cancel-custom" className="text-orange" />:{" "}
                {numberOfFailed}
              </div>
              <div>
                <SpriteIcon name="cancel-custom" className="text-yellow" />:{" "}
                {numberOfNotZero}
              </div>
              <div className={numberOfcorrect >= 1 ? "" : "text-tab-gray"}>
                <SpriteIcon
                  name="check-icon"
                  className={numberOfcorrect >= 1 ? "text-theme-green" : "text-tab-gray"}
                />: {numberOfcorrect}
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
          </div>
        </div>
      );
    }

    const renderSubTitle = () => {
      let text = '';
      if (finalValue >= 95) {
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

    const renderContent = () => {
      if (this.props.user) {
        if (finalValue >= 50) {
          if (finalValue === 100) {
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
              <div className="brill-coin-img">
                <img alt="brill" src="/images/Brill-B.svg" />
              </div>
              <div className="bold">{this.state.value} Brills Earned!</div>
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
