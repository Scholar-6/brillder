import React from 'react';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import './CoverPlay.scss';

interface Props {
  credits?: number;
  onClick(): any;
}

const CoverCreditsPlay: React.FC<Props> = ({ credits, onClick }) => {
  return (
    <div className="cover-play-button cover-credits-play">
      <div className="c-next-btn-container">
        <button type="button" onClick={onClick}>
          <SpriteIcon name="circle-lines" />
          <div className="absolute-credits">
            {credits}
          </div>
          <SpriteIcon className="hover-icon" name="feather-play-circle" />
          Play Now
        </button>
      </div>
    </div>
  );
};

export default CoverCreditsPlay;
