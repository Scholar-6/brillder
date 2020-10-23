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

  return (
    <div className="comment-text-container">
      <div>
        <form className="comment-text-form" onSubmit={e => { e.preventDefault(); }}>
          <textarea
            ref={textarea}
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
