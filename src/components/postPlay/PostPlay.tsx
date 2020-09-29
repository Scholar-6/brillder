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

enum BookState {
  Closed,
  Hovered,
  QuestionPage,
}

interface ProposalProps {
  brick: Brick;
  user: User;
  canEdit: boolean;
  history: History;
  playStatus: PlayButtonStatus;
  saveBrick(): void;
  setBrickField(name: BrickFieldNames, value: string): void;
}

interface ProposalState {
  bookState: BookState;
  questionIndex: number;
  animationRunning: boolean;
}

class PostPlay extends React.Component<ProposalProps, ProposalState> {
  constructor(props: ProposalProps) {
    super(props);
    this.state = {
      bookState: BookState.Closed,
      questionIndex: 0,
      animationRunning: false,
    };
  }

  openDialog = () => this.setState({});
  closeDialog = () => this.setState({});

  onBookHover() {
    if (this.state.bookState === BookState.Closed) {
      this.setState({ bookState: BookState.Hovered });
    }
  }

  moveToQuestions() {
    this.setState({ bookState: BookState.QuestionPage, questionIndex: 0 });
  }

  nextQuestion() {
    if (this.state.animationRunning) {
      return;
    }
    this.setState({ animationRunning: true });
    setTimeout(() => {
      this.setState({
        animationRunning: false,
        questionIndex: this.state.questionIndex + 1,
      });
    }, 800);
  }

  render() {
    const { brick } = this.props;

    if (brick.title) {
      setBrillderTitle(brick.title);
    }

    const renderUserRow = () => {
      const { firstName, lastName } = this.props.user;

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
    if (this.state.bookState === BookState.Hovered) {
      bookClass += " expanded hovered";
    } else if (this.state.bookState === BookState.QuestionPage) {
      bookClass += ` expanded sheet-1`;
    }

    let questions: Question[] = [];
    for (let question of brick.questions) {
      parseQuestion(question as ApiQuestion, questions);
    }

    const renderQuestionPage = (question: Question, i: number) => {
      return (
        <div style={{ display: "flex" }}>
          <div className="question-number">
            <div>{i + 1}</div>
          </div>
          <div>
            <h2>Investigation</h2>
            <QuestionPlay question={question} answers={[]} />
          </div>
        </div>
      );
    };

    const renderAnswersPage = () => {
      return (
        <div>
          <h2>My Answer(s)</h2>
          <div style={{ display: "flex" }}>
            <div className="col">
              <h3>Attempt1</h3>
              <div>23.09.34</div>
              <div>34.09.23</div>
            </div>
            <div className="col">
              <h3>Investigation</h3>
              <div></div>
            </div>
            <div className="col">
              <h3>Review</h3>
              <div></div>
            </div>
          </div>
          <div onClick={() => this.nextQuestion()}>next</div>
        </div>
      );
    };

    const getQuestionStyle = (index: number) => {
      const scale = 1.15;
      if (this.state.bookState === BookState.QuestionPage) {
        if (index === this.state.questionIndex) {
          return { transform: `rotateY(-178deg) scale(${scale})` }
        } else if (index < this.state.questionIndex) {
          return { transform: `rotateY(-180.2deg) scale(${scale})` };
        } else if (index > this.state.questionIndex) {
          return { transform: `rotateY(1deg) scale(${scale})` };
        }
      }
      return {};
    }

    const getQuestionCoverStyle = (index: number) => {
      const scale = 1.15;
      if (this.state.bookState === BookState.QuestionPage) {
        if (index === this.state.questionIndex) {
          return { transform: `rotateY(-178.3deg) scale(${scale})` }
        } else if (index < this.state.questionIndex) {
          return { transform: `rotateY(-180.4deg) scale(${scale})` };
        } else if (index > this.state.questionIndex) {
          return { transform: `rotateY(1deg) scale(${scale})` };
        }
      }
      return {};
    }

    const getResultStyle = (index: number) => {
      const scale = 1.15;
      if (this.state.bookState === BookState.QuestionPage) {
        if (index === this.state.questionIndex) {
          return { transform: `rotateY(-4deg) scale(${scale})` }
        } else if (index < this.state.questionIndex) {
          return { transform: `rotateY(-180.2deg) scale(${scale})` };
        } else if (index > this.state.questionIndex) {
          return { transform: `rotateY(1deg) scale(${scale})` };
        }
      }
      return {};
    }

    return (
      <div className="post-play-page">
        <HomeButton onClick={() => this.openDialog()} />
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
            <div className="book-container">
              <div className="book" onMouseOver={this.onBookHover.bind(this)}>
                <div className="back"></div>
                <div className="page1">
                  <div className="flipped-page">
                    <Grid container justify="center">
                      <div className="circle-icon" style={{ background: color }} />
                    </Grid>
                    <div className="proposal-titles">
                      <div className="title">{this.props.brick.title}</div>
                      <div>{this.props.brick.subTopic}</div>
                      <div>{this.props.brick.alternativeTopics}</div>
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
                        <svg>
                          {/*eslint-disable-next-line*/}
                          <use href={sprite + "#arrow-right"} />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                {questions.map((q, i) => {
                  return (
                    <div>
                      <div className={`page3-cover ${i === 0 ? 'first' : ''}`} style={getQuestionCoverStyle(i)}></div>
                      <div className={`page3 ${i === 0 ? 'first' : ''}`} style={getQuestionStyle(i)}>
                        <div className="flipped-page question-page">
                          {renderQuestionPage(q, i)}
                        </div>
                      </div>
                      <div className="cover-page4"></div>
                      <div className={`page4 result-page ${i === 0 ? 'first' : ''}`} style={getResultStyle(i)}>
                        {renderAnswersPage()}
                      </div>
                    </div>
                  );
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
