import React from "react";
import { History } from "history";
import { connect } from "react-redux";
import queryString from 'query-string';

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
import { checkTeacher, getDateString, getTime } from "components/services/brickService";
import PlayGreenButton from "components/build/baseComponents/PlayGreenButton";
import routes from "components/play/routes";
import BookAnnotationsPanel from "./BookAnnotationsPanel";
import { PlayMode } from "components/play/model";
import HighlightHtml, { HighlightRef } from "components/play/baseComponents/HighlightHtml";
import axios from "axios";

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
  highlightRef: React.RefObject<HighlightRef>;

  constructor(props: ProposalProps) {
    super(props);

    let bookState = BookState.Front;

    const values = queryString.parse(props.history.location.search);
    if (values.contentsAttempts) {
      bookState = BookState.Attempts;
    } else if (values.brief) {
      bookState = BookState.Brief;
    }

    this.state = {
      bookState,
      questionIndex: 0,
      attempt: null,
      attempts: [],
      mode: true,
      subjects: [],
      handleKey: this.handleKey.bind(this)
    };
    
    this.highlightRef = React.createRef();

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

  async saveAttempt(attempt: PlayAttempt) {
    const newAttempt = Object.assign({ }, attempt) as any;

    newAttempt.answers = attempt.answers.map(answer => ({ ...answer, answer: JSON.parse(JSON.parse(answer.answer)) }));
    newAttempt.liveAnswers = attempt.liveAnswers.map(answer => ({ ...answer, answer: JSON.parse(JSON.parse(answer.answer)) }));

    newAttempt.brick = undefined;
    newAttempt.student = undefined;
    newAttempt.timestamp = undefined;
    newAttempt.studentId = undefined;
    newAttempt.brickId = undefined;

    return await axios.put(
      process.env.REACT_APP_BACKEND_HOST + "/play/attempt",
      { id: attempt.id, userId: this.props.user.id, body: newAttempt },
      { withCredentials: true }
    ).catch(e => {
      if(e.response.status !== 409) {
        throw e;
      }
    });
  }

  setActiveAttempt(attempt: PlayAttempt) {
    try {
      this.prepareAttempt(attempt);

      const newAttempts = this.state.attempts;
      const attemptIdx = newAttempts.findIndex(a => a.timestamp === attempt.timestamp);
      if(attemptIdx > -1) {
        newAttempts[attemptIdx] = attempt;
      }

      this.setState({ attempt, attempts: newAttempts });
      this.saveAttempt(attempt);
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

  setAttemptBrickProperty(property: "brief" | "prep" | "synthesis", value: string) {
    const newAttempt = this.state.attempt;
    if(!newAttempt) return;
    newAttempt.brick[property] = value;
    this.setActiveAttempt(newAttempt);
  }

  renderAnnotationsPanel() {
    return (
      <BookAnnotationsPanel
        highlightRef={this.highlightRef}
        attempt={this.state.attempt ?? undefined}
        setAttempt={this.setActiveAttempt.bind(this)}
        state={this.state.bookState}
        questionIndex={this.state.questionIndex}
      />
    )
  }

  renderPlayButton(brick: Brick) {
    const isTeacher = checkTeacher(this.props.user);

    if (isTeacher) {
      return (
        <div className="green-button-container1" onClick={() => {/* commenting logic */ }}>
          <div className="green-button-container2">
            <div className="play-text">Add comment</div>
            <div className="green-button-container3">
              <button type="button" className="play-green-button bg-tab-gray">
                <SpriteIcon name="pen-tool" className="colored w60 m-0 h60 text-white" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
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
    );
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
            /* eslint-disable-next-line */
            const isActive = a == this.state.attempt;
            return (
              <div
                key={i}
                className={`attempt-info ${isActive && 'active'}`}
                onClick={e => {
                  e.stopPropagation();
                  this.setAttempt(a);
                }}
              >
                <div className="percentage">{percentages}%</div>
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
              attempt={this.state.attempt}
              bookState={this.state.bookState}
              moveToPage={this.moveToPage.bind(this)}
              moveToQuestion={this.moveToQuestion.bind(this)}
            />
            <div className="content-area">
              {this.state.bookState === BookState.Attempts && <div className="book-page">
                <div className="real-content question-content brief-page attempt-page">
                  <h2 dangerouslySetInnerHTML={{ __html: brick.title }}></h2>
                  {renderAttempts()}
                </div>
                <div className="right-part flex-center">
                  {this.renderPlayButton(brick)}
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
                    {/* <div className="expanded-text" dangerouslySetInnerHTML={{ __html: brick.brief }} /> */}
                    <HighlightHtml
                      ref={this.highlightRef}
                      value={brick.brief}
                      mode={PlayMode.UnHighlighting}
                      onHighlight={this.setAttemptBrickProperty.bind(this, "brief")}
                    />
                  </div>
                </div>
                {this.renderAnnotationsPanel()}
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
                    {/* <div className="expanded-text" dangerouslySetInnerHTML={{ __html: brick.prep }} /> */}
                    <HighlightHtml
                      ref={this.highlightRef}
                      value={brick.prep}
                      mode={PlayMode.UnHighlighting}
                      onHighlight={this.setAttemptBrickProperty.bind(this, "prep")}
                    />
                  </div>
                </div>
                {this.renderAnnotationsPanel()}
              </div>
              }
              {this.state.bookState === BookState.QuestionPage && (
                <QuestionPage
                  i={this.state.questionIndex}
                  mode={this.state.mode}
                  setMode={newMode => this.setState({ mode: newMode })}
                  activeAttempt={this.state.attempt}
                  question={questions[this.state.questionIndex]}
                >
                  {this.renderAnnotationsPanel()}
                </QuestionPage>
              )}
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
                    {/* <div className="expanded-text" dangerouslySetInnerHTML={{ __html: brick.synthesis }} /> */}
                    <HighlightHtml
                      ref={this.highlightRef}
                      value={brick.synthesis}
                      mode={PlayMode.UnHighlighting}
                      onHighlight={this.setAttemptBrickProperty.bind(this, "synthesis")}
                    />
                  </div>
                </div>
                {this.renderAnnotationsPanel()}
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
