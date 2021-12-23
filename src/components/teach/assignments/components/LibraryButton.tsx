import React from 'react';
import './BookButton.scss';
import SpriteIcon from 'components/baseComponents/SpriteIcon';

interface Props {
  onClick(): void;
}

const LibraryButton: React.FC<Props> = (props) => {
  return (
    <div className="teach-book-button">
      <div className="book-container" onClick={props.onClick} >
        <div className="green-hover">
          <div />
        </div>
        <SpriteIcon name="bar-chart-2" className="active" />
      </div>
      <div className="css-custom-tooltip">
        View's Library
      </div>
    </div>
  );
}

export default LibraryButton;
