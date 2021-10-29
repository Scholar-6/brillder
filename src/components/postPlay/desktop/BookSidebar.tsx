import React from 'react';

import SpriteIcon from 'components/baseComponents/SpriteIcon';

import { Question } from 'model/question';
import { Brick } from 'model/brick';
import { stripHtml } from 'components/build/questionService/ConvertService';
import { BookState } from './PostDesktopPlay';
import {ReactComponent as CircleCheck} from'assets/img/circle-check.svg';
import { Annotation, AnnotationLocation, PlayAttempt } from 'model/attempt';
import CommentIndicator from 'components/build/baseComponents/CommentIndicator';
import { User } from 'model/user';


interface Props {
  user: User;
  bookState: BookState;
  brick: Brick;
  attempt: PlayAttempt;
  questions: Question[];
  activeQuestionIndex: number;
  moveToPage(s: BookState): void;
  moveToQuestion(i: number): void;
}

const BookSidebar: React.FC<Props> = ({ bookState, user, brick, questions, attempt, activeQuestionIndex, moveToPage, moveToQuestion }) => {
  const getLatestChild = (annotation: Annotation) => {
    if(!annotation.children || annotation.children.length <= 0) {
      return annotation;
    }
    const replies = annotation.children.sort((a, b) => new Date(b.timestamp).valueOf() - new Date(a.timestamp).valueOf());
    return replies[0];
  }

  const getHasReplied = (location: AnnotationLocation, questionIndex?: number) => {
    let replies = attempt.annotations?.filter(annotation => annotation.location === location)
      .map(getLatestChild)
      .sort((a, b) => new Date(b.timestamp).valueOf() - new Date(a.timestamp).valueOf());

    if (replies && replies.length > 0 && questionIndex !== undefined && questionIndex >= 0) {
      replies = replies.filter(r => r.questionIndex === questionIndex);
    }

    if (replies && replies.length > 0) {
      const latestAuthor = replies[0].user.id;
      const isCurrentUser = latestAuthor === user.id;
      return isCurrentUser ? 1 : -1;
    } else {
      return 0;
    }
  }

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
        <div className={bookState === BookState.Attempts ? 'active relative attempts' : 'relative attempts'} onClick={() => moveToPage(BookState.Attempts)}>
          <CircleCheck />
          <span className="bold">Attempts</span>
          <span className="ellipsis" />
        </div>
        <div className={bookState === BookState.Brief ? 'active relative' : 'relative'} onClick={() => moveToPage(BookState.Brief)}>
          <SpriteIcon name="crosshair" /><span className="bold">Brief</span> <span className="ellipsis">{stripHtml(brick.brief)}</span>
          <CommentIndicator replyType={getHasReplied(AnnotationLocation.Brief)} />
        </div>
        <div className={bookState === BookState.Prep ? 'active relative' : 'relative'} onClick={() => moveToPage(BookState.Prep)}>
          <SpriteIcon name="file-text" /><span className="bold">Prep</span> <span className="ellipsis">{stripHtml(brick.prep)}</span>
          <CommentIndicator replyType={getHasReplied(AnnotationLocation.Prep)} />
        </div>
        {questions.map((q, i) => <div key={i} className={`question-link relative ${bookState === BookState.QuestionPage && i === activeQuestionIndex ? 'active' : ''}`} onClick={() => moveToQuestion(i)}>
          <span className="bold">{i + 1}</span><span className="ellipsis">{stripHtml(q.firstComponent.value)}</span>
          {renderIcon(i)}
          <CommentIndicator replyType={getHasReplied(AnnotationLocation.Question, i)} />
        </div>)}
        <div className={bookState === BookState.Synthesis ? 'active relative' : 'relative'} onClick={() => moveToPage(BookState.Synthesis)}>
          <SpriteIcon name="feather-menu" /><span className="bold">Synthesis</span><span className="ellipsis">{stripHtml(brick.synthesis)}</span>
          <CommentIndicator replyType={getHasReplied(AnnotationLocation.Synthesis)} />
        </div>
      </div>
      <div className="footer" />
    </div >
  );
}

export default BookSidebar;
