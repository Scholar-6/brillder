import React from "react";
import { History } from "history";
import { connect } from "react-redux";

import { ReduxCombinedState } from "redux/reducers";
import { Brick, Subject } from "model/brick";
import { User } from "model/user";
import { getBrillderTitle } from "components/services/titleService";
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

import PageLoader from "components/baseComponents/loaders/pageLoader";

import { Helmet } from "react-helmet";
import { isMobile } from "react-device-detect";
import BookSidebar from "./desktop/BookSidebar";
import QuestionPage from "./bookPages/QuestionPage";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import SpriteIcon from "components/baseComponents/SpriteIcon";

const TabletTheme = React.lazy(() => import('./themes/PageTabletTheme'));
const DesktopTheme = React.lazy(() => import('./themes/PageDesktopTheme'));


export enum BookState {
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
  activeAttemptIndex: number;
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
      bookState: BookState.Brief,
      questionIndex: 0,
      activeAttemptIndex: 0,
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

  render() {
    if (!this.state.attempt) {
      return <PageLoader content="...Getting Attempt..." />;
    }
    const { brick } = this.state.attempt;

    if (!this.state.attempt.liveAnswers) {
      console.log('redirect has no live answers');
      return <Redirect to="/home" />;
    }

    let questions: Question[] = [];
    for (let question of brick.questions) {
      parseQuestion(question as ApiQuestion, questions);
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
              moveToPage={this.moveToPage.bind(this)}
              moveToQuestion={this.moveToQuestion.bind(this)}
            />
            <div className="content-area">
              {this.state.bookState === BookState.Brief && <div className="brief-page">
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
              </div>}
              {this.state.bookState === BookState.Prep && <div className="brief-page">
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
              </div>}
              {this.state.bookState === BookState.QuestionPage && <QuestionPage
                i={this.state.questionIndex}
                mode={this.state.mode}
                setMode={newMode => this.setState({mode: newMode})}
                activeAttempt={this.state.attempts[this.state.questionIndex]}
                question={questions[this.state.questionIndex]}
              />}
              {this.state.bookState === BookState.Synthesis && <div className="brief-page">
                <div>
                  <div className="open-question" dangerouslySetInnerHTML={{ __html: brick.openQuestion }}></div>
                  <div className="expand-title brief-title">
                    <span>Synthesis</span>
                    <div className="centered text-white">
                      <div className="round-icon b-green">
                        <SpriteIcon name="arrow-down" className="arrow" />
                      </div>
                    </div>
                  </div>
                  <div className="expanded-text" dangerouslySetInnerHTML={{ __html: brick.synthesis }} />
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
