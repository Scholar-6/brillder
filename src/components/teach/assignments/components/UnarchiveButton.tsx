import SpriteIcon from 'components/baseComponents/SpriteIcon';
import React from 'react';

interface Props {
  onClick(): void;
}

const UnarchiveButton: React.FC<Props> = (props) => {
  return (
    <div className="teach-brick-actions-container completed">
      <div className="archive-button-container" onClick={props.onClick}>
        <div className="green-hover">
          <div />
        </div>
        <SpriteIcon name="f-arrow-up-circle" className="text-gray" />
      </div>
      <div className="css-custom-tooltip bigger">
        Unarchive brick
      </div>
    </div>
  );
}

export default UnarchiveButton;
