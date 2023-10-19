import React from 'react';
import SpriteIcon from 'components/baseComponents/SpriteIcon';

interface Props {
  openClass(): void;
}

const EmptyTabContent: React.FC<Props> = ({ openClass }) => {
  return (
    <div className="tab-content loader-content empty-tab">
      <div className="tab-content-centered flex-center">
        <div className="new-class-container" onClick={openClass}>
          <div className="icon-container flex-center">
            <SpriteIcon name="glasses-sprite" className="stroke-1" />
          </div>
          <div className="bold flex-center font-20">No results found</div>
          <div className="text-center f-s-2 font-16">Please check your search term</div>
        </div>
      </div>
    </div>
  );
}

export default EmptyTabContent;