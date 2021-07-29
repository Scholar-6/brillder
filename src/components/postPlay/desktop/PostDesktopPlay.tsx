import React from "react";
import { History } from "history";
import { connect } from "react-redux";

import { ReduxCombinedState } from "redux/reducers";
import { Brick, Subject } from "model/brick";
import { User } from "model/user";
import { getBrillderTitle } from "components/services/titleService";
import { BrickFieldNames, PlayButtonStatus } from "../../build/proposal/model";
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

import PageLoader from "components/baseComponents/loaders/pageLoader";

import { Helmet } from "react-helmet";
import { isMobile } from "react-device-detect";
import BookSidebar from "./BookSidebar";
import QuestionPage from "./QuestionPage";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import BookPages from "./BookPages";
import { getDateString, getTime } from "components/services/brickService";
import PlayGreenButton from "components/build/baseComponents/PlayGreenButton";
import routes from "components/play/routes";

const TabletTheme = React.lazy(() => import('../themes/PageTabletTheme'));
const DesktopTheme = React.lazy(() => import('../themes/PageDesktopTheme'));

export enum BookState {
  Front,
  Attempts,
  Brief,
  Prep,
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
  bookState: BookState;
  questionIndex: number;
  subjects: Subject[];
  attempts: PlayAttempt[];
  attempt: PlayAttempt | null;
  mode?: boolean; // live - false, review - true, undefined - default
  handleKey(e: any): void;
}

