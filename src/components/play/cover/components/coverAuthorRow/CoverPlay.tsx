import React from 'react';

interface Props {
  onClick(): any;
}

const CoverPlay: React.FC<Props> = ({onClick}) => {
  return (
    <div className="cover-play-button">
      <div>Are you ready to learn?</div>
      <div className="c-next-btn-container">
        <button type="button" onClick={onClick}>
          Play Now
        </button>
      </div>
    </div>
  );
};

export default CoverPlay;
