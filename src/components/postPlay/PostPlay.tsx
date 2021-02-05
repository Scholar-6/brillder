import React from "react";
import Grid from "@material-ui/core/Grid";
import { History } from "history";
import { connect } from "react-redux";

import "./PostPlay.scss";
import { ReduxCombinedState } from "redux/reducers";
import { Brick, Subject } from "model/brick";
import { User } from "model/user";
import { setBrillderTitle } from "components/services/titleService";
import { BrickFieldNames, PlayButtonStatus } from "../build/proposal/model";
import { leftKeyPressed, rightKeyPressed } from "components/services/key";
import {
  ApiQuestion,
  parseQuestion,
} from "components/build/questionService/QuestionService";
import { Question } from "model/question";
import { getAttempts } from "services/axios/attempt";
import { PlayAttempt } from "model/attempt";
import { Redirect } from "react-router-dom";
import { loadSubjects } from "components/services/subject";

import HomeButton from "components/baseComponents/homeButton/HomeButton";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import PageLoader from "components/baseComponents/loaders/pageLoader";

import IntroBriefPage from "./bookPages/IntroBriefPage";
import IntroPrepPage from "./bookPages/IntroPrepPage";
import FrontPage from "./bookPages/FrontPage";
import TitlePage from "./bookPages/TitlePage";
import OverallPage from "./bookPages/OverallPage";
import AttemptsPage from "./bookPages/AttemptsPage";
import QuestionPage from "./bookPages/QuestionPage";
import AnswersPage from "./bookPages/AnswersPage";
import SynthesisPage from "./bookPages/SynthesisPage";
import map from "components/map";
import PlayGreenButton from "components/build/baseComponents/PlayGreenButton";

export enum BookState {
  Titles,
  Attempts,
  Introduction,
  QuestionPage,
  Synthesis
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
  isFirstHover: boolean;
  firstHoverTimeout: number;
  closeTimeout: number;
  bookHovered: boolean;
  bookState: BookState;
  questionIndex: number;
  animationRunning: boolean;
  activeAttemptIndex: number;
  pageFlipDelay: number;
  subjects: Subject[];
  attempts: PlayAttempt[];
  attempt: PlayAttempt | null;
  mode?: boolean; // live - false, review - true, undefined - default
  playHovered: boolean;
  handleKey(e: any): void;
}

class PostPlay extends React.Component<ProposalProps, ProposalState> {
  constructor(props: ProposalProps) {
    super(props);
    this.state = {
      bookState: BookState.Titles,
      questionIndex: 0,
      animationRunning: false,
      activeAttemptIndex: 0,
      attempt: null,
      closeTimeout: -1,
      bookHovered: false,
      isFirstHover: true,
      pageFlipDelay: 1200,
      attempts: [],
      subjects: [],
      firstHoverTimeout: -1,
      playHovered: false,
      handleKey: this.handleKey.bind(this)
    };
    this.loadData();
  }

  componentDidMount() {
    document.addEventListener("keydown", this.state.handleKey, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.state.handleKey, false);
  }

  handleKey(e: any) {
    let {bookState} = this.state;
    let newState = -1;
    if (rightKeyPressed(e)) {
      if (bookState === BookState.Titles) {
        newState = BookState.Attempts;
      } else if (bookState === BookState.Attempts) {
        newState = BookState.Introduction;
      } else if (bookState === BookState.Introduction) {
        newState = BookState.QuestionPage;
      } else if (bookState === BookState.QuestionPage) {
        this.nextQuestion();
      }
      if (newState !== -1) {
        this.movePage(newState);
        if (this.state.animationRunning) { return; }
        this.setState({ bookState: newState, animationRunning: true });
        this.animationFlipRelease();
      }
    } else if (leftKeyPressed(e)) {
      if (bookState === BookState.Attempts) {
        newState = BookState.Titles;
      } else if (bookState === BookState.Introduction) {
        newState = BookState.Attempts;
      } else if (bookState === BookState.QuestionPage) {
        this.prevQuestion();
      } else if (bookState === BookState.Synthesis) {
        newState = BookState.QuestionPage;
      }
      if (newState !== -1) {
        this.movePage(newState);
      }
    }
  }

  movePage(bookState: BookState) {
    if (this.state.animationRunning) { return; }
    this.setState({ bookState, animationRunning: true });
    this.animationFlipRelease();
  }

  prepareAttempt(attempt:  PlayAttempt) {
    attempt.brick.questions = attempt.brick.questions.sort((a, b) => a.order - b.order);
  }

  async loadData() {
    const {userId, brickId} = this.props.match.params;
    const subjects = await loadSubjects();
    let attempts = await getAttempts(brickId, userId);
    if (subjects && attempts && attempts.length > 0) {
      const attempt = attempts[this.state.activeAttemptIndex];
      this.prepareAttempt(attempt);
      this.setState({attempt: attempt, attempts, subjects});
    }
  }