class PostDesktopPlay extends React.Component<ProposalProps, ProposalState> {
  constructor(props: ProposalProps) {
    super(props);

    this.state = {
      bookState: BookState.Front,
      questionIndex: 0,
      attempt: null,
      attempts: [],
      subjects: [],
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
    if (rightKeyPressed(e)) {
    } else if (leftKeyPressed(e)) {
    }
  }

  moveToPage(bookState: BookState) {
    this.setState({ bookState, questionIndex: 0 });
  }

  prepareAttempt(attempt: PlayAttempt) {
    attempt.brick.questions = attempt.brick.questions.sort((a, b) => a.order - b.order);
  }

  async loadData() {
    const { userId, brickId } = this.props.match.params;
    const subjects = await loadSubjects();
    let attempts = await getAttempts(brickId, userId);
    if (subjects && attempts && attempts.length > 0) {
      const attempt = attempts[0];
      this.prepareAttempt(attempt);
      this.setState({ attempt: attempt, attempts, subjects });
    }
  }

  setActiveAttempt(attempt: PlayAttempt, i: number) {
    try {
      this.prepareAttempt(attempt);
      this.setState({ attempt });
    } catch { }
  }

  componentDidCatch(error: any, info: any) {
    console.log(error, 'post-book', info);
    this.props.history.push('/home');
  }

  moveToQuestion(i: number) {
    this.setState({ bookState: BookState.QuestionPage, questionIndex: i });
  }

  nextQuestion() {
    if (!this.state.attempt) { return; }
    const { brick } = this.state.attempt;
    if (this.state.questionIndex < brick.questions.length - 1) {
      this.setState({ questionIndex: this.state.questionIndex + 1, mode: undefined });
    }
  }

  prevQuestion() {
    if (this.state.questionIndex > 0) {
      this.setState({ questionIndex: this.state.questionIndex - 1, mode: undefined });
    }
  }

  setAttempt(attempt: PlayAttempt) {
    try {
      this.prepareAttempt(attempt);
      this.setState({ attempt, bookState: BookState.Brief });
    } catch { }
  }

  render() {
    if (!this.state.attempt) {
      return <PageLoader content="...Getting Attempt..." />;
    }

    if (!this.state.attempt.liveAnswers) {
      console.log('redirect has no live answers');
      return <Redirect to="/home" />;
    }

    const { brick } = this.state.attempt;

    let questions: Question[] = [];
    for (let question of brick.questions) {
      parseQuestion(question as ApiQuestion, questions);
    }

    if (this.state.bookState === BookState.Front) {

      let color = "#B0B0AD";
      if (brick.subjectId) {
        const subject = this.state.subjects.find(s => s.id === brick.subjectId);
        if (subject) {
          color = subject.color;
        }
      }

      return <BookPages
        history={this.props.history} color={color} user={this.props.user} attempt={this.state.attempt} attempts={this.state.attempts}
        setAttempt={this.setAttempt.bind(this)}
      />
    }

    const renderAttempts = () => {
      return (
        <div>
          {this.state.attempts.map((a, i) => {
            let percentages = 0;
            if (typeof a.oldScore === 'undefined') {
              percentages = Math.round(a.score * 100 / a.maxScore);
            } else {
              const middleScore = (a.score + a.oldScore) / 2;
              percentages = Math.round(middleScore * 100 / a.maxScore);
            }
            let isActive = a == this.state.attempt;
            return (
              <div
                key={i}
                className={`attempt-info ${isActive && 'active'}`}
                onClick={e => {
                  e.stopPropagation();
                  this.setAttempt(a);
                }}
              >
                <div className="percentage">{percentages}</div>
                {i === 0
                  ? <span>Your latest attempt on {getDateString(a.timestamp)} at {getTime(a.timestamp)}</span>
                  : <span>Attempt on {getDateString(a.timestamp)} at {getTime(a.timestamp)}</span>
                }
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <React.Suspense fallback={<></>}>
        {isMobile ? <TabletTheme /> : <DesktopTheme />}
        <div className="post-play-page">
          <Helmet>
            <title>{getBrillderTitle(brick.title)}</title>
          </Helmet>
          <PageHeadWithMenu
            page={PageEnum.Book}
            user={this.props.user}
            placeholder="Search Ongoing Projects & Published Bricks…"
            history={this.props.history}
            search={() => { }}
            searching={(v: string) => { }}
          />
          <div className="page-content">
            <BookSidebar
              brick={brick} questions={questions}
              activeQuestionIndex={this.state.questionIndex}
              bookState={this.state.bookState}
              moveToPage={this.moveToPage.bind(this)}
              moveToQuestion={this.moveToQuestion.bind(this)}
            />
            <div className="content-area">
              {this.state.bookState === BookState.Attempts && <div className="book-page">
                <div className="real-content question-content brief-page attempt-page">
                  {renderAttempts()}
                </div>
                <div className="right-part flex-center">
                  <div className="green-button-container1" onClick={() => {
                    this.props.history.push(routes.playAssignment(brick.id, this.state.attempts[0].assignmentId));
                  }}>
                    <div className="green-button-container2">
                      <div className="play-text">Play Again</div>
                      <div className="green-button-container3">
                        <PlayGreenButton onClick={() => { }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              }
              {this.state.bookState === BookState.Brief && <div className="book-page">
                <div className="real-content question-content brief-page">
                  <div>
                    <div className="open-question" dangerouslySetInnerHTML={{ __html: brick.openQuestion }}></div>
                    <div className="expand-title brief-title">
                      <span>Brief</span>
                      <div className="centered text-white">
                        <div className="round-icon b-green">
                          <SpriteIcon name="arrow-down" className="arrow" />
                        </div>
                      </div>
                    </div>
                    <div className="expanded-text" dangerouslySetInnerHTML={{ __html: brick.brief }} />
                  </div>
                </div>
                <div className="right-part">
                </div>
              </div>}
              {this.state.bookState === BookState.Prep && <div className="book-page">
                <div className="real-content question-content brief-page">
                  <div>
                    <div className="open-question" dangerouslySetInnerHTML={{ __html: brick.openQuestion }}></div>
                    <div className="expand-title brief-title">
                      <span>Prep</span>
                      <div className="centered text-white">
                        <div className="round-icon b-green">
                          <SpriteIcon name="arrow-down" className="arrow" />
                        </div>
                      </div>
                    </div>
                    <div className="expanded-text" dangerouslySetInnerHTML={{ __html: brick.prep }} />
                  </div>
                </div>
                <div className="right-part">
                </div>
              </div>
              }
              {this.state.bookState === BookState.QuestionPage && <QuestionPage
                i={this.state.questionIndex}
                mode={this.state.mode}
                setMode={newMode => this.setState({ mode: newMode })}
                activeAttempt={this.state.attempt}
                question={questions[this.state.questionIndex]}
              />}
              {this.state.bookState === BookState.Synthesis && <div className="book-page">
                <div className="real-content question-content brief-page">
                  <div>
                    <div className="open-question" dangerouslySetInnerHTML={{ __html: brick.openQuestion }}></div>
                    <div className="expand-title brief-title synthesis-title">
                      <span>Synthesis</span>
                      <div className="centered text-white">
                        <div className="round-icon b-green">
                          <SpriteIcon name="arrow-down" className="arrow" />
                        </div>
                      </div>
                    </div>
                    <div className="expanded-text" dangerouslySetInnerHTML={{ __html: brick.synthesis }} />
                  </div>
                </div>
                <div className="right-part">
                </div>
              </div>}
            </div>
          </div>
        </div>
      </React.Suspense>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

const connector = connect(mapState);

export default connector(PostDesktopPlay);
