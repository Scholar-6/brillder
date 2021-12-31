import React from 'react';
import './BookButton.scss';
import SpriteIcon from 'components/baseComponents/SpriteIcon';

interface Props {
  firstName: string;
  onClick(): void;
}

const LibraryButton: React.FC<Props> = ({ firstName, onClick }) => {
  let name = '';
  if (firstName) {
    let lastLetter = firstName[firstName.length - 1];
    if (lastLetter == 's') {
      name = firstName + "'";
    } else {
      name = firstName + "'s";
    }
  }
  return (
    <div className="teach-book-button library-button-v5">
      <div className="book-container" onClick={onClick} >
        <div className="green-hover">
          <div />
        </div>
        <SpriteIcon name="bar-chart-2" className="active" />
      </div>
      <div className="css-custom-tooltip">
        View {name} Library
      </div>
    </div>
  );
}

export default LibraryButton;
