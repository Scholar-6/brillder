import SpriteIcon from 'components/baseComponents/SpriteIcon';
import React from 'react';

interface Props {
  openClass(): void;
}

const EmptyTabContent: React.FC<Props> = ({ openClass }) => {
  return (
    <div className="tab-content loader-content empty-tab">
      <div className={"tab-content-centered flex-center"}>
        <div className="new-class-container" onClick={openClass}>
          <div className="icon-container flex-center">
            <SpriteIcon name="glasses-sprite" className="stroke-1" />
          </div>
          <div className="bold flex-center font-20">You don’t have any classes</div>
          <div className="text-center f-s-2 font-16">Create a class to set assignments and track your students' progress</div>
          <div className="flex-center">
            <div className="btn btn-orange font-18">Create Class</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmptyTabContent;