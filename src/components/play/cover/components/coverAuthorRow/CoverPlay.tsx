import React from 'react';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import './CoverPlay.scss';
import MusicWrapper from 'components/baseComponents/MusicWrapper';

interface Props {
  onClick(): any;
}

const CoverPlay: React.FC<Props> = ({ onClick }) => {
  return (
    <div className="cover-play-button">
      <div className="c-next-btn-container">
        <MusicWrapper startTime={0.15} url="/sounds/mixkit-camera-shutter-click.wav">
          <button type="button" onClick={onClick}>
            <SpriteIcon name="feather-play-circle" />
            Play Now
          </button>
        </MusicWrapper>
      </div>
    </div>
  );
};

export default CoverPlay;
