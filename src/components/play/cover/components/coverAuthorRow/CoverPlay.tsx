import React from 'react';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import './CoverPlay.scss';

interface Props {
  onClick(): any;
}

const CoverPlay: React.FC<Props> = ({ onClick }) => {
  return (
    <div className="cover-play-button">
      <div>Are you ready to learn?</div>
      <div className="c-next-btn-container">
        <button type="button" onClick={onClick}>
          Play Now
        </button>
      </div>
      <div className="efw-arrow-container">
        <SpriteIcon name="expample-arrow-1" />
      </div>
    </div>
  );
};

export default CoverPlay;
