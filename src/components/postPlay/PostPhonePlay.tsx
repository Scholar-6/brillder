import React from "react";
import Grid from "@material-ui/core/Grid";
import { History } from "history";
import { connect } from "react-redux";
import queryString from 'query-string';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';

import { PlayMode } from "components/play/model";
import HighlightHtml from "components/play/baseComponents/HighlightHtml";
import { ReduxCombinedState } from "redux/reducers";
import { Brick, Subject } from "model/brick";
import { User } from "model/user";
import { getBrillderTitle } from "components/services/titleService";
import { BrickFieldNames, PlayButtonStatus } from "../build/proposal/model";
import {
  ApiQuestion,
  parseQuestion,
} from "components/build/questionService/QuestionService";
import { Question } from "model/question";
import { getAttempts } from "services/axios/attempt";
import { PlayAttempt } from "model/attempt";
import { Redirect } from "react-router-dom";
import { loadSubjects } from "components/services/subject";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import PageLoader from "components/baseComponents/loaders/pageLoader";

import IntroBriefPage from "./bookPages/IntroBriefPage";
import IntroPrepPage from "./bookPages/IntroPrepPage";
import FrontPage from "./bookPages/FrontPage";
import TitlePage from "./bookPages/TitlePage";
import OverallPage from "./bookPages/OverallPage";
import QuestionPage from "./bookPages/QuestionPage";
import AnswersPage from "./bookPages/AnswersPage";
import SynthesisPage from "./bookPages/SynthesisPage";
import PlayGreenButton from "components/build/baseComponents/PlayGreenButton";
import routes from "components/play/routes";
import { Helmet } from "react-helmet";
import AttemptsPhonePage from "./bookPages/AttemptsPhonePage";

import PhoneQuestionHead from "./phone/PhoneQuestionHead";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";

const MobileTheme = React.lazy(() => import('./themes/PageMobileTheme'));

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
  swiper: any;
  bookHovered: boolean;
  bookState: BookState;
  questionIndex: number;
  activeAttemptIndex: number;
  subjects: Subject[];
  attempts: PlayAttempt[];
  attempt: PlayAttempt | null;
  mode?: boolean; // live - false, review - true, undefined - default
  playHovered: boolean;
  showLibraryButton: boolean;
}

class PostPlay extends React.Component<ProposalProps, ProposalState> {
  constructor(props: ProposalProps) {
    super(props);

    let showLibraryButton = true;
    const values = queryString.parse(props.history.location.search);
    if (values.fromTeach) {
      showLibraryButton = false;
    }

    this.state = {
      bookState: BookState.Titles,
      questionIndex: 0,
      activeAttemptIndex: 0,
      attempt: null,
      bookHovered: false,
      attempts: [],
      subjects: [],
      swiper: null,
      playHovered: false,
      showLibraryButton,
    };
    this.loadData();
  }

  movePage(bookState: BookState) {
    this.setState({ bookState });
  }

  prepareAttempt(attempt: PlayAttempt) {
    attempt.brick.questions = attempt.brick.questions.sort((a, b) => a.order - b.order);
  }

  async loadData() {
    const { userId, brickId } = this.props.match.params;
    const subjects = await loadSubjects();
    let attempts = await getAttempts(brickId, userId);
    if (subjects && attempts && attempts.length > 0) {
      const attempt = attempts[this.state.activeAttemptIndex];
      this.prepareAttempt(attempt);
      this.setState({ attempt: attempt, attempts, subjects });
    }
  }

  setActiveAttempt(attempt: PlayAttempt, i: number) {
    try {
      this.prepareAttempt(attempt);
      this.setState({ attempt, activeAttemptIndex: i });
    } catch { }
  }

  componentDidCatch(error: any, info: any) {
    console.log(error, info);
    this.props.history.push('/home');
  }

  moveToTitles() {
    this.setState({ bookState: BookState.Titles });
  }

  moveToAttempts() {
    this.setState({ bookState: BookState.Attempts });
  }

  moveToQuestion(questionIndex: number) {
    this.setState({ bookState: BookState.QuestionPage, bookHovered: true, questionIndex });
  }

  moveToQuestions() {
    this.setState({ bookState: BookState.QuestionPage, questionIndex: 0 });
  }

  moveBackToQuestions() {
    this.setState({ bookState: BookState.QuestionPage });
  }

