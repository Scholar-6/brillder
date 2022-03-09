import React from 'react';
import { Grid } from '@material-ui/core';
import { Helmet } from 'react-helmet';

import map from 'components/map';
import { checkTeacher, getDateString, getTime } from "components/services/brickService";
import { getBrillderTitle } from 'components/services/titleService';
import { PlayAttempt } from 'model/attempt';
import { UserPreferenceType, User } from 'model/user';

import HomeButton from 'components/baseComponents/homeButton/HomeButton';
import PlayGreenButton from "components/build/baseComponents/PlayGreenButton";
import FrontPage from '../FrontPage';
import routes from 'components/play/routes';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { CashAttempt } from 'localStorage/play';

const DesktopTheme = React.lazy(() => import('../themes/PageDesktopTheme'));
const DesktopBookTheme = React.lazy(() => import('../themes/PageBookDesktopTheme'));

interface BookProps {
  user: User;
  attempt: PlayAttempt;
  attempts: PlayAttempt[];
  color: string;
  history: any;
  setAttempt(attempt: PlayAttempt): void;
}

interface BookState {
  closeTimeout: number,
  firstHoverTimeout: number,
  isFirstHover: boolean;
  bookHovered: boolean;
  animationRunning: boolean;
  pageFlipDelay: number;
}

class BookPages extends React.Component<BookProps, BookState> {
  constructor(props: BookProps) {
    super(props);

    this.state = {
      closeTimeout: -1,
      firstHoverTimeout: -1,
      animationRunning: false,
      isFirstHover: true,
      bookHovered: false,
      pageFlipDelay: 1200
    }
  }

  onBookHover() {
    clearTimeout(this.state.closeTimeout);
    if (this.state.isFirstHover) {
      if (this.state.firstHoverTimeout === -1) {
        const firstHoverTimeout = setTimeout(() => {
          this.setState({ firstHoverTimeout: -1, isFirstHover: false, bookHovered: true });
        }, 600);
        this.setState({ firstHoverTimeout });
      }
    } else {
      if (!this.state.bookHovered) {
        this.setState({ bookHovered: true, animationRunning: true });
        setTimeout(() => { this.setState({ animationRunning: false }) }, this.state.pageFlipDelay);
      }
    }
  }

  onBookClose() {
    const closeTimeout = setTimeout(() => {
      this.setState({ bookHovered: false });
    }, 400);
    this.setState({ closeTimeout });
  }

  renderPlayButton() {
    const { brick } = this.props.attempt;
    const isTeacher = checkTeacher(this.props.user);
    if (isTeacher) {
      return (
        <div className="green-button-container1" onClick={() => {/* commenting logic */ }}>
          <div className="green-button-container2">
            <div className="play-text">Add comment</div>
            <div className="green-button-container3">
              <button type="button" className="play-green-button bg-tab-gray">
                <SpriteIcon name="pen-tool" className="colored w60 h60 text-white" />
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="green-button-container1" onClick={() => {
        CashAttempt('');
        this.props.history.push(routes.playAssignment(brick, this.props.attempt.assignmentId));
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
    const { color } = this.props;
    const { brick, student } = this.props.attempt;

    const isOwner = student.id === this.props.user.id;

    let bookClass = "book-main-container";

    if (this.state.bookHovered) {
      bookClass += " expanded hovered";
    }

    if (!this.state.bookHovered || this.state.animationRunning) {
      bookClass += ' closed';
    }

    return (
      <React.Suspense fallback={<></>}>
        <DesktopTheme />
        <DesktopBookTheme />
        <div className="post-play-page">
          <HomeButton history={this.props.history} link={map.MainPage} />
          <Helmet>
            <title>{getBrillderTitle(brick.title)}</title>
          </Helmet>
          <Grid
            container
            direction="row"
            style={{ height: "100% !important" }}
            justify="center"
          >
            <Grid className="main-text-container">
              <h1>{isOwner ? 'This book is yours.' : <span>This is <span className="capitalize">{student.firstName} {student.lastName}{student.lastName[student.lastName.length - 1] === 's' ? '' : "'s"}</span> book</span>}</h1>
              <h2>Hover your mouse over the cover to</h2>
              <h2>see a summary of your results.</h2>
              <button onClick={() => this.props.history.push(map.MyLibrary + '/' + student.id + '?subjectId=' + brick.subjectId)}>
                View it in {isOwner ? 'my' : 'their'} library
              </button>
            </Grid>
            <div className={bookClass}>
              <div className="book-container" onMouseOut={this.onBookClose.bind(this)}>
                <div className="book" onMouseOver={this.onBookHover.bind(this)}>
                  <div className="back"></div>
                  <div className="page6"></div>
                  <div className="page5"></div>
                  <div className="front-cover"></div>
                  <div className="page1">
                    <div className="flipped-page">
                      <div className="flex-center" style={{ height: '100%' }}>
                        {this.props.user.userPreference?.preferenceId !== UserPreferenceType.Teacher  && this.renderPlayButton()}
                      </div>
                    </div>
                  </div>
                  <div className="page4-attempts">
                    {this.props.attempts.map((a, i) => {
                      let percentages = 0;
                      if (typeof a.oldScore === 'undefined') {
                        percentages = Math.round(a.score * 100 / a.maxScore);
                      } else {
                        const middleScore = (a.score + a.oldScore) / 2;
                        percentages = Math.round(middleScore * 100 / a.maxScore);
                      }
                      return (
                        <div
                          key={i}
                          className="attempt-info"
                          onClick={e => {
                            e.stopPropagation();
                            this.props.setAttempt(a);
                          }}
                        >
                          <div className="percentage">{percentages}</div>
                          {i === 0
                            ? <span>Your latest attempt on {getDateString(a.timestamp)} at {getTime(a.timestamp)}</span>
                            : <span>Attempt on {getDateString(a.timestamp)} at {getTime(a.timestamp)}</span>
                          }
                        </div>
                      );
                    }
                    )}
                  </div>
                  <FrontPage brick={brick} student={student} color={color} />
                </div>
              </div>
            </div>
          </Grid>
        </div>
      </React.Suspense >
    )
  }
}

export default BookPages;
