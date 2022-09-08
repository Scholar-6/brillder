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
    // All of this is just presentation on the frontend, the actual charging is sorted out on backend
    // play is free if: anonymous user, premium educator, library user, 
    // author of the brick, publisher, or the Brick has been assigned to the user 
    if (!user || isPaidEducator || isLibraryUser || isAuthor || isPublisher || isAssignment || user.isFromInstitution) {
      return <>
       <SpriteIcon name="feather-play-circle" />
       Play
      </>
    }
    // Always charge 2 credits for a competition
    if (isCompetition) {
      return (
        <>
          <SpriteIcon name="circle-lines" />
          <div className="absolute-credits">2</div>
          <SpriteIcon className={`hover-icon ${isAuthor ? 'always-visible' : ''}`} name="feather-play-circle" />
          Play Now
        </>
      );
    }
    // All other cases are charged 1 credit
    return (
      <>
        <SpriteIcon name="circle-lines" />
        <div className="absolute-credits">1</div>
        <SpriteIcon className={`hover-icon ${isAuthor ? 'always-visible' : ''}`} name="feather-play-circle" />
        Play Now
      </>
    );
  }

  return (
    <div className="cover-play-button cover-credits-play">
      <div className="c-next-btn-container">
        <button type="button" onClick={onClick}>
          {renderDynamicPart()}
        </button>
      </div>
    </div>
  );
};

export default CoverCreditsPlay;