  moveToIntroduction() {
    this.setState({ bookState: BookState.Introduction, questionIndex: 0 });
  }

  moveToSynthesis() {
    this.setState({ bookState: BookState.Synthesis });
  }

  nextQuestion() {
    if (!this.state.attempt) { return; }
    const { brick } = this.state.attempt;
    if (this.state.questionIndex < brick.questions.length - 1) {
      this.setState({ questionIndex: this.state.questionIndex + 1, mode: undefined });
    } else {
      this.moveToSynthesis();
    }
  }

  prevQuestion() {
    if (this.state.questionIndex === 0) {
      this.moveToIntroduction();
    }
    if (this.state.questionIndex > 0) {
      this.setState({ questionIndex: this.state.questionIndex - 1, mode: undefined });
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

    let color = "#B0B0AD";
    if (brick.subjectId) {
      const subject = this.state.subjects.find(s => s.id === brick.subjectId);
      if (subject) {
        color = subject.color;
      }
    }

    let bookClass = "book-main-container";
    if (this.state.bookHovered) {
      const { bookState } = this.state;
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

    return (
      <React.Suspense fallback={<></>}>
        <MobileTheme />
        <div className="post-play-page">
          <Helmet>
            <title>{getBrillderTitle(brick.title)}</title>
          </Helmet>
          <PageHeadWithMenu
            page={PageEnum.Book}
            user={this.props.user}
            placeholder="Search Ongoing Projects & Published Bricks…"
            history={this.props.history}
            search={() => {}}
            searching={() => {}}
          />
          {/*
          {this.state.bookHovered

            ? <div className="home-button-container">
              <button type="button" className="btn btn-transparent svgOnHover home-button">
                <SpriteIcon name="corner-up-left" className="return-arrow" />
              </button>
            </div>
            :  <HomeButton onClick={() => this.props.history.push('/')} />
          }*/}
          <div className="book-navigator">
            <div className="prep-tab" onClick={this.moveToTitles.bind(this)}>
              <SpriteIcon name="file-text" />
            </div>
            {questions.map((q, i) => <div className="question-tab" onClick={() => this.moveToQuestion(i)}>
              {i + 1} {this.state.attempts[0].answers[i].correct ? <SpriteIcon name="ok" className="text-theme-green" /> : <SpriteIcon name="cancel-custom" className="text-orange" />}
            </div>)}
          </div>
          {!this.state.bookHovered ?
            <Grid
              container
              direction="row"
              style={{ height: "100% !important" }}
              justify="center"
            >
              <Grid className="main-text-container">
                <h1>This book is yours.</h1>
                <h2>Click on the cover to see a summary</h2>
                <h2>of your results.</h2>
                <div className="button-container">
                {/*this.state.showLibraryButton &&
                  <button onClick={() => this.props.history.push(map.MyLibrary + '?subjectId=' + brick.subjectId)}>
                    View it in my library
                </button>*/}
                </div>
              </Grid>
              <div className={bookClass}>
                <div className="book-container">
                  <div className="book">
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
                              onClick={() =>
                                this.props.history.push(
                                  routes.playAssignment(brick.id, this.state.attempts[this.state.activeAttemptIndex].assignmentId)
                                )
                              }
                            >
                              <div className={`custom-hover-container ${this.state.playHovered ? 'hovered' : ''}`}></div>
                              <PlayGreenButton onClick={() => { }} />
                            </div>
                          </div>
                          <div className="play-text">Play Again</div>
                        </div>
                      </div>
                    </div>
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
                          setMode={mode => this.setState({ mode })}
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
                    <SynthesisPage synthesis={brick.synthesis} onClick={this.moveBackToQuestions.bind(this)} />
                    <div className="book-page last-question-cover">
                      <div className="green-button-container1">
                        <div className="green-button-container2">
                          <div className="green-button-container3"
                            onClick={() =>
                              this.props.history.push(
                                routes.playAssignment(brick.id, this.state.attempts[this.state.activeAttemptIndex].assignmentId)
                              )
                            }
                          >
                            <div className={`custom-hover-container ${this.state.playHovered ? 'hovered' : ''}`}></div>
                            <PlayGreenButton onClick={() => { }} />
                          </div>
                        </div>
                        <div className="play-text">Play Again</div>
                      </div>
                    </div>
                    <FrontPage brick={brick} student={student} color={color} onClick={() => {
                      this.setState({ bookHovered: true });
                      this.moveToAttempts.bind(this)
                    }} />
                  </div>
                </div>
              </div>
            </Grid>
            : <div>
              <Swiper
                slidesPerView={1}
                loop={true}
                loopedSlides={20}
                pagination={{ clickable: true }}
                onClick={(e) => { }}
                onSwiper={swiper => {
                  this.setState({ ...this.state, swiper });
                }}
              >
                <SwiperSlide>
                  <div className="mobile-attempts">
                    <div className="green-button-container1">
                      <div className="green-button-container2">
                        <div className="play-text">Play Again</div>
                        <div className="green-button-container3"
                          onClick={() =>
                            this.props.history.push(
                              routes.playAssignment(brick.id, this.state.attempts[this.state.activeAttemptIndex].assignmentId)
                            )
                          }
                        >
                          <PlayGreenButton onClick={() => { }} />
                        </div>
                      </div>
                    </div>
                    <AttemptsPhonePage
                      attempts={this.state.attempts}
                      index={this.state.activeAttemptIndex}
                      setActiveAttempt={this.setActiveAttempt.bind(this)}
                      onClick={this.moveToIntroduction.bind(this)}
                    />
                    <div className="footer">
                      Swipe to view Questions <SpriteIcon name="flaticon-swipe" />
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="mobile-attempts">
                    <div className="header" dangerouslySetInnerHTML={{ __html: brick.title }}></div>
                    <div className="scroll-content">
                      <div className="open-question" dangerouslySetInnerHTML={{ __html: brick.openQuestion }}></div>
                      <div className="expand-title" style={{ marginTop: '4vh' }}>
                        <span>Brief</span>
                        <div className="centered text-white">
                          <div className="round-icon b-green">
                            <SpriteIcon name="arrow-down" className="arrow" />
                          </div>
                        </div>
                      </div>
                      <div className="expanded-text">
                        <HighlightHtml
                          value={brick.brief}
                          mode={PlayMode.Normal}
                          onHighlight={() => { }}
                        />
                      </div>
                    </div>
                    <div className="footer">
                      Swipe to view Questions <SpriteIcon name="flaticon-swipe" />
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="mobile-attempts">
                    <div className="header" dangerouslySetInnerHTML={{ __html: brick.title }}></div>
                    <div className="scroll-content">
                      <div className="expand-title" style={{ marginTop: '4vh' }}>
                        <span>Prep</span>
                        <div className="centered text-white">
                          <div className="round-icon b-green">
                            <SpriteIcon name="arrow-down" className="arrow" />
                          </div>
                        </div>
                      </div>
                      <div className="expanded-text">
                        <HighlightHtml
                          value={brick.prep}
                          mode={PlayMode.Normal}
                          onHighlight={() => { }}
                        />
                      </div>
                    </div>
                    <div className="footer">
                      Swipe to view Questions <SpriteIcon name="flaticon-swipe" />
                    </div>
                  </div>
                </SwiperSlide>
                {questions.map((q, i) => (
                  <SwiperSlide key={i + 5}>
                    <div className="mobile-attempts question">
                      <PhoneQuestionHead
                        i={i}
                        title={brick.title}
                        mode={this.state.mode}
                        activeAttempt={this.state.attempt}
                        setMode={mode => this.setState({ mode })}
                      />
                      <div className="scroll-content">
                        <QuestionPage
                          i={i}
                          question={q}
                          questionIndex={this.state.questionIndex}
                          activeAttempt={this.state.attempt as any}
                          mode={this.state.mode}
                          bookHovered={this.state.bookHovered}
                          bookState={this.state.bookState}
                          prevQuestion={this.prevQuestion.bind(this)}
                        />
                      </div>
                      <div className="footer">
                        Swipe to view Questions <SpriteIcon name="flaticon-swipe" />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
                <SwiperSlide>
                  <div className="mobile-attempts">
                    <div className="header">Synthesis</div>
                    <div className="scroll-content">
                      <div className="expanded-text">
                        <HighlightHtml
                          value={brick.synthesis}
                          mode={PlayMode.Normal}
                          onHighlight={() => { }}
                        />
                      </div>
                    </div>
                    <div className="footer">
                      Swipe to view Questions <SpriteIcon name="flaticon-swipe" />
                    </div>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          }
        </div>
      </React.Suspense>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

const connector = connect(mapState);

export default connector(PostPlay);
