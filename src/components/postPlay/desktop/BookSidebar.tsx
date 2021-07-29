import React from 'react';

import SpriteIcon from 'components/baseComponents/SpriteIcon';

import { Question } from 'model/question';
import { Brick } from 'model/brick';
import { stripHtml } from 'components/build/questionService/ConvertService';
import { BookState } from './PostDesktopPlay';
import {ReactComponent as CircleCheck} from'assets/img/circle-check.svg';


interface Props {
  bookState: BookState;
  brick: Brick;
  questions: Question[];
  activeQuestionIndex: number;
  moveToPage(s: BookState): void;
  moveToQuestion(i: number): void;
}

const BookSidebar: React.FC<Props> = ({ bookState, brick, questions, activeQuestionIndex, moveToPage, moveToQuestion }) => {
  return (
    <div className="sidebar">
      <div className="header flex-center">Contents</div>
      <div className="scroll-content pages-list">
        <div className={bookState === BookState.Attempts ? 'active attempts' : 'attempts'} onClick={() => moveToPage(BookState.Attempts)}>
          <div style={{display: 'none'}}>Icons made by <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
          <div className="hr-round-container">
            <CircleCheck />
          </div>
          <span className="bold">Attempts</span>
        </div>
        <div className={bookState === BookState.Brief ? 'active' : ''} onClick={() => moveToPage(BookState.Brief)}>
          <SpriteIcon name="crosshair" /><span className="bold">Brief</span> <span className="ellipsis">{stripHtml(brick.brief)}</span>
        </div>
        <div className={bookState === BookState.Prep ? 'active' : ''} onClick={() => moveToPage(BookState.Prep)}>
          <SpriteIcon name="file-text" /><span className="bold">Prep</span> <span className="ellipsis">{stripHtml(brick.prep)}</span>
        </div>
        {questions.map((q, i) => <div key={i} className={`question-link ${bookState === BookState.QuestionPage && i === activeQuestionIndex ? 'active' : ''}`} onClick={() => moveToQuestion(i)}>
          <span className="bold">{i + 1}</span><span className="ellipsis">{stripHtml(q.firstComponent.value)}</span>
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
