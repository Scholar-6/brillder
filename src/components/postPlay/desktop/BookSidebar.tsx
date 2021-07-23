import React from 'react';

import SpriteIcon from 'components/baseComponents/SpriteIcon';

import { Question } from 'model/question';
import { Brick } from 'model/brick';
import { stripHtml } from 'components/build/questionService/ConvertService';
import { BookState } from '../PostDesktopPlay';


interface Props {
  brick: Brick;
  questions: Question[];
  moveToPage(s: BookState): void;
  moveToQuestion(i: number): void;
}

const BookSidebar: React.FC<Props> = ({ brick, questions, moveToPage, moveToQuestion }) => {
  return (
    <div className="sidebar">
      <div className="scroll-content pages-list">
        <div onClick={() => moveToPage(BookState.Brief)}><SpriteIcon name="crosshair" /><span className="bold">Brief</span> <span className="ellipsis">{stripHtml(brick.brief)}</span></div>
        <div onClick={() => moveToPage(BookState.Prep)}><SpriteIcon name="file-text" /><span className="bold">Prep</span> <span className="ellipsis">{stripHtml(brick.prep)}</span></div>
        {questions.map((q, i) => <div key={i} className="question-link" onClick={() => moveToQuestion(i)}>
          <span className="bold">{i + 1}</span><span className="ellipsis">{stripHtml(q.firstComponent.value)}</span>
        </div>)}
        <div onClick={() => moveToPage(BookState.Synthesis)}><SpriteIcon name="feather-menu" /><span className="bold">Synthesis</span><span className="ellipsis">{stripHtml(brick.synthesis)}</span></div>
        <div></div>
      </div>
    </div >
  );
}

export default BookSidebar;
