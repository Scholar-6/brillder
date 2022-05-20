import React from 'react';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import './CoverPlay.scss';
import { User } from 'model/user';

interface Props {
  user: User;
  isAssignment: boolean;
  isAuthor: boolean;
  isPublisher: boolean;
  isCompetition?: boolean;
  isPaidEducator?: boolean;
  isLibraryUser?: boolean;
  onClick(): any;
}

const CoverCreditsPlay: React.FC<Props> = ({ user, isAssignment, isCompetition, isLibraryUser, isAuthor, isPublisher, isPaidEducator, onClick }) => {
  const renderDynamicPart = () => {
    if (!user) {
      return <div />;
    }
    if (isPaidEducator || isLibraryUser || isAssignment) {
      if (isCompetition) {
        return <div className="absolute-credits">{2}</div>;
      }
      return <div />;
    }
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