  setActiveAttempt(attempt: PlayAttempt, i: number) {
    try {
      this.prepareAttempt(attempt);
      this.setState({attempt, activeAttemptIndex: i});
    } catch {}
  }

  componentDidCatch(error: any, info: any) {
    console.log(error, info);
    this.props.history.push('/home');
  }

  openDialog = () => this.setState({});
  closeDialog = () => this.setState({});

  onBookHover() { 
    clearTimeout(this.state.closeTimeout);
    if (this.state.isFirstHover) {
      if (this.state.firstHoverTimeout === -1) {
        const firstHoverTimeout = setTimeout(() => {
          this.setState({firstHoverTimeout: -1, isFirstHover: false, bookHovered: true });
        }, 600);
        this.setState({ firstHoverTimeout });
      }
    } else {
      if (!this.state.bookHovered) {
        this.setState({ bookHovered: true, animationRunning: true });
        setTimeout(() => { this.setState({animationRunning: false}) }, this.state.pageFlipDelay);
      }
    }
  }

  onBookClose() {
    const closeTimeout = setTimeout(() => {
      this.setState({ bookHovered: false });
    }, 400);
    this.setState({ closeTimeout });
  }

  
  animationFlipRelease() {
    setTimeout(() => this.setState({ animationRunning: false }), this.state.pageFlipDelay);
  }

  moveToTitles() {
    if (this.state.animationRunning) { return; }
    this.setState({ bookState: BookState.Titles, animationRunning: true });
    this.animationFlipRelease();
  }

  moveToAttempts() {
    if (this.state.animationRunning) { return; }
    this.setState({ bookState: BookState.Attempts, animationRunning: true });
    this.animationFlipRelease();
  }

  moveToQuestions() {
    if (this.state.animationRunning) { return; }
    this.setState({ bookState: BookState.QuestionPage, questionIndex: 0, animationRunning: true });
    this.animationFlipRelease();
  }

  moveBackToQuestions() {
    if (this.state.animationRunning) { return; }
    this.setState({ bookState: BookState.QuestionPage, animationRunning: true });
    this.animationFlipRelease();
  }

  moveToIntroduction() {
    if (this.state.animationRunning) { return; }
    this.setState({ bookState: BookState.Introduction, questionIndex: 0, animationRunning: true });
    this.animationFlipRelease();
  }

  moveToSynthesis() {
    if (this.state.animationRunning) { return; }
    this.setState({ bookState: BookState.Synthesis, animationRunning: true });
    this.animationFlipRelease();
  }

  nextQuestion() {
    if (!this.state.attempt) { return; }
    const {brick} = this.state.attempt;
    if (this.state.animationRunning) { return; }
    if (this.state.questionIndex < brick.questions.length - 1) {
      this.setState({ questionIndex: this.state.questionIndex + 1, mode: undefined, animationRunning: true });
      this.animationFlipRelease();
    } else {
      this.moveToSynthesis();
    }
  }

  prevQuestion() {
    if (this.state.animationRunning) { return; }
    if (this.state.questionIndex === 0) {
      this.moveToIntroduction();
    }
    if (this.state.questionIndex > 0) {
      this.setState({ questionIndex: this.state.questionIndex - 1, mode: undefined, animationRunning: true });
      this.animationFlipRelease();
    }
  }

