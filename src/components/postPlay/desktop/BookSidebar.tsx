import React from 'react';

import SpriteIcon from 'components/baseComponents/SpriteIcon';

import { Question } from 'model/question';
import { Brick } from 'model/brick';
import { stripHtml } from 'components/build/questionService/ConvertService';
import { BookState } from './PostDesktopPlay';
import {ReactComponent as CircleCheck} from'assets/img/circle-check.svg';
import { PlayAttempt } from 'model/attempt';


interface Props {
  bookState: BookState;
  brick: Brick;
  attempt: PlayAttempt;
  questions: Question[];
  activeQuestionIndex: number;
  moveToPage(s: BookState): void;
  moveToQuestion(i: number): void;
}

const BookSidebar: React.FC<Props> = ({ bookState, brick, questions, attempt, activeQuestionIndex, moveToPage, moveToQuestion }) => {
  const renderIcon = (i: number) => {
    try {
      if (attempt.answers[i].correct === true && attempt.liveAnswers[i].correct === true) {
        return (
          <div className="circle bg-green">
            <SpriteIcon name="check-custom" />
          </div>
        );
      } else if (attempt.answers[i].correct === true || attempt.liveAnswers[i].correct === true) {
        return (
          <div className="circle b-yellow">
            <SpriteIcon name="check-custom" />
          </div>
        );
      } else if (attempt.answers[i].marks > 0) {
        return (
          <div className="circle b-yellow">
            <SpriteIcon name="cancel-custom" />
          </div>
        );
      }
    } catch {}
    return (
      <div className="circle">
        <SpriteIcon name="cancel-custom" />
      </div>
    );
  }
  return (
    <div className="sidebar">
      <div className="header">
        <div className="flex-center">Contents</div>
        <div className="title flex-center" dangerouslySetInnerHTML={{__html: brick.title}} />
      </div>
      <div className="scroll-content pages-list">
        <div className={bookState === BookState.Attempts ? 'active attempts' : 'attempts'} onClick={() => moveToPage(BookState.Attempts)}>
          <CircleCheck />
          <span className="bold">Attempts</span>
          <span className="ellipsis" />
        </div>
        <div className={bookState === BookState.Brief ? 'active' : ''} onClick={() => moveToPage(BookState.Brief)}>
          <SpriteIcon name="crosshair" /><span className="bold">Brief</span> <span className="ellipsis">{stripHtml(brick.brief)}</span>
        </div>
        <div className={bookState === BookState.Prep ? 'active' : ''} onClick={() => moveToPage(BookState.Prep)}>
          <SpriteIcon name="file-text" /><span className="bold">Prep</span> <span className="ellipsis">{stripHtml(brick.prep)}</span>
        </div>
        {questions.map((q, i) => <div key={i} className={`question-link ${bookState === BookState.QuestionPage && i === activeQuestionIndex ? 'active' : ''}`} onClick={() => moveToQuestion(i)}>
          <span className="bold">{i + 1}</span><span className="ellipsis">{stripHtml(q.firstComponent.value)}</span>{renderIcon(i)}
        </div>)}
        <div className={bookState === BookState.Synthesis ? 'active' : ''} onClick={() => moveToPage(BookState.Synthesis)}>
          <SpriteIcon name="feather-menu" /><span className="bold">Synthesis</span><span className="ellipsis">{stripHtml(brick.synthesis)}</span>
        </div>
      </div>
      <div className="footer" />
    </div >
  );
}

export default BookSidebar;
