import React from "react";
import Grid from "@material-ui/core/Grid";
import { History } from "history";
import { connect } from "react-redux";

import sprite from "assets/img/icons-sprite.svg";
import "./PostPlay.scss";
import { ReduxCombinedState } from "redux/reducers";
import { Brick } from "model/brick";
import { User } from "model/user";
import { setBrillderTitle } from "components/services/titleService";

import HomeButton from "components/baseComponents/homeButton/HomeButton";
import QuestionPlay from "components/play/questionPlay/QuestionPlay";
import { BrickFieldNames, PlayButtonStatus } from "../proposal/model";
import {
  ApiQuestion,
  parseQuestion,
} from "components/build/questionService/QuestionService";
import { Question } from "model/question";
import { getAttempts } from "components/services/axios/attempt";
import { AttemptAnswer, PlayAttempt } from "model/attempt";
import PageLoader from "components/baseComponents/loaders/pageLoader";
import { getHours, getMinutes, getFormattedDate } from "components/services/brickService";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { Redirect } from "react-router-dom";

enum BookState {
  Titles,
  QuestionPage,
}

interface ProposalProps {
  brick: Brick;
  user: User;
  canEdit: boolean;
  history: History;
  match: any;
  playStatus: PlayButtonStatus;
  saveBrick(): void;
  setBrickField(name: BrickFieldNames, value: string): void;
}

interface ProposalState {
  closeTimeout: number;
  bookHovered: boolean;
  bookState: BookState;
  questionIndex: number;
  animationRunning: boolean;
  attempt: PlayAttempt | null;
  mode: boolean; // live - false, review - true
}

class PostPlay extends React.Component<ProposalProps, ProposalState> {
  constructor(props: ProposalProps) {
    super(props);
    this.state = {
      bookState: BookState.Titles,
      questionIndex: 0,
      animationRunning: false,
      mode: false,
      attempt: null,
      closeTimeout: -1,
      bookHovered: false
    };

    this.loadData();
  }

  async loadData() {
    const {userId, brickId} = this.props.match.params;
    let attempts = await getAttempts(brickId, userId);
    if (attempts) {
      this.setState({attempt: attempts[attempts.length - 1]})
    }
  }

  openDialog = () => this.setState({});
  closeDialog = () => this.setState({});

  onBookHover() { 
    clearTimeout(this.state.closeTimeout);
    if (!this.state.bookHovered) {
      this.setState({ bookHovered: true });
    }
  }

  onBookClose() {
    const closeTimeout = setTimeout(() => {
      this.setState({ bookHovered: false });
    }, 400);
    this.setState({ closeTimeout });
  }

  moveToQuestions() {
    this.setState({ bookState: BookState.QuestionPage, questionIndex: 0 });
  }

  nextQuestion(brick: Brick) {
    if (this.state.animationRunning) {
      return;
    }
    if (this.state.questionIndex < brick.questions.length - 1) {
      this.setState({ questionIndex: this.state.questionIndex + 1, animationRunning: true });
      setTimeout(() => this.setState({ animationRunning: false }), 1200);
    }
  }

  prevQuestion() {
    if (this.state.animationRunning) {
      return;
    }
    if (this.state.questionIndex > 0) {
      this.setState({ questionIndex: this.state.questionIndex - 1, animationRunning: true });
      setTimeout(() => this.setState({ animationRunning: false }), 1200);
    }
  }

  getAttemptStatus(answers: AttemptAnswer[]) {
    return !answers.find(a => a.correct === false);
  }

