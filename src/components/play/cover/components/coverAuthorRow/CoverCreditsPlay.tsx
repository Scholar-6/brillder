import React from 'react';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import './CoverPlay.scss';

interface Props {
  isAuthor: boolean;
  isPublisher: boolean;
  isCompetition?: boolean;
  onClick(): any;
}

const CoverCreditsPlay: React.FC<Props> = ({ isCompetition, isAuthor, isPublisher, onClick }) => {
  const renderDynamicPart = () => {
    if (!isAuthor && !isPublisher) {
      return (
        <div className="absolute-credits">
          {isCompetition ? 2 : 1 }
        </div>
      );
    }
    return <div />;
  }

  return (
    <div className="cover-play-button cover-credits-play">
      <div className="c-next-btn-container">
        <button type="button" onClick={onClick}>
          <SpriteIcon name="circle-lines" />
          {renderDynamicPart()}
          <SpriteIcon className={`hover-icon ${isAuthor ? 'always-visible' : ''}`} name="feather-play-circle" />
          Play Now
        </button>
      </div>
    </div>
  );
};

export default CoverCreditsPlay;
