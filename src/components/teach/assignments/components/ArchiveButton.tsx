import SpriteIcon from 'components/baseComponents/SpriteIcon';
import React from 'react';

interface Props {
  isCompleted(): boolean;
  checkArchive(): void;
}

const ArchiveButton: React.FC<Props> = (props) => {
  return (
    <div className={`teach-brick-actions-container ${props.isCompleted() && 'completed'}`}>
      <div className="archive-button-container" onClick={props.checkArchive}>
        <div className="green-hover">
          <div />
        </div>
        <SpriteIcon name="archive" className="text-gray" />
      </div>
      <div className="css-custom-tooltip">
        Archive brick
      </div>
    </div>
  );
}

export default ArchiveButton;