  render() {
    if (!this.state.attempt) {
      return <PageLoader content="...Getting Attempt..." />;
    }
    const { brick, student, timestamp } = this.state.attempt;

    if (!this.state.attempt.liveAnswers) {
      return <Redirect to="/home" />;
    }

    let answers = this.state.attempt.liveAnswers;
    if (this.state.mode) {
      answers = this.state.attempt.answers;
    }

    if (brick.title) {
      setBrillderTitle(brick.title);
    }

    const renderUserRow = () => {
      const { firstName, lastName } = student;

      return (
        <div className="names-row">
          {firstName ? firstName + " " : ""}
          {lastName ? lastName : ""}
        </div>
      );
    };

    let color = "#B0B0AD";
    if (brick.subject) {
      color = brick.subject.color;
    }

    let bookClass = "book-main-container";
    if (this.state.bookHovered) {
      if (this.state.bookState === BookState.Titles) {
        bookClass += " expanded hovered";
      } else if (this.state.bookState === BookState.QuestionPage) {
        bookClass += ` expanded question-attempt`;
      }
    }

    let questions: Question[] = [];
    for (let question of brick.questions) {
      parseQuestion(question as ApiQuestion, questions);
    }

    const renderQuestionPage = (question: Question, i: number) => {
      let parsedAnswers = null;
      try {
        parsedAnswers = JSON.parse(JSON.parse(answers[i].answer));
      } catch {}

      let attempt = Object.assign({}, this.state.attempt) as any;
      attempt.answer = parsedAnswers;

      return (
        <div
          className={`page3 ${i === 0 ? 'first' : ''}`}
          style={getQuestionStyle(i)}
          onClick={this.prevQuestion.bind(this)}
        >
          <div className="flipped-page question-page">
            <div style={{ display: "flex" }}>
              <div className="question-number">
                <div>{i + 1}</div>
              </div>
              <div>
                <h2>Investigation</h2>
                <QuestionPlay
                  question={question}
                  attempt={attempt}
                  isBookPreview={true}
                  answers={parsedAnswers}
                />
              </div>
            </div>
          </div>
        </div>
      );
    };

    const renderAnswersPage = (i: number) => {
      return (
        <div
          className={`page4 result-page ${i === 0 ? 'first' : ''}`}
          style={getResultStyle(i)}
          onClick={() => this.nextQuestion(brick)}
        >
          <h2>My Answer(s)</h2>
          <div style={{ display: "flex" }}>
            <div className="col">
              <h3>Attempt1</h3>
              <div className="bold">{getFormattedDate(timestamp)}</div>
              <div>{getHours(timestamp)}:{getMinutes(timestamp)}</div>
            </div>
            <div className="col">
              <h3 className="centered">Investigation</h3>
              <div className="centered">
                {this.state.attempt?.liveAnswers[i].correct
                  ? <SpriteIcon name="ok" className="text-theme-green" />
                  : <SpriteIcon name="cancel" className="text-theme-orange" />
                }
                {
                  this.state.mode
                    ? <SpriteIcon name="eye-off" className="text-tab-gray active" onClick={e => {
                        e.stopPropagation();
                        this.setState({mode: false});
                      }} />
                    : <SpriteIcon name="eye-on" className="text-theme-dark-blue" />
                }
              </div>
            </div>
            <div className="col">
              <h3 className="centered">Review</h3>
              <div className="centered">
                {this.state.attempt?.answers[i].correct
                  ? <SpriteIcon name="ok" className="text-theme-green" />
                  : <SpriteIcon name="cancel" className="text-theme-orange" />
                }
                {
                  this.state.mode
                    ? <SpriteIcon name="eye-on" className="text-theme-dark-blue" />
                    : <SpriteIcon name="eye-off" className="text-tab-gray active" onClick={e => {
                        e.stopPropagation();
                        this.setState({mode: true})
                      }} />
                }
              </div>
            </div>
          </div>
        </div>
      );
    };

    const getQuestionStyle = (index: number) => {
      const scale = 1.15;
      if (this.state.bookHovered && this.state.bookState === BookState.QuestionPage) {
        if (index === this.state.questionIndex) {
          return { transform: `rotateY(-178deg) scale(${scale})` }
        } else if (index < this.state.questionIndex) {
          return { transform: `rotateY(-178.2deg) scale(${scale})` };
        } else if (index > this.state.questionIndex) {
          return { transform: `rotateY(-3deg) scale(${scale})` };
        }
      }
      return {};
    }

    const getQuestionCoverStyle = (index: number) => {
      const scale = 1.15;
      if (this.state.bookHovered && this.state.bookState === BookState.QuestionPage) {
        if (index === this.state.questionIndex) {
          return { transform: `rotateY(-178.1deg) scale(${scale})` }
        } else if (index < this.state.questionIndex) {
          return { transform: `rotateY(-178.2deg) scale(${scale})` };
        } else if (index > this.state.questionIndex) {
          return { transform: `rotateY(-3.7deg) scale(${scale})` };
        }
      }
      return {};
    }

    const getResultStyle = (index: number) => {
      const scale = 1.15;
      if (this.state.bookHovered && this.state.bookState === BookState.QuestionPage) {
        if (index === this.state.questionIndex) {
          return { transform: `rotateY(-4deg) scale(${scale})` }
        } else if (index < this.state.questionIndex) {
          return { transform: `rotateY(-178.3deg) scale(${scale})` };
        } else if (index > this.state.questionIndex) {
          return { transform: `rotateY(-3deg) scale(${scale})` };
        }
      }
      return {};
    }

    return (
      <div className="post-play-page">
        <HomeButton onClick={() => this.props.history.push('/')} />
        <Grid
          container
          direction="row"
          style={{ height: "100% !important" }}
          justify="center"
        >
          <Grid className="main-text-container">
            <h1>This book is yours.</h1>
            <h2>Hover your mouse over the cover to see</h2>
            <h2>a summary of your results.</h2>
          </Grid>
          <div className={bookClass}>
            <div className="book-container" onMouseOut={this.onBookClose.bind(this)}>
              <div className="book" onMouseOver={this.onBookHover.bind(this)}>
                <div className="back"></div>
                <div className="page1">
                  <div className="flipped-page">
                    <Grid container justify="center">
                      <div className="circle-icon" style={{ background: color }} />
                    </Grid>
                    <div className="proposal-titles">
                      <div className="title">{brick.title}</div>
                      <div>{brick.subTopic}</div>
                      <div>{brick.alternativeTopics}</div>
                    </div>
                  </div>
                </div>
                <div className="page2">
                  <div className="normal-page">
                    <div className="normal-page-container">
                      <h2>OVERALL</h2>
                      <h2>STATS, AVGs</h2>
                      <h2>etc.</h2>
                      <div
                        className="bottom-button"
                        onClick={this.moveToQuestions.bind(this)}
                      >
                        View Questions
                        <SpriteIcon name="arrow-right" />
                      </div>
                    </div>
                  </div>
                </div>
                {questions.map((q, i) => {
                  if (i <= this.state.questionIndex + 1 && i >= this.state.questionIndex - 1) {
                    return (
                      <div key={i}>
                        {i === 0 ? <div className="page3-cover first" style={getQuestionCoverStyle(i)}></div> : ""}
                        {renderQuestionPage(q, i)}
                        {renderAnswersPage(i)}
                      </div>
                    );
                  } else {
                    return <div key={i}></div>
                  }
                })}

                <div className="page6"></div>
                <div className="page5"></div>
                <div className="front-cover"></div>
                <div className="front">
                  <div className="page-stitch" style={{ background: color }}>
                    <div className="vertical-line"></div>
                    <div className="horizontal-line top-line-1"></div>
                    <div className="horizontal-line top-line-2"></div>
                    <div className="horizontal-line bottom-line-1"></div>
                    <div className="horizontal-line bottom-line-2"></div>
                  </div>
                  <Grid
                    container
                    justify="center"
                    alignContent="center"
                    style={{ height: "100%" }}
                  >
                    <div style={{ width: "100%" }}>
                      <div className="image-background-container">
                        <div className="book-image-container">
                          <svg style={{ color: color }}>
                            {/*eslint-disable-next-line*/}
                            <use href={sprite + "#brick-icon"} />
                          </svg>
                        </div>
                      </div>
                      <div className="brick-title">{brick.title}</div>
                      {renderUserRow()}
                    </div>
                  </Grid>
                </div>
              </div>
            </div>
          </div>
        </Grid>
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

const connector = connect(mapState);

export default connector(PostPlay);