  render() {
    if (!this.state.attempt) {
      return <PageLoader content="...Getting Attempt..." />;
    }
    const { brick, student } = this.state.attempt;

    if (!this.state.attempt.liveAnswers) {
      console.log('redirect has no live answers');
      return <Redirect to="/home" />;
    }

    if (brick.title) {
      setBrillderTitle(brick.title);
    }

    let color = "#B0B0AD";
    if (brick.subjectId) {
      const subject = this.state.subjects.find(s => s.id === brick.subjectId);
      if (subject) {
        color = subject.color;
      }
    }

    let bookClass = "book-main-container";
    if (this.state.bookHovered) {
      const {bookState} = this.state;
      if (bookState === BookState.Titles) {
        bookClass += " expanded hovered";
      } else if (bookState === BookState.Attempts) {
        bookClass += " expanded attempts-list";
      } else if (bookState === BookState.Introduction) {
        bookClass += " expanded introduction";
      } else if (bookState === BookState.QuestionPage) {
        bookClass += ` expanded question-attempt`;
      } else if (bookState === BookState.Synthesis) {
        bookClass += ` expanded synthesis`;
      }
    }

    let questions: Question[] = [];
    for (let question of brick.questions) {
      parseQuestion(question as ApiQuestion, questions);
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

    const renderBookMark = () => {
      if (!this.state.bookHovered) return '';
      const {bookState} = this.state;
      if (bookState === BookState.QuestionPage || bookState === BookState.Introduction || bookState === BookState.Synthesis) {
        return (
          <SpriteIcon
            name="custom-bookmark"
            className={`bookmark ${this.state.animationRunning ? "hidden" : ""}`}
          />
        );
      }
      return '';
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
            <h2>Hover your mouse over the cover to</h2>
            <h2>see a summary of your results.</h2>
            <button onClick={() => this.props.history.push(map.MyLibrary + '?subjectId=' + brick.subjectId)}>
              View it in my library
            </button>
          </Grid>
          <div className={bookClass}>
            <div className="book-container" onMouseOut={this.onBookClose.bind(this)}>
              <div className="book" onMouseOver={this.onBookHover.bind(this)}>
                <div className="back"></div>
                <TitlePage brick={brick} color={color} />
                <OverallPage onClick={this.moveToAttempts.bind(this)} />
                <IntroBriefPage brick={brick} color={color} onClick={this.moveToAttempts.bind(this)} />
                <IntroPrepPage brick={brick} color={color} onClick={this.moveToQuestions.bind(this)} />
                <div className="page3-empty" onClick={this.moveToTitles.bind(this)}>
                  <div className="flipped-page">
                    <div className="green-button-container1">
                      <div className="green-button-container2">
                        <div className="green-button-container3"
                          onMouseEnter={() => this.setState({playHovered: true})}
                          onMouseLeave={() => this.setState({playHovered: false})}
                          onClick={() =>
                            this.props.history.push(
                              map.playAssignment(brick.id, this.state.attempts[this.state.activeAttemptIndex].assignmentId)
                            )
                          }
                        >
                          <div className={`custom-hover-container ${this.state.playHovered ? 'hovered' : ''}`}></div>
                          <PlayGreenButton onClick={() => {}} />
                        </div>
                      </div>
                      <div className="play-text">Play Again</div>
                    </div>
                  </div>
                </div>
                {renderBookMark()}
                <AttemptsPage
                  attempts={this.state.attempts}
                  index={this.state.activeAttemptIndex}
                  setActiveAttempt={this.setActiveAttempt.bind(this)}
                  onClick={this.moveToIntroduction.bind(this)}
                />
                {questions.map((q, i) => {
                  if (i <= this.state.questionIndex + 1 && i >= this.state.questionIndex - 1) {
                    let res = [];
                    if (i === 0) {
                      res.push(<div className="page3-cover first" style={getQuestionCoverStyle(i)}></div>);
                    }
                    if (this.state.attempt) {
                      res.push(<QuestionPage
                        i={i}
                        question={q}
                        questionIndex={this.state.questionIndex}
                        activeAttempt={this.state.attempt}
                        mode={this.state.mode}
                        bookHovered={this.state.bookHovered}
                        bookState={this.state.bookState}
                        prevQuestion={this.prevQuestion.bind(this)}
                      />);
                    }
                    res.push(<AnswersPage
                      i={i}
                      mode={this.state.mode}
                      isLast={questions.length - 1 === i}
                      questionIndex={this.state.questionIndex}
                      activeAttempt={this.state.attempt}
                      bookHovered={this.state.bookHovered}
                      bookState={this.state.bookState}
                      setMode={mode => this.setState({mode})}
                      nextQuestion={this.nextQuestion.bind(this)}
                    />);
                    return res;
                  } else {
                    return <div key={i} className={`question${i}`}></div>
                  }
                })}

                <div className="page6"></div>
                <div className="page5"></div>
                <div className="front-cover"></div>
                <SynthesisPage synthesis={brick.synthesis} onClick={this.moveBackToQuestions.bind(this)}/>
                <div className="book-page last-question-cover">
                  <div className="green-button-container1">
                    <div className="green-button-container2">
                      <div className="green-button-container3"
                        onMouseEnter={() => this.setState({playHovered: true})}
                        onMouseLeave={() => this.setState({playHovered: false})}
                        onClick={() =>
                          this.props.history.push(
                            map.playAssignment(brick.id, this.state.attempts[this.state.activeAttemptIndex].assignmentId)
                          )
                        }
                      >
                        <div className={`custom-hover-container ${this.state.playHovered ? 'hovered' : ''}`}></div>
                        <PlayGreenButton onClick={() => {}} />
                      </div>
                    </div>
                    <div className="play-text">Play Again</div>
                  </div>
                </div>
                <FrontPage brick={brick} student={student} color={color} />
               </div>
            </div>
          </div>
          <div className={`arrow-description ${this.state.bookHovered ? 'shown' : 'hidden'}`}>
            Click or use arrow keys to flick through your book
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
