import React from 'react';
import './NewCommentPanel.scss';

import { Brick } from 'model/brick';
import { CommentLocation } from 'model/comments';
import SpriteIcon from '../SpriteIcon';

interface NewCommentPanelProps {
  currentBrick: Brick;
  currentQuestionId?: number;
  currentLocation: CommentLocation;
  createComment(comment: any): void;
}

const NewCommentPanel: React.FC<NewCommentPanelProps> = props => {
  const [textarea] = React.useState(React.createRef() as React.RefObject<HTMLTextAreaElement>);

  const [text, setText] = React.useState("");

  const setDefaultHeight = (target: any) => {
    target.style.height = "2vw";
  }

  const handlePostComment = () => {
    props.createComment({
      text,
      brickId: props.currentBrick.id,
      questionId: props.currentQuestionId,
      location: props.currentLocation
    });
    setText("");

    const {current} = textarea;
    if (current) {
      setDefaultHeight(current);
    }
  }


  const autoResize = ({ target }: any) => {
    setDefaultHeight(target);
    target.style.height = target.scrollHeight + "px";
  }

  let className='comment-text-container';
  if (text === '') {
    className += ' disabled';
  }

  return (
    <div className={className} onClick={handlePostComment}>
      <form className="comment-text-form" onSubmit={e => { e.preventDefault(); }}>
        <textarea
          ref={textarea}
          className="comment-text-entry" placeholder="Add suggestion..." value={text}
          onClick={(e) => e.stopPropagation()}
          onChange={(evt) => setText(evt.target.value)} onInput={autoResize}
        />
      </form>
      <div className="comment-button-container">
        <div className="centered">
          <SpriteIcon name="send" />
        </div>
      </div>
    </div>
  );
};

export default NewCommentPanel;
