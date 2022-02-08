import React from 'react';
import './BookButton.scss';
import SpriteIcon from 'components/baseComponents/SpriteIcon';

interface Props {
  onClick(): void;
}

const BookButton: React.FC<Props> = (props) => {
  return (
    <div className="teach-book-button">
      <div className="book-container" onClick={props.onClick} >
        <div className="green-hover">
          <div />
        </div>
        <SpriteIcon name="book-open" className="active" />
      </div>
      <div className="css-custom-tooltip">
        View Brick Summary
      </div>
    </div>
  );
}

export default BookButton;
