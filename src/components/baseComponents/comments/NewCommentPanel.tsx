import React from 'react';
import { Button } from '@material-ui/core';
import './NewCommentPanel.scss';

import { Brick } from 'model/brick';
import { CommentLocation } from 'model/comments';

interface NewCommentPanelProps {
  currentBrick: Brick;
  currentQuestionId?: number;
  currentLocation: CommentLocation;
  createComment(comment: any): void;
}

const NewCommentPanel: React.FC<NewCommentPanelProps> = props => {
  const [text, setText] = React.useState("");

  const handlePostComment = () => {
    props.createComment({
      text,
      brickId: props.currentBrick.id,
      questionId: props.currentQuestionId,
      location: props.currentLocation
    });
    setText("");
  }

  const autoResize = ({ target }: any) => {
    target.style.height = "2vw";
    target.style.height = target.scrollHeight + "px";
  }

  return (
    <div className="comment-text-container">
      <div>
        <form className="comment-text-form" onSubmit={e => { e.preventDefault(); }}>
          <textarea
            className="comment-text-entry" placeholder="Add Suggestion..." value={text}
            onChange={(evt) => setText(evt.target.value)} onInput={autoResize}
          />
        </form>
      </div>
      <div className="comment-action-buttons">
        <Button className="comment-action-button post" onClick={() => handlePostComment()} disabled={text === ""}>POST</Button>
        <Button className="comment-action-button cancel" onClick={() => setText("")} disabled={text === ""}>CLEAR</Button>
      </div>
    </div>
  );
};

export default NewCommentPanel;
